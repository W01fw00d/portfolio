import md from "./_data/markdown.js";

export default function (eleventyConfig) {
  // Set up Markdown library
  eleventyConfig.setLibrary("md", md);

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
}
