import { DeploymentType } from '../types';

const createDeployment = async (code: string, username: string, host: string) => {
    const response = await fetch(`http://localhost:5173/api/deployment/create`, {
        method: 'POST',
        body: JSON.stringify({ username: username, code: code, type: DeploymentType.VisualEmbedJS, host: host }),
    });
    return response.json();
}

export { createDeployment };
