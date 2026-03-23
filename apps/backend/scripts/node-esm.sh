#!/bin/sh
# Wrapper to run Node.js with the custom ESM loader that resolves
# extensionless relative imports (needed for Prisma 7 generated client).
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec node --import "$SCRIPT_DIR/esm-loader.mjs" "$@"
