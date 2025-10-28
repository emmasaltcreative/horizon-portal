# NPM Troubleshooting Guide

When installing dependencies for the Horizon Portal, registry-related issues may block `npm install`. This guide captures common symptoms and the recovery steps that have proven reliable in our environment.

## Common Registry Errors
- `npm ERR! code E403` with `403 Forbidden - GET https://registry.npmjs.org/<package>`
- Repeated warnings about unknown registry or proxy settings
- Install attempts that stall while resolving scoped packages (e.g., `@supabase/supabase-js`)

These generally indicate that npm is still pointing at a stale registry, cached tarballs are corrupted, or a proxy cached an invalid response.

## Reset & Reinstall Script
Run the helper script at the repository root to reset the npm configuration and reinstall dependencies with relaxed peer checks:

```bash
./npm-install-reset.sh
```

The script performs the following sequence:

1. `npm config set registry https://registry.npmjs.org`
2. `rm -rf node_modules package-lock.json`
3. `npm cache clean --force`
4. `npm install --legacy-peer-deps`

## Netlify Build Tip
If Netlify encounters the same dependency resolution error, set the environment variable below in your Netlify site configuration to mirror the local fallback:

```
NPM_FLAGS="--legacy-peer-deps"
```

This flag tells the Netlify build to bypass strict peer dependency enforcement during installation.
