const fs = require('fs');
const file = 'src/pages/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove imports and options (lines 21-56 approx)
content = content.replace(/import\s*\{\s*StartFlowGoal,[\s\S]*?\} from '\.\.\/lib\/startFlow';\n*/g, '');
content = content.replace(/const startFlowIntentOptions[\s\S]*?\];\n*/g, '');
content = content.replace(/const startFlowProfileOptions[\s\S]*?\];\n*/g, '');
content = content.replace(/const startFlowGoalOptions[\s\S]*?\];\n*/g, '');

// Remove state variables
content = content.replace(/  const \[isStartFlowOpen, setIsStartFlowOpen\] = useState\(false\);\n/g, '');
content = content.replace(/  const \[startFlowStep, setStartFlowStep\] = useState\(0\);\n/g, '');
content = content.replace(/  const \[startFlowIntent, setStartFlowIntent\] = useState<StartFlowIntent>\('test'\);\n/g, '');
content = content.replace(/  const \[startFlowProfileType, setStartFlowProfileType\] = useState<StartFlowProfileType>\('founder-business'\);\n/g, '');
content = content.replace(/  const \[startFlowGoal, setStartFlowGoal\] = useState<StartFlowGoal>\('clarity'\);\n/g, '');
content = content.replace(/  const \[startFlowBrandName, setStartFlowBrandName\] = useState\(''\);\n/g, '');
content = content.replace(/  const \[typedWelcomeHeadline, setTypedWelcomeHeadline\] = useState\(''\);\n/g, '');

// Remove sessionUser useEffect for start flow
content = content.replace(/  useEffect\(\(\) => \{\n    if \(!sessionUser\) return;\n\n    const savedStartFlow = readStartFlowState\(\);\n[\s\S]*?  \}, \[sessionUser\]\);\n*/g, '');

// Remove typedWelcomeHeadline useEffect
content = content.replace(/  useEffect\(\(\) => \{\n    if \(!isStartFlowOpen \|\| startFlowStep !== 0\) return;\n[\s\S]*?  \}, \[isStartFlowOpen, startFlowStep, welcomeHeadline\]\);\n*/g, '');

// Remove functions openStartFlow through startExperience
content = content.replace(/  const openStartFlow = \([\s\S]*?  const handleContactSubmit/g, '  const handleContactSubmit');

// Replace the button onClick in the bottom CTA
content = content.replace(/onClick=\{\(\) => openStartFlow\('test'\)\}/g, "onClick={() => { if (sessionUser) { router.push('/dashboard/diagnostic/1'); } else { router.push('/onboarding'); } }}");

// Remove the Modal block for isStartFlowOpen
// It spans from <Modal isOpen={isStartFlowOpen} to just before {/* Unified Auth Modal */}
content = content.replace(/      <Modal isOpen=\{isStartFlowOpen\} onClose=\{closeStartFlow\}>[\s\S]*?      \{\/\* Unified Auth Modal \*\/\}/g, '      {/* Unified Auth Modal */}');

fs.writeFileSync(file, content);
console.log('Done refactoring index.tsx');
