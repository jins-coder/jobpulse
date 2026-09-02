import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import { app as expressApp } from './server/index.js'

// Express Node.js Backend Plugin for Vite Dev Server
function expressBackendPlugin() {
  return {
    name: 'express-backend-plugin',
    configureServer(server) {
      server.middlewares.use(expressApp);
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const host = env.AIVEN_OPENSEARCH_HOST || 'os-314a7181-managethedev-7614.c.aivencloud.com'
  const port = env.AIVEN_OPENSEARCH_PORT || '25717'
  const user = env.AIVEN_OPENSEARCH_USER || 'avnadmin'
  const pass = env.AIVEN_OPENSEARCH_PASSWORD || ''
  const auth = Buffer.from(`${user}:${pass}`).toString('base64')

  return {
    plugins: [vue(), expressBackendPlugin()],
    server: {
      proxy: {
        '/api/opensearch': {
          target: `https://${host}:${port}`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/opensearch/, ''),
          headers: {
            'Authorization': `Basic ${auth}`
          }
        }
      }
    }
  }
})
