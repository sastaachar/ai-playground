export const JS_HOST = import.meta.env.VITE_DEFAULT_HOST || "https://try-everywhere.thoughtspot.cloud";
export const JS_USERNAME = import.meta.env.VITE_DEFAULT_USERNAME || "demo_devuser";
export const JS_PASSWORD = import.meta.env.VITE_DEFAULT_PASSWORD || "PassWord1!";
export const LIVEBOARD_ID = import.meta.env.VITE_DEFAULT_LIVEBOARD_ID || "b173faa2-e861-4540-a232-853f7aeb2c37"; 


import { UiViewOption } from '@stackblitz/sdk';


const STACKBLITZ_FILE_OPTIONS = {
    
    dependencies: {
        '@thoughtspot/visual-embed-sdk': 'latest',
    }
}

const STACKBLITZ_EMBED_OPTIONS = {
    height: '100%',
    hideExplorer: true,
    hideNavigation: true,
    view: 'editor' as UiViewOption,
    openFile: 'index.js',
    terminalHeight: 0,
    hideDevTools: true,
}


export { STACKBLITZ_FILE_OPTIONS, STACKBLITZ_EMBED_OPTIONS };