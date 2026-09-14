const fs = require('fs');
const file = 'src/pages/auth/callback.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove startFlow imports
content = content.replace(/import \{ isStartFlowReady, navigateToSavedStartFlow, readStartFlowState \} from '\.\.\/\.\.\/lib\/startFlow';\n/, '');

// Replace session handler
const oldSessionHandler =       if (session) {
        const startFlow = readStartFlowState();

        if (startFlow && !isStartFlowReady(startFlow)) {
          router.replace('/');
          return;
        }

        await navigateToSavedStartFlow(router);
      };
      
const newSessionHandler =       if (session) {
        const redirectPath = router.query.redirect || '/dashboard';
        router.replace(redirectPath as string);
      };

content = content.replace(oldSessionHandler, newSessionHandler);

fs.writeFileSync(file, content);
console.log('Done refactoring auth/callback.tsx');
