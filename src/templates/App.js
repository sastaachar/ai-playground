import {
  init,
  SearchEmbed,
  EmbedEvent,
  AuthType,
} from "@thoughtspot/visual-embed-sdk";
import './styles.css'; 
  
// Use prefetch to load static resources early and optimize response time. 
// Call init early to complete authentication during app load for better performance.
init({
  thoughtSpotHost: "https://embed-1-do-not-delete.thoughtspotstaging.cloud",
  authType: AuthType.None,
});

const embed = new SearchEmbed("#your-own-div", {
    frameParams: {},
});

embed
  // Register event handlers
  .on(EmbedEvent.Init, showLoader)
  .on(EmbedEvent.Load, hideLoader)
  /*param-start-customActionHandle*//*param-end-customActionHandle*/
  .on("answerPageLoading", payload =>
    console.log("message received from embedded view" + JSON.stringify(payload))
  )
  .on(EmbedEvent.Error, (error) => {
        if(error?.data?.errorType === 'FULLSCREEN' || error?.data?.errorType === 'API') {
          showErrorBanner('none');
        } else 
        if(typeof(error.error) === 'string' || typeof(error.data) === 'string') {
          showErrorBanner('flex', error.error || error.data);
        } else {
          showErrorBanner('flex');
        }
        console.log('Error test', error);
        hideLoader();
    })
  .render();

// Function to show/hide
function setDisplayStyle(el, style) {
  if(document.getElementById(el)) {
    document.getElementById(el).style.display = style;
  }
}

function showErrorBanner(display, errorText) {
  setDisplayStyle("errorBanner", display);
  if(errorText) {
    document.getElementById("errorBanner").firstElementChild.innerText = errorText;
  }
}

// Functions to show and hide a loader while iframe loads
function showLoader() {
  setDisplayStyle("loader", "block");
}
function hideLoader() {
  setDisplayStyle("loader", "none");
}
