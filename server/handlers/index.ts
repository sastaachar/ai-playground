import { allowCors } from "../cors-handler.js"
import { ask } from "./convo/ask.js"
import { createDeployment as _createDeployment, getAllDeployments as _getAllDeployments, updateDeployment as _updateDeployment } from "./deployment.js"

const convoAsk = allowCors(ask)
const createDeployment = allowCors(_createDeployment)
const getAllDeployments = allowCors(_getAllDeployments)
const updateDeployment = allowCors(_updateDeployment)

export {
  convoAsk,
  createDeployment,
  getAllDeployments,
  updateDeployment
}