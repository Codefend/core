import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    entries: ["src/index"],
    declaration: true,
    outDir: "build",
    clean: true,
    rollup: {
        emitCJS: true,
    },
});
