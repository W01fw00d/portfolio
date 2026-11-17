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
    it("has a title tag", () => {
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      expect(titleMatch).not.toBeNull();
      expect(titleMatch[1].trim().length).toBeGreaterThan(0);
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
    it("displays a name in an h1", () => {
      const h1Match = html.match(/<h1>(.*?)<\/h1>/);
      expect(h1Match).not.toBeNull();
      expect(h1Match[1].trim().length).toBeGreaterThan(0);
    });

    it("displays a job subtitle", () => {
      const headerMatch = html.match(/<header>(.*?)<\/header>/s);
      expect(headerMatch).not.toBeNull();
      const headerContent = headerMatch[1];
      const textContent = headerContent.replace(/<[^>]+>/g, "").trim();
      expect(textContent.length).toBeGreaterThan(0);
    });

    it("displays location information", () => {
      const headerMatch = html.match(/<header>(.*?)<\/header>/s);
      expect(headerMatch).not.toBeNull();
      const headerContent = headerMatch[1];
      const pTags = headerContent.match(/<p>(.*?)<\/p>/g) || [];
      expect(pTags.length).toBeGreaterThan(0);
    });

    it("displays social links", () => {
      const socialLinks = html.match(/href="https?:\/\//g) || [];
      expect(socialLinks.length).toBeGreaterThan(0);
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
    it("renders experience entries as articles", () => {
      const articleCount = (html.match(/<article>/g) || []).length;
      expect(articleCount).toBeGreaterThan(0);
    });
  });

  describe("Footer", () => {
    it("displays a copyright date in Month Year format", () => {
      expect(html).toMatch(/&copy; [A-Z][a-z]+ \d{4}/);
    });

    it("displays a name", () => {
      const footerMatch = html.match(/<footer>(.*?)<\/footer>/s);
      expect(footerMatch).not.toBeNull();
      const pMatch = footerMatch[1].match(/<p>(.*?)<\/p>/);
      expect(pMatch).not.toBeNull();
      expect(pMatch[1].trim().length).toBeGreaterThan(0);
    });
  });

  describe("Static assets", () => {
    it("references the JavaScript file", () => {
      expect(html).toContain('src="assets/script.js"');
    });
  });
});
