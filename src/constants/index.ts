import appCssTemplate from '../templates/App.css?raw';
import indexHtmlTemplate from '../templates/index.html?raw';
import indexTemplate from '../templates/index.tsx?raw';
import indexCssTemplate from '../templates/index.css?raw';
import appTemplate from '../templates/App.tsx?raw';
import { UiViewOption } from '@stackblitz/sdk';


const STACKBLITZ_FILE_OPTIONS = {
    title: 'React Preview',
    description: 'React Preview Environment',
    template: 'create-react-app',
    files: {
        'public/index.html': indexHtmlTemplate,
        'src/index.tsx': indexTemplate,
        'src/App.tsx': appTemplate,
        'src/App.css': appCssTemplate,
        'src/index.css': indexCssTemplate,
        'package.json': `{
        "name": "react-preview",
        "version": "1.0.0",
        "private": true,
        "dependencies": {
          "@types/react": "^18.0.0",
          "@types/react-dom": "^18.0.0",
          "@thoughtspot/visual-embed-sdk": "^1.36.1",
          "@thoughtspot/rest-api-sdk": "^2.12.0",
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-scripts": "5.0.1",
          "typescript": "^4.9.0"
        }
      }`
    }
}

const STACKBLITZ_EMBED_OPTIONS = {
    height: '100%',
    hideExplorer: true,
    hideNavigation: true,
    view: 'preview' as UiViewOption,
    openFile: 'src/App.tsx',
    terminalHeight: 0,
    hideDevTools: true
}

export { STACKBLITZ_FILE_OPTIONS, STACKBLITZ_EMBED_OPTIONS };