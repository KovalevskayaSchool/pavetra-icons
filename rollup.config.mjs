import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fg from "fast-glob"

const components = fg.sync(['src/lib/*/**.tsx'], {
  onlyFiles: true,
  ignore: [],
  unique: true,
});

const config = {
  input: [...components, 'src/lib/index.ts'],
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ],
};

export default config;

