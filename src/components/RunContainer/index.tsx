import { useEffect } from "react";
import "./styles.css";

const RunContainer = () => {
  const updateCode = (code: string) => {
    const script = document.createElement("script");
    script.id = "run-container-script";
    script.type = "module";

    if (document.getElementById("run-container-script")) {
      if (
        document.getElementById("run-container-script")?.textContent === code
      ) {
        return;
      }
      document.getElementById("run-container-script")?.remove();
    }

    code = code.replace(
      "@thoughtspot/visual-embed-sdk",
      "https://cdn.jsdelivr.net/npm/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js"
    );

    code = code.replace("import \"./index.css\";", "");
    script.textContent = code;

    console.log("code", code);

    document.getElementById("run-container")?.appendChild(script);
    console.log("script", script);
  };

  useEffect(() => {
    console.log("runing");

    const handleMessage = (event) => {
      if (event.data.type === "updateCode") {
        const { code } = event.data;
        updateCode(code);
      }
    };
    window.addEventListener("message", handleMessage);

    window.parent.postMessage({ type: "ready" });

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div id="run-container">
      <div id="your-own-div" />
    </div>
  );
};

export default RunContainer;
