import { allowCors } from "../../server/cors-handler.js";
import { createDeployment } from "../../server/handlers/index.js";

export const POST = createDeployment;
export const OPTIONS = allowCors(() => {});
