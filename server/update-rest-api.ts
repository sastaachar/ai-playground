import SwaggerParser from "@apidevtools/swagger-parser";
import fs from 'fs'
import { compile } from "json-schema-to-typescript";

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

    const apiContent = {
      apiName: method.operationId,
      requestType,
      responseType,
      methodName,
      path,
      description: method.description,
    }    

    apiContents.push(apiContent)
  }

  // store in a file 
  fs.writeFileSync('rest-api-spec.json', JSON.stringify(apiContents, null, 2))

  return apiContents;
}

const convertRestDataToVector = (apiContents: RestApiContent[]) => {  
  const vectorEmbeddings = apiContents.map((apiContent) => {
    return {
      apiName: apiContent.apiName,
    }
  })

  return vectorEmbeddings;
}

async function main() {
  const apiContents = await createRestApiData();

  // create vector embeddings for each api content
  const vectorEmbeddings = convertRestDataToVector(apiContents);
}
main()