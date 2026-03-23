/**
 * Custom ESM resolve hook that adds .js to extensionless relative imports.
 * Registered via esm-loader.mjs using module.register().
 */
export async function resolve(specifier, context, nextResolve) {
  if (
    (specifier.startsWith('./') || specifier.startsWith('../')) &&
    !specifier.endsWith('.js') &&
    !specifier.endsWith('.mjs') &&
    !specifier.endsWith('.cjs') &&
    !specifier.endsWith('.json') &&
    !specifier.endsWith('.node')
  ) {
    try {
      return await nextResolve(specifier + '.js', context);
    } catch {
      // fall through to default resolution
    }
  }
  return nextResolve(specifier, context);
}
