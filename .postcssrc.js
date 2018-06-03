module.exports = (ctx) => ({
  plugins: [
    require('postcss-cssnext')({ 'features': { 'rem': false } }),
    ctx.env === 'production' ? require('cssnano')({ autoprefixer: false }) : false
  ]
});
