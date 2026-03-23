/**
 * ESM loader registration hook.
 * Import this file via --import to register the custom ESM resolver
 * that adds .js extensions to extensionless relative imports.
 * 
 * Required because Prisma 7 generates TypeScript with extensionless
 * relative imports, and tsc preserves them in the JS output.
 */
import { register } from 'node:module';

register('./esm-resolve.mjs', import.meta.url);
