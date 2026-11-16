import { copyFileSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Project root is two levels up: static-app/build-scripts/ → project root
const rootDir = join(__dirname, '..', '..');

// Configure marked to use basic sanitization
marked.setOptions({
  gfm: true,
  breaks: false,
});

function readMarkdownFile(filePath) {
  return readFileSync(filePath, 'utf-8');
}

function markdownToHtml(markdown) {
  return marked.parse(markdown);
}

function getAllMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.md')) {
      const relativePath = join(dirname(fullPath).replace(baseDir, ''), entry.name);
      files.push({ path: fullPath, relativePath });
    }
  }

  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

function fillTemplate(template, replacements) {
  let html = template;
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = `<!-- ${key} -->`;
    html = html.replace(placeholder, value);
  }
  return html;
}

function main() {
  const cvDir = join(rootDir, 'cv');
  const staticAppDir = join(rootDir, 'static-app');
  const distDir = join(rootDir, 'dist');

  // Create dist directory
  mkdirSync(distDir, { recursive: true });

  // Read and convert personal.md
  const personalMd = readMarkdownFile(join(cvDir, 'personal.md'));
  const personalHtml = markdownToHtml(personalMd);

  // Read and convert summary.md
  const summaryMd = readMarkdownFile(join(cvDir, 'summary.md'));
  const summaryHtml = markdownToHtml(summaryMd);

  // Read and convert experience files
  const experienceDir = join(cvDir, 'experience');
  const experienceFiles = getAllMarkdownFiles(experienceDir);
  const experienceHtml = experienceFiles
    .map(file => {
      const md = readMarkdownFile(file.path);
      return `<article>${markdownToHtml(md)}</article>`;
    })
    .join('\n');

  // Read and convert skills.md
  const skillsMd = readMarkdownFile(join(cvDir, 'skills.md'));
  const skillsHtml = markdownToHtml(skillsMd);

  // Read and convert education.md
  const educationMd = readMarkdownFile(join(cvDir, 'education.md'));
  const educationHtml = markdownToHtml(educationMd);

  // Read and convert languages.md
  const languagesMd = readMarkdownFile(join(cvDir, 'languages.md'));
  const languagesHtml = markdownToHtml(languagesMd);

  // Read the HTML template from static-app/index.html
  const template = readFileSync(join(staticAppDir, 'index.html'), 'utf-8');

  // Fill in the template with CV content
  const html = fillTemplate(template, {
    PERSONAL: personalHtml,
    SUMMARY: summaryHtml,
    EXPERIENCE: experienceHtml,
    SKILLS: skillsHtml,
    EDUCATION: educationHtml,
    LANGUAGES: languagesHtml,
    YEAR: new Date().getFullYear().toString(),
  });
  writeFileSync(join(distDir, 'index.html'), html, 'utf-8');

  // Copy static assets from static-app to dist
  copyFileSync(join(staticAppDir, 'favicon.svg'), join(distDir, 'favicon.svg'));
  copyFileSync(join(staticAppDir, 'styles.css'), join(distDir, 'styles.css'));
  copyFileSync(join(staticAppDir, 'script.js'), join(distDir, 'script.js'));

  // Write date.json
  const dateJson = JSON.stringify({ built: new Date().toISOString() }, null, 2);
  writeFileSync(join(distDir, 'date.json'), dateJson, 'utf-8');

  console.log('Build complete: dist/index.html generated successfully.');
}

main();
