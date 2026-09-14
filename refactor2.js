const fs = require('fs');
const file = 'src/pages/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace handleLogin old start flow check
content = content.replace(/    const savedStartFlow = readStartFlowState\(\);\n    if \(savedStartFlow && !isStartFlowReady\(savedStartFlow\)\) \{\n      return;\n    \}\n\n    await navigateToSavedStartFlow\(router\);\n/g, "    const redirectPath = router.query.redirect || '/dashboard';\n    router.push(redirectPath as string);\n");

// Replace handleSignup old start flow check
content = content.replace(/      const savedStartFlow = readStartFlowState\(\);\n      if \(savedStartFlow && !isStartFlowReady\(savedStartFlow\)\) \{\n        return;\n      \}\n\n      await navigateToSavedStartFlow\(router\);\n      return;\n/g, "      const redirectPath = router.query.redirect || '/dashboard';\n      router.push(redirectPath as string);\n      return;\n");

// Handle OAuth
content = content.replace(/        redirectTo: \\$\{window.location.origin\}\/auth\/callback\,\n/g, "        redirectTo: \\$\{window.location.origin\}\/auth\/callback?redirect=\$\{router.query.redirect || '/dashboard'\}\,\n");

fs.writeFileSync(file, content);
console.log('Done refactoring Auth logic in index.tsx');
