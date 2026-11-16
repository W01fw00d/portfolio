const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  // Set up Markdown library
  eleventyConfig.setLibrary("md", markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  }));

  // Pass through static assets (CSS, JS, favicon) to the output directory
  // Paths are relative to the project root (where .eleventy.js lives)
  eleventyConfig.addPassthroughCopy("static-app/styles.css");
  eleventyConfig.addPassthroughCopy("static-app/script.js");
  eleventyConfig.addPassthroughCopy("static-app/favicon.svg");

  // Watch cv/ directory at project root for changes (md files are not templates, but we want rebuilds)
  eleventyConfig.addWatchTarget("./cv");

  return {
    dir: {
      input: "static-app",
      output: "dist",
    },
    // Only process njk and html as templates, not md files
    templateFormats: ["njk", "html", "11ty.js"],
  };
};
