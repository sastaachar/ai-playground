import React, { useEffect, useRef } from 'react';
import sdk from '@stackblitz/sdk';
import appTemplate from '../../templates/App.js?raw';
import indexTemplate from '../../templates/index.html?raw';
import stylesTemplate from '../../templates/styles.css?raw';
import { STACKBLITZ_EMBED_OPTIONS, STACKBLITZ_FILE_OPTIONS } from '../../constants';

interface StackblitzProps {
  code?: string;
  type?: 'deployment' | 'editor';
}

const Stackblitz: React.FC<StackblitzProps> = ({ code = '' , type = 'embed'}) => {
  const embedRef = useRef<HTMLDivElement>(null);
  const stackblitzVmRef = useRef<any>(null);

  useEffect(() => {
    const embed = async () => {
      if (embedRef.current) {
        try {
          const vm = await sdk.embedProject(
            embedRef.current,
            {
              ...STACKBLITZ_FILE_OPTIONS,
              title: 'ThoughtSpot Embed',
              template: 'javascript',
              files: {
                'index.html': indexTemplate,
                'index.js': code || appTemplate,
                'index.css': stylesTemplate
              },
            },
            {
              ...STACKBLITZ_EMBED_OPTIONS,
              view: 'preview',
            },
          );
          stackblitzVmRef.current = vm;
    
          (window as any)._vm = vm;    
        } catch (error) {
          console.error('Error embedding StackBlitz:', error);
        }
      }
    };

    embed();
  }, []);

  useEffect(() => {
    if (stackblitzVmRef.current) {
      try {
        stackblitzVmRef.current.applyFsDiff({
          create: {
            'index.js': code 
          },
          destroy: [],
        }).catch((error: Error) => console.error('Error updating file:', error));
      } catch (error) {
        console.error('Error applying file system diff:', error);
      }
    }
  }, [code]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        ref={embedRef}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '0',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default Stackblitz;
