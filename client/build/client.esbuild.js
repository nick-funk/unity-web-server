const esbuild = require("esbuild");

esbuild.buildSync({
  entryPoints: ["src/client/index.tsx"],
  bundle: true,
  outfile: "output/client/index.js",
  minify: true,
  sourcemap: true,
  platform: "browser",
  target: "es6",
  tsconfig: "client.tsconfig.json",
});
