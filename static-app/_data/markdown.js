const markdownIt = require("markdown-it");

// html: true is intentional — all content in cv/ is authored and committed to the repository.
// If untrusted content (e.g., user submissions) is ever introduced, this should be revisited.
module.exports = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});
