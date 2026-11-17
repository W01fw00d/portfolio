import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const siteDir = join(__dirname, "..", "_site");

describe("Build output", () => {
  let html;

  beforeAll(() => {
    html = readFileSync(join(siteDir, "index.html"), "utf-8");
  });

  describe("HTML structure", () => {
    it("is a valid HTML5 document", () => {
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain('<html lang="en">');
    });

    it("has a head section with charset and viewport", () => {
      expect(html).toContain('<meta charset="UTF-8" />');
      expect(html).toContain('meta name="viewport"');
    });

    it("has a body with header, main, and footer", () => {
      expect(html).toContain("<header>");
      expect(html).toContain('<main id="main">');
      expect(html).toContain("<footer>");
    });

    it("has a skip-to-content link for accessibility", () => {
      expect(html).toContain('class="skip-to-content"');
      expect(html).toContain('href="#main"');
    });
  });

  describe("Head metadata", () => {
    it("has a title with name and job title", () => {
      expect(html).toContain("<title>Gabriel Romay Machado - Senior Full-Stack Engineer</title>");
    });

    it("has a meta description", () => {
      expect(html).toContain('<meta name="description" content="');
    });

    it("has Open Graph meta tags", () => {
      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:description"');
      expect(html).toContain('property="og:type"');
      expect(html).toContain('property="og:url"');
    });

    it("has a canonical link", () => {
      expect(html).toContain('<link rel="canonical" href="');
    });

    it("references the stylesheet", () => {
      expect(html).toContain('href="assets/styles.css"');
    });

    it("references the favicon", () => {
      expect(html).toContain('href="assets/favicon.svg"');
    });
  });

  describe("Header section", () => {
    it("displays the name in an h1", () => {
      expect(html).toContain("<h1>Gabriel Romay Machado</h1>");
    });

    it("displays the job subtitle", () => {
      expect(html).toContain("Frontend Oriented");
    });

    it("displays location information", () => {
      expect(html).toContain("Palma de Mallorca");
    });

    it("displays social links", () => {
      expect(html).toContain('href="https://github.com/W01fw00d"');
      expect(html).toContain('href="https://linkedin.com/in/gabriel-romay-machado-40050a114"');
    });
  });

  describe("Main content sections", () => {
    it("has a summary section", () => {
      expect(html).toContain('<section id="summary">');
    });

    it("has an experience section with articles", () => {
      expect(html).toContain('<section id="experience">');
      const articleCount = (html.match(/<article>/g) || []).length;
      expect(articleCount).toBeGreaterThan(0);
    });

    it("has a skills section", () => {
      expect(html).toContain('<section id="skills">');
    });

    it("has an education section", () => {
      expect(html).toContain('<section id="education">');
    });

    it("has a languages section", () => {
      expect(html).toContain('<section id="languages">');
    });
  });

  describe("Experience section", () => {
    it("renders all experience entries", () => {
      expect(html).toContain("Stuart Delivery");
      expect(html).toContain("Rakuten Japan");
      expect(html).toContain("Habitissimo");
      expect(html).toContain("eDreams Odigeo");
    });

    it("renders experience entries as articles", () => {
      const articleCount = (html.match(/<article>/g) || []).length;
      expect(articleCount).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Footer", () => {
    it("displays the last updated date in Month Year format", () => {
      expect(html).toMatch(/&copy; [A-Z][a-z]+ \d{4}/);
    });

    it("displays the name", () => {
      expect(html).toContain("Gabriel Romay Machado");
    });
  });

  describe("Static assets", () => {
    it("references the JavaScript file", () => {
      expect(html).toContain('src="assets/script.js"');
    });
  });
});
