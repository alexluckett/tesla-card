import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/tesla-card.js',
  output: {
    file: 'dist/tesla-card.js',
    format: 'es',
    sourcemap: false
  },
  // Lit is bundled: Home Assistant exposes no stable Lit import to custom cards.
  plugins: [resolve(), terser({ format: { comments: false } })]
}
