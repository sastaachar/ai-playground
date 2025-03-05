import { getDeployment } from "../../server/handlers/deployment.js";
import { allowCors } from "../../server/cors-handler.js";

export const POST = getDeployment;
export const OPTIONS = allowCors(() => {});
