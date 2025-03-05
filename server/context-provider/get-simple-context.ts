const SIMPLE_CONTEXT = `
Answer this query : {query} 

if this is regarding embedding thoughtspot, follow below 
give proper docs and links, and provide one single code block using javascript
import like \`import { ...imports } from '@thoughtspot/visual-embed-sdk\`';
Available components are \`SearchEmbed, LiveboardEmbed, AppEmbed\`
Don't forget to add code for init, if user wants customizations, using style customization
example code for a liveboard embed
import { init } from '@thoughtspot/visual-embed-sdk';
init({...init});
cont embed = new LiveboardEmbed("EMBED_SELECTOR", {...config});
embed.render();
`

export const addSimpleContext = (query: string) => {
  return SIMPLE_CONTEXT.replace("{query}", query);
}