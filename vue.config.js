let globby = require("globby");

// 工厂函数 - 配置pages实现多页面获取某文件夹下的html与js
function handleEntry() {
  try {
    const entries = {};
    const allEntry = globby.sync("src/pages/**/main.js");
    allEntry.forEach((entry) => {
      const res = entry.match(/src\/pages\/(\w+)\/main\.js/);

      if (res.length) {
        // entries[res[1]] = `./${entry}`;
        entries[res[1]] = {
          entry: `./${entry}`,
          template: "public/index.html",
          filename: `${res[1]}/index.html`,
          chunks: ["chunk-vendors", "chunk-common", res[1]],
        };
      }
    });
    return entries;
  } catch (error) {
    console.error("File structure is incorrect for MPA");
  }
}

let pages = handleEntry();
console.log(pages);

// 以下开始配置
module.exports = {
  lintOnSave: false, // 关掉eslint
  /**
   * baseUrl 从 3.3起废用，使用pubilcPath代替
   * 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
   * 这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径，也可以用在类似 Cordova hybrid 应用的文件系统中。
   */
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  productionSourceMap: false,
  // 入口设置
  pages,
  devServer: {
    index: "/", // 运行时，默认打开application1页面
    // 告诉dev-server在服务器启动后打开浏览器，将其设置true为打开默认浏览器
    open: true,
    host: "localhost",
    port: 8080,
    https: false,
    hotOnly: false,
    // 配置首页 入口链接
    before: (app) => {
      app.get("/", (req, res, next) => {
        for (let i in pages) {
          res.write(`<a target="_self" href="/${i}">/${i}</a></br>`);
        }
        res.end();
      });
    },
  },
};
