# Migration from Next.js to Vite

This project has been successfully migrated from Next.js to Vite. Here are the key changes made:

## What Changed

### 1. Package.json Updates
- Removed Next.js dependencies (`next`, `eslint-config-next`)
- Added Vite dependencies (`vite`, `@vitejs/plugin-react`, `vite-plugin-svgr`)
- Added React Router DOM for client-side routing
- Updated scripts to use Vite commands
- Added `"type": "module"` for ES modules

### 2. Configuration Files
- **vite.config.ts**: New Vite configuration with React plugin and SVG support
- **tsconfig.json**: Updated for Vite compatibility
- **tsconfig.node.json**: New TypeScript config for Node.js tools
- **eslint.config.mjs**: Updated ESLint config for Vite

### 3. Entry Point
- **index.html**: New HTML entry point for Vite
- **src/main.tsx**: New React entry point
- **src/App.tsx**: Main App component with React Router

### 4. File Structure Changes
- Moved from Next.js App Router to React Router
- Created `src/pages/` directory for page components
- Created `src/layouts/` directory for layout components
- Removed Next.js specific files (`next.config.ts`, `next-env.d.ts`)

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Key Benefits of Vite

1. **Faster Development**: Vite provides instant hot module replacement (HMR)
2. **Faster Builds**: Uses esbuild for faster builds
3. **Better Developer Experience**: Faster startup and reload times
4. **Modern Tooling**: Built on modern web standards

## Routing Changes

The app now uses React Router instead of Next.js file-based routing:

- `/` → Dashboard
- `/login` → Login page
- `/register` → Register page
- `/profile` → Profile page
- `/calendar` → Calendar page
- And more...

## SVG Support

SVG files are now handled by `vite-plugin-svgr` instead of `@svgr/webpack`.

## Environment Variables

Create a `.env` file in the root directory for environment variables. Vite uses `VITE_` prefix for public variables.

## Notes

- All existing components and contexts remain unchanged
- Tailwind CSS configuration remains the same
- TypeScript configuration updated for Vite compatibility
- ESLint rules updated for React and TypeScript best practices

## Troubleshooting

If you encounter any issues:

1. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check that all imports use the correct paths (use `@/` alias) 