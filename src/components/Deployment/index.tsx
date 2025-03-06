import React, { useEffect, useState } from "react";
import Stackblitz from "../Stackblitz";
import { useParams } from "react-router";
import { Loader } from "../Loader";

export const Deployment: React.FC = () => {
  const { deploymentId } = useParams();
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const fetchDeployment = async () => {
      const response = await fetch(`/api/deployment/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deploymentId }),
      });
      const data = await response.json();
      console.log(data.code);
      setCode(data.code);
    };
    fetchDeployment();
  }, [deploymentId]);

  if (!code) {
    return <Loader />
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Stackblitz code={code} key={code} type="deployment" />
    </div>
  );
};
