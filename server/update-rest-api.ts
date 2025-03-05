import SwaggerParser from "@apidevtools/swagger-parser";
import fs from 'fs'
import { compile } from "json-schema-to-typescript";
import OpenAI from "openai";
import { EMBEDDING_MODEL } from "./types";
import { config } from "./constants";

type RestApiContent = {
  apiName: string;
  requestType: string;
  responseType: string;
  methodName: string;
  path: string;
  description: string;
}

async function createRestApiData(): Promise<RestApiContent[]> {
  const specURL = 'https://raw.githubusercontent.com/thoughtspot/rest-api-sdk/refs/heads/release/api-spec/openapiSpecv3-2_0.json'
  const response = await fetch(specURL)
  const spec = await response.json()

  // create spec in file
  fs.writeFileSync('rest-api-spec.json', JSON.stringify(spec, null, 2))

  const parsedSpec = await SwaggerParser.dereference(spec)

  const apiContents = []

  for (const path in parsedSpec.paths) {

    const methodName = parsedSpec.paths[path].get ? 'get' : 'post';

    const method = parsedSpec.paths[path][methodName]; 
    const requestSchema = (method as any)?.requestBody?.content?.['application/json']?.schema;
    const requestType = requestSchema ? await compile(requestSchema, method.operationId+"Request", {
      bannerComment: `/* Request type for ${method.operationId} */`
     }) : "Doesnt take request body";

    const responseSchema = (method as any)?.responses['200']?.content?.['application/json']?.schema;
    const responseType = responseSchema ? await compile(responseSchema, method.operationId+"Response", {
      bannerComment: `/* Response type for ${method.operationId} */`
     }) : "Doesnt return anything";

    const description = `ApiPath:${path}, Name:${method.operationId} Method:${methodName} \n\nDescription: ${method.description}`

    const apiContent = {
      apiName: method.operationId,
      requestType,
      responseType,
      methodName,
      path,
      description,
    }    

    apiContents.push(apiContent)
  }

  const operationIds = Object.keys(parsedSpec.paths).map(path => (parsedSpec.paths[path].get || parsedSpec.paths[path].post).operationId);
  console.log(operationIds.join(', v2api:'));
  // store in a file 
  fs.writeFileSync('rest-api-data.json', JSON.stringify(apiContents, null, 2))

  return apiContents;
}

const convertRestDataToVector = async (apiContents: RestApiContent[]) => {  

  const model = EMBEDDING_MODEL.TEXT_EMBEDDING_3_LARGE;
  const key = config.AI.CREDS[model].API_KEY;
  const link = config.AI.CREDS[model].API_LINK;

  console.log(key, link);

  const openai = new OpenAI({
    apiKey: key, // Azure OpenAI API Key
    baseURL: link,
    defaultHeaders: { "api-key": key }, // Required for Azure
  });

  const first = apiContents[0];

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL.TEXT_EMBEDDING_3_LARGE, // Model you deployed, e.g., "text-embedding-ada-002"
    input: first.description,    
  });

  const vectorEmbeddings = response.data[0].embedding;

  console.log(vectorEmbeddings);

  return vectorEmbeddings;
}

async function main() {
  const apiContents = await createRestApiData();

  // create vector embeddings for each api content
  // const vectorEmbeddings = await convertRestDataToVector(apiContents);
}
main()