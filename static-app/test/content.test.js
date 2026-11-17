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

    it("contains paragraph content", () => {
      const content = readFileSync(join(cvDir, "summary.md"), "utf-8");
      const lines = content
        .trim()
        .split("\n")
        .filter((l) => l.trim() && !l.trim().startsWith("#"));
      expect(lines.length).toBeGreaterThan(0);
    });

    it("contains bold text for emphasis", () => {
      const content = readFileSync(join(cvDir, "summary.md"), "utf-8");
      expect(content).toMatch(/\*\*.*\*\*/);
    });
  });

  describe("skills.md", () => {
    it("starts with a top-level heading", () => {
      const content = readFileSync(join(cvDir, "skills.md"), "utf-8");
      expect(content.trim()).toMatch(/^# /);
    });

    it("contains multiple section headings", () => {
      const content = readFileSync(join(cvDir, "skills.md"), "utf-8");
      const headings = content.match(/^## .+/gm);
      expect(headings).not.toBeNull();
      expect(headings.length).toBeGreaterThan(1);
    });

    it("has at least 5 skill categories", () => {
      const content = readFileSync(join(cvDir, "skills.md"), "utf-8");
      const headings = content.match(/^## .+/gm) || [];
      expect(headings.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("education.md", () => {
    it("starts with a heading", () => {
      const content = readFileSync(join(cvDir, "education.md"), "utf-8");
      expect(content.trim()).toMatch(/^# /);
    });

    it("contains bold text for degree name", () => {
      const content = readFileSync(join(cvDir, "education.md"), "utf-8");
      expect(content).toMatch(/\*\*.*\*\*/);
    });

    it("contains a year range", () => {
      const content = readFileSync(join(cvDir, "education.md"), "utf-8");
      expect(content).toMatch(/\d{4}\s*[–-]\s*\d{4}/);
    });
  });

  describe("languages.md", () => {
    it("starts with a heading", () => {
      const content = readFileSync(join(cvDir, "languages.md"), "utf-8");
      expect(content.trim()).toMatch(/^# /);
    });

    it("contains list items", () => {
      const content = readFileSync(join(cvDir, "languages.md"), "utf-8");
      const items = content.match(/^- .+/gm);
      expect(items).not.toBeNull();
      expect(items.length).toBeGreaterThan(0);
    });

    it("each list item has a bold language name", () => {
      const content = readFileSync(join(cvDir, "languages.md"), "utf-8");
      const items = content.match(/- \*\*.+:\*\* .+/g) || [];
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe("location.md", () => {
    it("contains non-empty location text", () => {
      const content = readFileSync(join(cvDir, "location.md"), "utf-8");
      expect(content.trim()).not.toBe("");
    });
  });

  describe("Experience files", () => {
    it("files follow naming convention (NN-name.md)", () => {
      for (const file of experienceFiles) {
        expect(file).toMatch(/^\d{2}-[\w-]+\.md$/);
      }
    });

    it("files are numbered sequentially", () => {
      const numbers = experienceFiles.map((f) => parseInt(f.match(/^(\d{2})/)[1], 10));
      for (let i = 1; i < numbers.length; i++) {
        expect(numbers[i]).toBe(numbers[i - 1] + 1);
      }
    });

    for (const file of experienceFiles) {
      describe(file, () => {
        const content = readFileSync(join(experienceDir, file), "utf-8");

        it("starts with a job title heading", () => {
          expect(content.trim()).toMatch(/^# \*\*.+\*\*/);
        });

        it("contains a company name in bold", () => {
          expect(content).toMatch(/^\*\*.+\*\*$/m);
        });

        it("contains a date and location line", () => {
          expect(content).toMatch(/\d{4}\s*[–-]\s*\w+ \d{4}\s*·\s*.+/);
        });

        it("contains a tech stack section", () => {
          expect(content).toMatch(/Tech Stack:/i);
        });

        it("contains key contributions section", () => {
          expect(content).toMatch(/Key contributions/i);
        });

        it("contains list items for achievements", () => {
          const items = content.match(/^- .+/gm);
          expect(items).not.toBeNull();
          expect(items.length).toBeGreaterThan(0);
        });
      });
    }
  });
});
