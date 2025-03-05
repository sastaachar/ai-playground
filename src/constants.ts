export const JS_HOST = "https://172.32.93.13:8443";
export const JS_USERNAME = "tsadmin";
export const JS_PASSWORD = "4Xyc1f%[H^3L";

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