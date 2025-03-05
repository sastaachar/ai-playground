import { deleteDeployment } from "../../server/handlers/deployment.js";
import { allowCors } from "../../server/cors-handler.js";

export const POST = deleteDeployment;
export const OPTIONS = allowCors(() => {});
