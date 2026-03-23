#!/usr/bin/env node
/**
 * Post-build script to add .js extensions to relative imports
 * in compiled Prisma generated files (dist/src/generated/prisma/).
 * Prisma 7 generates ESM TypeScript with extensionless relative imports.
 * When tsc compiles these, the output JS also lacks extensions,
 * which breaks Node.js ESM resolution.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const GENERATED_DIR = join(process.cwd(), 'dist', 'src', 'generated', 'prisma');

function fixImportsInFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  const original = content;

  // Fix: from './foo' → from './foo.js' (only if not already .js)
  content = content.replace(
    /(from\s+['"])(\.\.?\/[^'"]+?)(?<!\.js)(['"])/g,
    '$1$2.js$3'
  );

  // Fix: require('./foo') → require('./foo.js')
  content = content.replace(
    /(require\s*\(\s*['"])(\.\.?\/[^'"]+?)(?<!\.js)(['"]\s*\))/g,
    '$1$2.js$3'
  );

  if (content !== original) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`  Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      fixImportsInFile(fullPath);
    }
  }
}

console.log('Fixing ESM imports in generated Prisma files...');
walkDir(GENERATED_DIR);
console.log('Done.');
