const esbuild = require('esbuild');
const isWatch = process.argv.includes('--watch');
const isProd = process.env.NODE_ENV === 'production';

const entryPoints = {
    // Core bundle — load at first in Layout
    'bundle': './ts-src/bundle.ts',
};

const buildOptions = {
    entryPoints,
    bundle: true,
    outdir: './wwwroot/js/dist',
    format: 'iife',         // browser global — window.bdApp etc
    target: ['es2020'],
    sourcemap: !isProd,
    minify: isProd,
    logLevel: 'info',
    define: {
        'process.env.NODE_ENV': isProd ? '"production"' : '"development"'
    }
};

if (isWatch) {
    esbuild.context(buildOptions).then(ctx => {
        ctx.watch();
        console.log('[esbuild] watching for changes...');
    });
} else {
    esbuild.build(buildOptions)
        .then(() => console.log('[esbuild] build complete'))
        .catch(() => process.exit(1));
}
