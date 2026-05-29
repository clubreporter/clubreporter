import fs from 'node:fs';
import path from 'node:path';
import { SPA_FALLBACK_ROUTES } from './spa-fallback-routes.js';

/** Copy dist/index.html to 404.html and route folders for static hosts (Base44, etc.) */
export function spaFallbackPlugin() {
  return {
    name: 'clubreporter-spa-fallback',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve('dist');
      const indexPath = path.join(distDir, 'index.html');

      if (!fs.existsSync(indexPath)) {
        console.warn('[spa-fallback] dist/index.html not found, skipping');
        return;
      }

      const html = fs.readFileSync(indexPath, 'utf8');

      fs.writeFileSync(path.join(distDir, '404.html'), html);

      for (const route of SPA_FALLBACK_ROUTES) {
        const dir = path.join(distDir, route);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
      }

      console.log(`[spa-fallback] Wrote 404.html + ${SPA_FALLBACK_ROUTES.length} route fallbacks`);
    },
  };
}
