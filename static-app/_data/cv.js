const { readFileSync, readdirSync } = require("fs");
const { join, dirname } = require("path");
const markdownIt = require("markdown-it");

const md = markdownIt({
  // html: true is intentional — all content in cv/ is authored and committed to the repository.
  // If untrusted content (e.g., user submissions) is ever introduced, this should be revisited.
  html: true,
  linkify: true,
  typographer: true,
});

// CV directory is inside _data/, so Eleventy watches it automatically.
// __dirname is static-app/_data/, so cv/ is a sibling directory.
const cvDir = join(__dirname, "cv");

function readMarkdownFile(filePath) {
  return readFileSync(filePath, "utf-8");
}

function markdownToHtml(text) {
  // Pre-process: convert www. URLs to http://www. so linkify picks them up
  text = text.replace(/\bwww\./g, "http://www.");
  return md.render(text);
}

function getMarkdownFiles(dir, baseDir) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath, baseDir));
    } else if (entry.name.endsWith(".md")) {
      const relativePath = join(dirname(fullPath).replace(baseDir, ""), entry.name);
      files.push({ path: fullPath, relativePath });
    }
  }

  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

function readSimpleFile(fileName) {
  const filePath = join(cvDir, fileName);
  try {
    const text = readFileSync(filePath, "utf-8");
    return text.trim();
  } catch (err) {
    console.error(`[cv.js] Missing required file: ${filePath}`);
    throw err;
  }
}

function readMarkdownAsHtml(fileName) {
  const filePath = join(cvDir, fileName);
  try {
    const text = readMarkdownFile(filePath);
    return markdownToHtml(text);
  } catch (err) {
    console.error(`[cv.js] Missing required file: ${filePath}`);
    throw err;
  }
}

module.exports = {
  get lastUpdated() {
    const now = new Date();
    return now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  },

  get name() {
    return readSimpleFile("name.md");
  },

  get jobTitle() {
    return readSimpleFile("jobTitle.md");
  },

  get jobSubtitle() {
    return readSimpleFile("jobSubtitle.md");
  },

  get location() {
    return readMarkdownAsHtml("location.md");
  },

  get urls() {
    return readMarkdownAsHtml("urls.md");
  },

  get summary() {
    return readMarkdownAsHtml("summary.md");
  },

  get experience() {
    const experienceDir = join(cvDir, "experience");
    const files = getMarkdownFiles(experienceDir);
    return files.map((file) => {
      try {
        const text = readMarkdownFile(file.path);
        return markdownToHtml(text);
      } catch (err) {
        console.error(`[cv.js] Missing required file: ${file.path}`);
        throw err;
      }
    });
  },

  get skills() {
    return readMarkdownAsHtml("skills.md");
  },

  get education() {
    return readMarkdownAsHtml("education.md");
  },

  get languages() {
    return readMarkdownAsHtml("languages.md");
  },
};
