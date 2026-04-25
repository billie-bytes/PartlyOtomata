const PORT = process.env.PORT || 3000;
const server = Bun.serve({
  hostname: "0.0.0.0",
  port: Number(PORT),
  async fetch(req) {
    const url = new URL(req.url);

    // 1. App Bundle
    if (url.pathname === '/app.js') {
      const result = await Bun.build({
        entrypoints: ['./src/frontend.tsx'],
        target: 'browser',
      });
      return new Response(result.outputs[0]);
    }

    // 2. Compiled CSS
    if (url.pathname === '/index.css') {
      const css = Bun.file('./dist/index.css');
      if (await css.exists()) {
        return new Response(css, { headers: { 'Content-Type': 'text/css' } });
      }
    }

    // 3. The HTML Template
    return new Response(getHTMLTemplate(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
});

console.log(`Server running at ${server.url}`);

function getHTMLTemplate() {
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