import React, { useEffect, useState } from 'react';
import Stackblitz from '../Stackblitz';

export const Deployment: React.FC<{deploymentId: string}> = ({deploymentId}) => {
    const [code, setCode] = useState<string>("");

    useEffect(() => {
        const fetchDeployment = async () => {
            const response = await fetch(`http://localhost:5173/api/deployment/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: deploymentId})
            });
            const data = await response.json();
            console.log(data.code);
            setCode(data.code);
        }
        fetchDeployment();
    }, []);

    return (
        <div style={{width: '100%', height: '100%'}}>
            <Stackblitz code={code} key={code} type="deployment" />
        </div>
    )
}