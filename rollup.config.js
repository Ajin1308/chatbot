// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

export default [
  // UMD build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/chatbot.js',
      format: 'umd',
      name: 'Chatbot',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      },
      sourcemap: true,
    },
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      typescript(),
      resolve(),
      commonjs(),
      postcss({
        extract: false,
        modules: false,
      }),
      terser(),
    ],
    external: ['react', 'react-dom'],
  },
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/chatbot.mjs',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      typescript(),
      resolve(),
      commonjs(),
      postcss({
        extract: 'chatbot.css',
        modules: false,
      }),
      terser(),
    ],
    external: ['react', 'react-dom'],
  },
];