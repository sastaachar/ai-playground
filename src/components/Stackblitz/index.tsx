import React, { useEffect, useRef } from 'react';
import sdk from '@stackblitz/sdk';
import appTemplate from '../../templates/App.tsx?raw';
import { STACKBLITZ_EMBED_OPTIONS, STACKBLITZ_FILE_OPTIONS } from '../../constants';

interface StackblitzProps {
  code?: string;
}

const Stackblitz: React.FC<StackblitzProps> = ({ code = '' }) => {
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
              template: 'create-react-app'
            },
            {
              ...STACKBLITZ_EMBED_OPTIONS,
            }
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
      stackblitzVmRef.current.applyFsDiff({
        create: {
          'src/App.tsx': code || appTemplate
        },
        destroy: [] 
      }).catch((error: Error) => console.error('Error updating file:', error));
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
        overflow: 'hidden'
      }} 
    />
    </div>
  );
};

export default Stackblitz;
