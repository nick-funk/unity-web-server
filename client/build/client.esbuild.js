const esbuild = require("esbuild");

esbuild.buildSync({
  entryPoints: ["src/client/index.ts"],
  bundle: true,
  outdir: "output/client/",
  minify: false,
  sourcemap: true,
  platform: "browser",
  target: "es6",
  tsconfig: "client.tsconfig.json",
});
