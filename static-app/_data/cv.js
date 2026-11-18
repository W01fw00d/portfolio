import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import md from "./markdown.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CV directory is inside _data/, so Eleventy watches it automatically.
// __dirname is static-app/_data/, so cv/ is a sibling directory.
const cvDir = join(__dirname, "cv");

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

function readAndTransform(filePath, transform) {
  try {
    const text = readFileSync(filePath, "utf-8");
    return transform(text);
  } catch (err) {
    console.error(`[cv.js] Missing required file: ${filePath}`);
    throw err;
  }
}

function readSimpleFile(fileName) {
  return readAndTransform(join(cvDir, fileName), (text) => text.trim());
}

function readMarkdownAsHtml(fileName) {
  return readAndTransform(join(cvDir, fileName), (text) => markdownToHtml(text));
}

export default {
  get lastUpdated() {
    const now = new Date();
    return now.toLocaleString("en-US", { month: "long", year: "numeric" });
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
    const files = getMarkdownFiles(experienceDir, experienceDir);
    return files.map((file) => readAndTransform(file.path, (text) => markdownToHtml(text)));
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
