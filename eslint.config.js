import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  { ignores: ["examples/", "node_modules/", "coverage/", "test/"] },
];
