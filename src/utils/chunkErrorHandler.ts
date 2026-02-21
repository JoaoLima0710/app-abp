/**
 * Catches Vite dynamic import errors (chunk load errors).
 * When Vercel redeploys, the old JS chunk files are deleted. If a user has the old
 * index.html cached, it tries to fetch the missing chunk and crashes.
 * This reloads the page once to get the fresh index.html.
 */
window.addEventListener('error', (e) => {
    const target = e.target as HTMLElement;
    const isScriptError = target && target.tagName === 'SCRIPT';
    const isChunkLoadError = e.message && e.message.includes('Failed to fetch dynamically imported module');

    if (isScriptError || isChunkLoadError) {
        const hasReloaded = sessionStorage.getItem('vite_chunk_reload');
        if (!hasReloaded) {
            sessionStorage.setItem('vite_chunk_reload', 'true');
            console.warn('Chunk load error detected. Force reloading to get fresh assets...');
            window.location.reload();
        } else {
            console.error('Multiple chunk load errors. App may be broken.');
        }
    }
}, true);
