import '../bundle';
import { buildGridFromMetadata } from '../components/dynamic-grid-builder';

document.addEventListener('DOMContentLoaded', async () => {
    const containerId = 'admin-config-root';
    const container = document.getElementById(containerId);
    if (!container) return;

    // fetch sample metadata for dev
    const metadata = await (window as any).bdApi.get('/api/metadata/sample');
    // Render a simple grid placeholder
    buildGridFromMetadata(metadata, containerId);
});