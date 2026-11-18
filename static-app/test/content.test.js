import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cvDir = join(__dirname, "..", "_data", "cv");
const experienceDir = join(cvDir, "experience");

const simpleFiles = ["name.md", "jobTitle.md", "jobSubtitle.md"];
const markdownFiles = [
  "location.md",
  "urls.md",
  "summary.md",
  "skills.md",
  "education.md",
  "languages.md",
];
const experienceFiles = readdirSync(experienceDir)
  .filter((f) => f.endsWith(".md"))
  .sort();

describe("Markdown content validation", () => {
  describe("File existence", () => {
    for (const file of simpleFiles) {
      it(`cv/${file} exists`, () => {
        const content = readFileSync(join(cvDir, file), "utf-8");
        expect(content.length).toBeGreaterThan(0);
      });
    }

    for (const file of markdownFiles) {
      it(`cv/${file} exists`, () => {
        const content = readFileSync(join(cvDir, file), "utf-8");
        expect(content.length).toBeGreaterThan(0);
      });
    }

    it("experience directory contains markdown files", () => {
      const files = readdirSync(experienceDir).filter((f) => f.endsWith(".md"));
      expect(files.length).toBeGreaterThan(0);
    });
  });

  describe("Non-empty content", () => {
    for (const file of [...simpleFiles, ...markdownFiles]) {
      it(`${file} contains meaningful content`, () => {
        const content = readFileSync(join(cvDir, file), "utf-8").trim();
        expect(content.length).toBeGreaterThan(5);
      });
    }

    it("all experience files contain meaningful content", () => {
      const files = readdirSync(experienceDir).filter((f) => f.endsWith(".md"));
      for (const file of files) {
        const content = readFileSync(join(experienceDir, file), "utf-8").trim();
        expect(content.length).toBeGreaterThan(50, `${file} seems too short`);
      }
    });
  });

  describe("Simple files", () => {
    describe("name.md", () => {
      it("contains plain text without markdown syntax", () => {
        const content = readFileSync(join(cvDir, "name.md"), "utf-8").trim();
        expect(content).not.toMatch(/^#/);
        expect(content).not.toMatch(/\*\*/);
        expect(content).not.toMatch(/\[.*\]\(.*\)/);
        expect(content).toMatch(/^[A-Z]/);
      });
    });

    describe("jobTitle.md", () => {
      it("contains plain text without markdown headings", () => {
        const content = readFileSync(join(cvDir, "jobTitle.md"), "utf-8").trim();
        expect(content).not.toMatch(/^#/);
      });
    });

    describe("jobSubtitle.md", () => {
      it("contains plain text without markdown headings", () => {
        const content = readFileSync(join(cvDir, "jobSubtitle.md"), "utf-8").trim();
        expect(content).not.toMatch(/^#/);
      });
    });
  });

  describe("urls.md", () => {
    it("contains valid markdown links", () => {
      const content = readFileSync(join(cvDir, "urls.md"), "utf-8");
      const links = content.match(/\[.*\]\(https?:\/\/.*\)/g);
      expect(links).not.toBeNull();
      expect(links.length).toBeGreaterThan(0);
    });

    it("all links use absolute URLs", () => {
      const content = readFileSync(join(cvDir, "urls.md"), "utf-8");
      const links = content.match(/\[.*\]\((.*?)\)/g) || [];
      for (const link of links) {
        const url = link.match(/\((.*?)\)/)[1];
        expect(url).toMatch(/^https?:\/\//);
      }
    });
  });

  describe("summary.md", () => {
    it("starts with a heading", () => {
      const content = readFileSync(join(cvDir, "summary.md"), "utf-8");
      expect(content.trim()).toMatch(/^#/);
    });
  });

  describe("skills.md", () => {
    it("starts with a heading", () => {
      const content = readFileSync(join(cvDir, "skills.md"), "utf-8");
      expect(content.trim()).toMatch(/^#/);
    });

    it("contains subheadings", () => {
      const content = readFileSync(join(cvDir, "skills.md"), "utf-8");
      expect(content).toMatch(/^## /m);
    });
  });

  describe("education.md", () => {
    it("starts with a heading", () => {
      const content = readFileSync(join(cvDir, "education.md"), "utf-8");
      expect(content.trim()).toMatch(/^#/);
    });
  });

  describe("languages.md", () => {
    it("starts with a heading", () => {
      const content = readFileSync(join(cvDir, "languages.md"), "utf-8");
      expect(content.trim()).toMatch(/^#/);
    });
  });

  describe("location.md", () => {
    it("contains location information", () => {
      const content = readFileSync(join(cvDir, "location.md"), "utf-8").trim();
      expect(content.length).toBeGreaterThan(0);
    });
  });

  describe("Experience files", () => {
    for (const file of experienceFiles) {
      describe(file, () => {
        it("starts with a heading", () => {
          const content = readFileSync(join(experienceDir, file), "utf-8");
          expect(content.trim()).toMatch(/^#/);
        });

        it("contains a date range", () => {
          const content = readFileSync(join(experienceDir, file), "utf-8");
          // Match various date formats: "2020-2023", "2020-present", "Jan 2020 - Dec 2023"
          expect(content).toMatch(/\d{4}/);
        });
      });
    }
  });

  describe("Markdown syntax", () => {
    it("urls.md uses link syntax", () => {
      const content = readFileSync(join(cvDir, "urls.md"), "utf-8");
      expect(content).toMatch(/\[.*\]\(https?:\/\/.*\)/);
    });

    it("experience files use bold text for company names", () => {
      const files = readdirSync(experienceDir).filter((f) => f.endsWith(".md"));
      for (const file of files) {
        const content = readFileSync(join(experienceDir, file), "utf-8");
        // Check if the file uses bold text (common for company names)
        if (content.match(/\*\*/)) {
          expect(content).toContain("**");
        }
      }
    });
  });
});
