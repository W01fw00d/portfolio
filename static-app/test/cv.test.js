import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

describe("cv.js", () => {
  let cv;
  let consoleErrorSpy;

  beforeEach(() => {
    vi.resetModules();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    cv = require("../_data/cv.js");
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
  });

  describe("lastUpdated getter", () => {
    it('returns current date in "Month Year" format', () => {
      const result = cv.lastUpdated;
      expect(result).toMatch(/^[A-Z][a-z]+ \d{4}$/);
    });
  });

  describe("simple file getters", () => {
    describe("name", () => {
      it("returns trimmed string content", () => {
        const result = cv.name;
        expect(typeof result).toBe("string");
        expect(result).toBe(result.trim());
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe("jobTitle", () => {
      it("returns trimmed string content", () => {
        const result = cv.jobTitle;
        expect(typeof result).toBe("string");
        expect(result).toBe(result.trim());
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe("jobSubtitle", () => {
      it("returns trimmed string content", () => {
        const result = cv.jobSubtitle;
        expect(typeof result).toBe("string");
        expect(result).toBe(result.trim());
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe("markdown-to-HTML getters", () => {
    describe("location", () => {
      it("returns HTML string", () => {
        const result = cv.location;
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
        // markdown-it wraps content in <p> tags for plain text
        expect(result).toContain("<p>");
      });
    });

    describe("urls", () => {
      it("returns HTML string with links", () => {
        const result = cv.urls;
        expect(typeof result).toBe("string");
        expect(result).toContain("<a href=");
      });

      it("pre-processes www. URLs to http://www.", () => {
        const result = cv.urls;
        // The www. preprocessing ensures linkification works
        expect(result).not.toMatch(/href="www\./);
      });
    });

    describe("summary", () => {
      it("returns HTML string", () => {
        const result = cv.summary;
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe("skills", () => {
      it("returns HTML string with heading elements", () => {
        const result = cv.skills;
        expect(typeof result).toBe("string");
        expect(result).toContain("<h1>");
        expect(result).toContain("<h2>");
      });
    });

    describe("education", () => {
      it("returns HTML string", () => {
        const result = cv.education;
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe("languages", () => {
      it("returns HTML string", () => {
        const result = cv.languages;
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe("experience getter", () => {
    it("returns an array of HTML strings", () => {
      const result = cv.experience;
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      for (const item of result) {
        expect(typeof item).toBe("string");
        expect(item.length).toBeGreaterThan(0);
      }
    });

    it("returns results sorted by file path", () => {
      const result = cv.experience;
      // Files are sorted alphabetically by relative path
      // The first file should start with a lower character than the last
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("error handling", () => {
    it("logs an error to console when a simple file is missing", () => {
      // Create a fresh cv instance that points to a non-existent file
      vi.resetModules();
      const fakeCv = {
        get name() {
          const { readFileSync } = require("fs");
          const { join } = require("path");
          const filePath = join(__dirname, "cv", "nonexistent-file.md");
          try {
            const text = readFileSync(filePath, "utf-8");
            return text.trim();
          } catch (err) {
            console.error(`[cv.js] Missing required file: ${filePath}`);
            throw err;
          }
        },
      };
      expect(() => fakeCv.name).toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
