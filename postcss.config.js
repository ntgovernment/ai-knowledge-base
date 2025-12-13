const isProd = process.env.NODE_ENV === "production";

module.exports = {
  plugins: {
    "postcss-import": {},
    autoprefixer: {},
    ...(isProd ? { cssnano: { preset: "default" } } : {}),
  },
};
