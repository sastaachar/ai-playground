import { getDbClient } from "../db/prisma/client.js";
import omitBy from "lodash/omitBy.js";
import isUndefined from "lodash/isUndefined.js";
export const getAllDeployments = async (req: Request) => {
  const { username, host } = await req.json();

  if (!username) {
    return new Response('No username provided', { status: 400 });
  }

  const prisma = getDbClient();
  const deployments = await prisma.deployment.findMany({
    where:
    {
      username: username,
      host: host
    }
  });
  return new Response(JSON.stringify(deployments), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export const createDeployment = async (req: Request) => {
  const body = await req.json();

  const requiredFields = ['username', 'code', 'type', 'host'];
  const missingFields = requiredFields.filter(field => !(field in body));

  if (missingFields.length > 0) {
    return new Response(`Required fields are missing: ${missingFields.join(', ')}`, { status: 400 });
  }

  const prisma = getDbClient();
  const deployment = await prisma.deployment.create({
    data: {
      code: body.code,
      username: body.username,
      type: body.type,
      host: body.host,
    }
  });

  return new Response(JSON.stringify(deployment), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export const updateDeployment = async (req: Request) => {
    const params = await req.json();
    const payload = omitBy(params, isUndefined);

    if (!payload.id) {
        return new Response('Deployment ID is required', { status: 400 });
    }

    const prisma = getDbClient();
    const deployment = await prisma.deployment.update({
        where: { id: payload.id },
        data: payload
    });

    return new Response(JSON.stringify(deployment), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export const getDeployment = async (req: Request) => {
  const { id } = await req.json();

  if (!id) {
    return new Response('Deployment ID is required', { status: 400 });
  }

  const prisma = getDbClient();
  const deployment = await prisma.deployment.findUnique({
    where: { id }
  });

  return new Response(JSON.stringify(deployment), { status: 200, headers: { 'Content-Type': 'application/json' } }); 
} 

export const deleteDeployment = async (req: Request) => {
  const { id } = await req.json();

  if (!id) {
    return new Response('Deployment ID is required', { status: 400 });
  }

  const prisma = getDbClient();
  const deployment = await prisma.deployment.delete({
    where: { id }
  });

  return new Response(JSON.stringify(deployment), { status: 200, headers: { 'Content-Type': 'application/json' } });
}