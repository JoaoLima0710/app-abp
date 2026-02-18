import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..', '..');

describe('Auditoria de Build / Deploy Vercel', () => {
    it('package.json existe e tem script build', () => {
        const pkgPath = path.join(ROOT, 'package.json');
        expect(fs.existsSync(pkgPath)).toBe(true);

        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        expect(pkg.scripts).toBeDefined();
        expect(pkg.scripts.build).toBeDefined();
        expect(pkg.scripts.build).toContain('vite build');
    });

    it('package.json tem script dev', () => {
        const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
        expect(pkg.scripts.dev).toBeDefined();
    });

    it('vite.config.ts existe', () => {
        const configPath = path.join(ROOT, 'vite.config.ts');
        expect(fs.existsSync(configPath)).toBe(true);
    });

    it('vite.config.ts tem path alias "@" configurado', () => {
        const content = fs.readFileSync(path.join(ROOT, 'vite.config.ts'), 'utf-8');
        expect(content).toContain('"@"');
    });

    it('tailwind.config.ts existe', () => {
        const exists =
            fs.existsSync(path.join(ROOT, 'tailwind.config.ts')) ||
            fs.existsSync(path.join(ROOT, 'tailwind.config.js'));
        expect(exists).toBe(true);
    });

    it('postcss.config.js existe', () => {
        const exists =
            fs.existsSync(path.join(ROOT, 'postcss.config.js')) ||
            fs.existsSync(path.join(ROOT, 'postcss.config.cjs'));
        expect(exists).toBe(true);
    });

    it('index.html existe e contém div#root', () => {
        const htmlPath = path.join(ROOT, 'index.html');
        expect(fs.existsSync(htmlPath)).toBe(true);

        const content = fs.readFileSync(htmlPath, 'utf-8');
        expect(content).toContain('id="root"');
    });

    it('index.css existe e usa @tailwind directives ou @import', () => {
        const cssPath = path.join(ROOT, 'src', 'index.css');
        expect(fs.existsSync(cssPath)).toBe(true);

        const content = fs.readFileSync(cssPath, 'utf-8');
        const hasTailwind = content.includes('@tailwind') || content.includes('tailwindcss');
        expect(hasTailwind).toBe(true);
    });

    it('TypeScript config existe', () => {
        const tsPath = path.join(ROOT, 'tsconfig.json');
        expect(fs.existsSync(tsPath)).toBe(true);
    });

    it('src/main.tsx existe (entry point)', () => {
        const mainPath = path.join(ROOT, 'src', 'main.tsx');
        expect(fs.existsSync(mainPath)).toBe(true);
    });

    it('src/App.tsx existe (root component)', () => {
        const appPath = path.join(ROOT, 'src', 'App.tsx');
        expect(fs.existsSync(appPath)).toBe(true);
    });

    it('Todas as dependências críticas estão no package.json', () => {
        const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        const critical = [
            'react',
            'react-dom',
            'react-router-dom',
            'vite',
            'typescript',
            'tailwindcss',
            'zustand',
        ];

        critical.forEach((dep) => {
            expect(deps[dep]).toBeDefined();
        });
    });

    it('Não há referências a variáveis de ambiente obrigatórias sem fallback', () => {
        // Check that App.tsx doesn't crash on missing env vars
        const appContent = fs.readFileSync(path.join(ROOT, 'src', 'App.tsx'), 'utf-8');
        // If VITE_ env vars are used without ?? or || fallback, flag it
        const envUsages = appContent.match(/import\.meta\.env\.\w+/g) || [];
        // Simply verify App.tsx doesn't hard-depend on environment variables
        // (It currently doesn't, which is the expected pass)
        expect(envUsages.length).toBe(0);
    });

    it('Componentes shadcn/ui base estão presentes', () => {
        const uiDir = path.join(ROOT, 'src', 'components', 'ui');
        expect(fs.existsSync(uiDir)).toBe(true);

        const requiredComponents = [
            'button.tsx',
            'card.tsx',
            'badge.tsx',
            'progress.tsx',
        ];

        requiredComponents.forEach((component) => {
            expect(fs.existsSync(path.join(uiDir, component))).toBe(true);
        });
    });
});
