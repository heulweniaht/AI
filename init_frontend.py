import os
import json

root = r"c:\Users\thaii\Downloads\AI\smart-healthcare-booking\frontend"

# 1. package.json
pkg = {
  "name": "frontend",
  "private": True,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "zustand": "^4.4.7",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  }
}
with open(os.path.join(root, "package.json"), "w", encoding="utf-8") as f:
    json.dump(pkg, f, indent=2)

# 2. tsconfig.json
tsconfig = {
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": True,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": True,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": True,
    "resolveJsonModule": True,
    "isolatedModules": True,
    "noEmit": True,
    "jsx": "react-jsx",
    "strict": True,
    "noUnusedLocals": True,
    "noUnusedParameters": True,
    "noFallthroughCasesInSwitch": True
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
with open(os.path.join(root, "tsconfig.json"), "w", encoding="utf-8") as f:
    json.dump(tsconfig, f, indent=2)

# 2.1 tsconfig.node.json
tsconfig_node = {
  "compilerOptions": {
    "composite": True,
    "skipLibCheck": True,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": True
  },
  "include": ["vite.config.ts"]
}
with open(os.path.join(root, "tsconfig.node.json"), "w", encoding="utf-8") as f:
    json.dump(tsconfig_node, f, indent=2)

# 3. vite.config.ts
vite_cfg = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
"""
with open(os.path.join(root, "vite.config.ts"), "w", encoding="utf-8") as f:
    f.write(vite_cfg)

# 4. tailwind.config.ts
tw_cfg = """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"""
with open(os.path.join(root, "tailwind.config.ts"), "w", encoding="utf-8") as f:
    f.write(tw_cfg)

# 5. postcss.config.js
pc_cfg = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"""
with open(os.path.join(root, "postcss.config.js"), "w", encoding="utf-8") as f:
    f.write(pc_cfg)

# 6. index.html
html = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Smart Healthcare Booking</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"""
with open(os.path.join(root, "index.html"), "w", encoding="utf-8") as f:
    f.write(html)
if os.path.exists(os.path.join(root, "public/index.html")):
    os.remove(os.path.join(root, "public/index.html"))

# 7. src/index.css
css = """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
"""
with open(os.path.join(root, "src/index.css"), "w", encoding="utf-8") as f:
    f.write(css)

# 8. src/main.tsx
main_tsx = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"""
with open(os.path.join(root, "src/main.tsx"), "w", encoding="utf-8") as f:
    f.write(main_tsx)

# 9. src/App.tsx
app_tsx = """import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-6 transform transition-all hover:scale-105 duration-300">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Healthcare System
            </h1>
            <p className="text-gray-500 font-medium">Frontend is successfully initialized and running!</p>
        </div>
        <div className="pt-4">
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-1">
            Get Started
            </button>
        </div>
      </div>
    </div>
  );
}

export default App;
"""
with open(os.path.join(root, "src/App.tsx"), "w", encoding="utf-8") as f:
    f.write(app_tsx)
