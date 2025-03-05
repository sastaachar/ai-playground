import { getAllDeployments } from "../../server/handlers/index.js";
import { allowCors } from "../../server/cors-handler.js";

export const POST = getAllDeployments;
export const OPTIONS = allowCors(() => {});
