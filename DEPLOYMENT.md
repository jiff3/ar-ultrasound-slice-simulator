# Deployment

This project builds to static files in `dist`, so it can be deployed on Vercel or GitHub Pages.

## Vercel

Vercel can detect a Vite app automatically.

- Build command: `npm run build`
- Output directory: `dist`
- Base path: `/`

No custom Vercel config is required for the default static deployment.

## GitHub Pages

The repository includes `.github/workflows/deploy.yml`.

To deploy:

1. Push the project to a GitHub repository named `ar-ultrasound-slice-simulator`.
2. In the repository settings, enable GitHub Pages with GitHub Actions as the source.
3. Push to `main` or run the workflow manually.

The workflow installs dependencies with `npm ci`, builds with:

```bash
DEPLOY_TARGET=github-pages npm run build
```

When `DEPLOY_TARGET=github-pages`, `vite.config.ts` sets the Vite base path to:

```text
/ar-ultrasound-slice-simulator/
```

For local development, preview, and Vercel deployments, the base path remains `/`.
