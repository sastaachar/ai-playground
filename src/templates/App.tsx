import React, { useEffect, useRef } from "react";
import {
  init,
  SearchEmbed,
  EmbedEvent,
  AuthType,
  HostEvent
} from "@thoughtspot/visual-embed-sdk";

const ThoughtSpotEmbed: React.FC = () => {
  const embedRef = useRef<HTMLDivElement>(null);
  const errorBannerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize ThoughtSpot
    init({
      thoughtSpotHost: "http://localhost:3000",
      authType: AuthType.None,
      username: "tsadmin",
      password: "4Xyc1f%[H^3L",
      disableTokenVerification: true,
    });

    // Instantiate SearchEmbed
    const embed = new SearchEmbed(embedRef.current!, {
      frameParams: {},
    });

    embed
      .on(EmbedEvent.Init, showLoader)
      .on(EmbedEvent.Load, hideLoader)
      .on(EmbedEvent.Error, (error) => {
        if (error?.data?.errorType === "FULLSCREEN" || error?.data?.errorType === "API") {
          showErrorBanner("none");
        } else if (typeof error?.data === "string") {
          showErrorBanner("flex", error.data);
        } else {
          showErrorBanner("flex");
        }
        console.log("Error:", error);
        hideLoader();
      })
      .render();

      console.log("Embed initialized");
      document.getElementById('tryBtn')?.addEventListener('click', (e) => {
        embed.trigger(HostEvent.Reload);
      });

    return () => {
    };
  }, []);
  const showLoader = () => loaderRef.current && (loaderRef.current.style.display = "block");
  const hideLoader = () => loaderRef.current && (loaderRef.current.style.display = "none");

  const showErrorBanner = (display: string, errorText?: string) => {
    if (errorBannerRef.current) {
      errorBannerRef.current.style.display = display;
      if (errorText) {
        errorBannerRef.current.innerText = errorText;
      }
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "800px" }}>
      <div>
        <button id="tryBtn" style={{  top: "10px", right: "10px" }}>Run Host Event</button>
      </div>

      <div ref={loaderRef} style={{ display: "none", textAlign: "center", padding: "10px" }}>
        Loading...
      </div>
      <div ref={embedRef} style={{ width: "100%", height: "100%" }} />
      <div ref={errorBannerRef} style={{ display: "none", color: "red", padding: "10px" }}>
        <span>Error occurred</span>
        <button onClick={() => showErrorBanner("none")} style={{ marginLeft: "10px" }}>
          Close
        </button>
      </div>
      
    </div>
  );
};

export default ThoughtSpotEmbed;
