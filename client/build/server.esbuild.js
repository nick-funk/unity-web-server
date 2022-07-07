const esbuild = require("esbuild");

esbuild.buildSync({
  entryPoints: ["src/server/main.ts"],
  bundle: true,
  outdir: "output/server/",
  minify: false,
  sourcemap: true,
  platform: "node",
  target: "esnext",
  tsconfig: "server.tsconfig.json",
});
