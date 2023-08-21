module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  globals: {
    chrome: "readonly",
  },
  extends: ["plugin:vue/essential"],
  plugins: ["vue"],
};
