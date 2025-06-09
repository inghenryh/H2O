module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@Routes": "./routes",
            "@Components": "./components",
            "@Views": "./views",
            "@Ctx": "./Context",
            "@Assets": "./assets",
            "@Hooks": "./hooks",
            "@Utils": "./utils",
            "@Services": "./api",
          },
        },
      ],
    ],
  };
};
