import { updateDeployment } from "../../server/handlers/index.js";
import { allowCors } from "../../server/cors-handler.js";

export const POST = updateDeployment; 
export const OPTIONS = allowCors(() => {});
