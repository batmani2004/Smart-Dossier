export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Something went wrong — Smart Dossier</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        font: 15px/1.6 system-ui, -apple-system, sans-serif;
        background: #0f172a;
        color: #f1f5f9;
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
      }
      .card {
        max-width: 26rem;
        width: 100%;
        text-align: center;
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 1rem;
        padding: 2.5rem 2rem;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
      }
      .icon-wrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background: rgba(239,68,68,0.15);
        margin-bottom: 1.25rem;
      }
      .icon-wrap svg { color: #f87171; }
      .brand {
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #3b82f6;
        margin-bottom: 0.75rem;
      }
      h1 { font-size: 1.2rem; font-weight: 600; margin: 0 0 0.5rem; color: #f1f5f9; }
      p { font-size: 0.875rem; color: #94a3b8; margin: 0 0 2rem; }
      .actions { display: flex; gap: 0.625rem; justify-content: center; flex-wrap: wrap; }
      a, button {
        padding: 0.5rem 1.25rem;
        border-radius: 0.5rem;
        font: 0.875rem/1 inherit;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid transparent;
        transition: opacity 0.15s;
      }
      a:hover, button:hover { opacity: 0.85; }
      .primary { background: #3b82f6; color: #fff; }
      .secondary { background: transparent; color: #cbd5e1; border-color: #334155; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div class="brand">Smart Dossier</div>
      <h1>Something went wrong</h1>
      <p>We ran into an unexpected error. Try refreshing — if it keeps happening, head back to the home page.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
