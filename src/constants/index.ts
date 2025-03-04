import appTemplate from '../templates/App.js?raw';
import stylesCssTemplate from '../templates/styles.css?raw';
import { UiViewOption } from '@stackblitz/sdk';


const STACKBLITZ_FILE_OPTIONS = {
    files: {
        'index.html': `
            <script src="index.js"></script>
            <div id="your-own-div" style="width: 100%; height: 100%;"></div>`,
        'index.js': appTemplate,
        'styles.css': stylesCssTemplate
    },
    dependencies: {
        '@thoughtspot/visual-embed-sdk': 'latest',
    }
}

const STACKBLITZ_EMBED_OPTIONS = {
    height: '100%',
    hideExplorer: true,
    hideNavigation: true,
    view: 'preview' as UiViewOption,
    openFile: 'src/App.tsx',
    terminalHeight: 0,
    hideDevTools: true,
    
}

export { STACKBLITZ_FILE_OPTIONS, STACKBLITZ_EMBED_OPTIONS };