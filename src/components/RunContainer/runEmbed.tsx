import { useEffect, useRef } from "react";

const RunEmbed = ({ code }: { code: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // inject iframe

    if (document.getElementById("runner-container-embed-iframe")) {
      iframeRef.current = document.getElementById("runner-container-embed-iframe") as HTMLIFrameElement;
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.id = "runner-container-embed-iframe";
    iframe.src = "/run-container";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    document.getElementById("runner-container-embed")?.appendChild(iframe);
    iframeRef.current = iframe;

  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      setTimeout(() => {
        iframeRef.current.contentWindow?.postMessage(
          { type: "updateCode", code }
        );
        console.log("posting message");
      }, 10000)
      console.log(
        "iframeRef.current",
        iframeRef.current?.contentWindow.postMessage
      );
      
    }
  }, [code]);

  return (
    <div style={{ width: "100%", height: "100%" }} id="runner-container-embed">
    </div>
  );
};

export default RunEmbed;
