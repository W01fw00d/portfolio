import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function generateHtml(personalHtml, summaryHtml, experienceHtml, skillsHtml, educationHtml, languagesHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title> Gabriel Romay Machado - Senior Full-Stack Engineer</title>
  <meta name="description" content="Portfolio of Gabriel Romay Machado, Senior Full-Stack Engineer with 10+ years of experience.">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="container">
      ${personalHtml}
    </div>
  </header>

  <main>
    <section id="summary">
      <div class="container">
        ${summaryHtml}
      </div>
    </section>

    <section id="experience">
      <div class="container">
        <h2>Work Experience</h2>
        ${experienceHtml}
      </div>
    </section>

    <section id="skills">
      <div class="container">
        ${skillsHtml}
      </div>
    </section>

    <section id="education">
      <div class="container">
        ${educationHtml}
      </div>
    </section>

    <section id="languages">
      <div class="container">
        ${languagesHtml}
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} Gabriel Romay Machado</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;
}

function main() {
  const cvDir = join(__dirname, 'cv');
  const distDir = join(__dirname, 'dist');

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

  // Generate index.html
  const html = generateHtml(personalHtml, summaryHtml, experienceHtml, skillsHtml, educationHtml, languagesHtml);
  writeFileSync(join(distDir, 'index.html'), html, 'utf-8');

  // Write date.json
  const dateJson = JSON.stringify({ built: new Date().toISOString() }, null, 2);
  writeFileSync(join(distDir, 'date.json'), dateJson, 'utf-8');

  console.log('Build complete: dist/index.html generated successfully.');
}

main();
