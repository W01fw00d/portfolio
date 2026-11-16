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
    "assets/styles.css": "assets/styles.css",
    "assets/script.js": "assets/script.js",
    "assets/favicon.svg": "assets/favicon.svg",
  });

  // Disable DOM diffing and force full page reloads during development.
  // DOM diffing can miss changes in <head> (e.g., title, meta tags) when the layout changes.
  eleventyConfig.setServerOptions({
    domDiff: false,
  });

  return {
    // Only process njk and html as templates, not md files
    templateFormats: ["njk", "html", "11ty.js"],
  };
};
