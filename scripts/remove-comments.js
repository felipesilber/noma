/* 
  Strip all comments from JS/TS source files across the repo using the TypeScript printer.
  Safely handles JSX/TSX and modern syntax.
*/
const fs = require('fs');
const path = require('path');

function tryRequireTypeScript() {
  try {
    return require('typescript');
  } catch {
    // Fallback to backend's local install if script is run from repo root
    const backendTsPath = path.join(process.cwd(), 'app', 'backend', 'node_modules', 'typescript');
    try {
      return require(backendTsPath);
    } catch {
      console.error('Could not load TypeScript. Please ensure it is installed in app/backend.');
      process.exit(1);
    }
  }
}

const ts = tryRequireTypeScript();

const ROOTS = [path.join(process.cwd(), 'app', 'frontend'), path.join(process.cwd(), 'app', 'backend')];
const EXCLUDED_DIR_NAMES = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  '.expo',
  '.turbo',
  '.next',
  '.cache',
  'uploads',
  'assets' // keep images/fonts untouched
]);
const INCLUDED_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);

function detectScriptKind(filePath) {
  if (filePath.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (filePath.endsWith('.jsx')) return ts.ScriptKind.JSX;
  if (filePath.endsWith('.ts')) return ts.ScriptKind.TS;
  // default to JS for .js/.mjs/.cjs
  return ts.ScriptKind.JS;
}

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return INCLUDED_EXTENSIONS.has(ext);
}

function walkDir(dirPath, onFile) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDED_DIR_NAMES.has(entry.name)) continue;
      walkDir(full, onFile);
    } else if (entry.isFile()) {
      if (shouldProcessFile(full)) onFile(full);
    }
  }
}

function stripCommentsFromFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const scriptKind = detectScriptKind(filePath);
  const sourceFile = ts.createSourceFile(
    filePath,
    original,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );
  const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed });
  const printed = printer.printFile(sourceFile);
  if (printed !== original) {
    fs.writeFileSync(filePath, printed, 'utf8');
    return true;
  }
  return false;
}

let processed = 0;
let changed = 0;

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  walkDir(root, (file) => {
    processed++;
    try {
      if (stripCommentsFromFile(file)) changed++;
    } catch (err) {
      console.warn(`Skipping (parse/print error): ${path.relative(process.cwd(), file)} - ${err.message}`);
    }
  });
}

console.log(`Processed: ${processed} files`);
console.log(`Changed:   ${changed} files (comments removed)`);


