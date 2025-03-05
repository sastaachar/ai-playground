import React, { useEffect, useRef } from 'react';
import sdk, { UiViewOption } from '@stackblitz/sdk';
import appTemplate from '../../templates/App.js?raw';
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
                'index.html': `
                    <script src="index.js"></script>
                    <div id="your-own-div" style="width: 100%; height: 100%;"></div>`,
                'index.js': code || appTemplate
              },
            },
            {
              ...STACKBLITZ_EMBED_OPTIONS,
              view: type === 'deployment' ? 'preview' as UiViewOption : 'editor' as UiViewOption,
            },
          );
          stackblitzVmRef.current = vm;
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
