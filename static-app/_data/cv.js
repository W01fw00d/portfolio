const { readFileSync, readdirSync } = require("fs");
const { join, dirname } = require("path");
const markdownIt = require("markdown-it");

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// CV directory is at the project root, independent of static-app/
const cvDir = join(__dirname, "..", "..", "cv");

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

module.exports = {
  get year() {
    return new Date().getFullYear().toString();
  },

  get personal() {
    const text = readMarkdownFile(join(cvDir, "personal.md"));
    return markdownToHtml(text);
  },

  get summary() {
    const text = readMarkdownFile(join(cvDir, "summary.md"));
    return markdownToHtml(text);
  },

  get experience() {
    const experienceDir = join(cvDir, "experience");
    const files = getMarkdownFiles(experienceDir);
    return files.map((file) => {
      const text = readMarkdownFile(file.path);
      return markdownToHtml(text);
    });
  },

  get skills() {
    const text = readMarkdownFile(join(cvDir, "skills.md"));
    return markdownToHtml(text);
  },

  get education() {
    const text = readMarkdownFile(join(cvDir, "education.md"));
    return markdownToHtml(text);
  },

  get languages() {
    const text = readMarkdownFile(join(cvDir, "languages.md"));
    return markdownToHtml(text);
  },
};
