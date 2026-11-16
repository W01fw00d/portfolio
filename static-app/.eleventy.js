const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  // Set up Markdown library
  // html: true is intentional — all content in cv/ is authored and committed to the repository.
  // If untrusted content (e.g., user submissions) is ever introduced, this should be revisited.
  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })
  );

  // Pass through static assets (CSS, JS, favicon) to the output directory
  // Using explicit object mapping for clear source-to-destination audit trail
  eleventyConfig.addPassthroughCopy({
    "src/styles.css": "styles.css",
    "src/script.js": "script.js",
    "src/favicon.svg": "favicon.svg",
  });

  // Watch cv/ directory at the monorepo root for changes (md files are not templates, but we want rebuilds)
  eleventyConfig.addWatchTarget("../cv");

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    // Only process njk and html as templates, not md files
    templateFormats: ["njk", "html", "11ty.js"],
  };
};
