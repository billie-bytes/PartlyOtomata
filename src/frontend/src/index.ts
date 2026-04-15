const PORT = 3000;

Bun.serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url);

    // Serve bundled app
    if (url.pathname === '/app.js') {
      try {
        const result = await Bun.build({
          entrypoints: ['./src/frontend.tsx'],
          target: 'browser',
          sourcemap: 'external',
        });

        const code = await result.outputs[0].text();
        return new Response(code, {
          headers: { 'Content-Type': 'application/javascript' },
        });
      } catch (err) {
        console.error('Build error:', err);
        return new Response('Failed to build app', { status: 500 });
      }
    }

    // Try to serve static files
    try {
      const file = await Bun.file(`./src${url.pathname}`).text();
      const contentType = getContentType(url.pathname);
      return new Response(file, {
        headers: { 'Content-Type': contentType },
      });
    } catch {
      // SPA Fallback: Serve HTML for all other routes (React Router will handle them)
      return new Response(getHTMLTemplate(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  },
});

function getHTMLTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PartlyOtomata - DOM Tree Visualization</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    #root { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="/app.js"></script>
</body>
</html>`;
}

function getContentType(pathname: string): string {
  if (pathname.endsWith('.ts') || pathname.endsWith('.tsx')) return 'application/typescript';
  if (pathname.endsWith('.js')) return 'application/javascript';
  if (pathname.endsWith('.json')) return 'application/json';
  if (pathname.endsWith('.css')) return 'text/css';
  if (pathname.endsWith('.html')) return 'text/html';
  return 'application/octet-stream';
}

console.log(`Server running at http://localhost:${PORT} 🚀`);
