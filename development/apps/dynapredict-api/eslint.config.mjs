import baseConfig from '../../eslint.config.mjs';
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [...baseConfig, eslintConfigPrettier];
