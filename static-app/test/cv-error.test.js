import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("cv.js error handling", () => {
  let errorSpy;

  beforeEach(() => {
    vi.resetModules();
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("throws and logs when a simple file is missing (e.g., name)", async () => {
    vi.doMock("fs", () => ({
      readFileSync: () => {
        const err = new Error("ENOENT: no such file or directory");
        err.code = "ENOENT";
        throw err;
      },
      readdirSync: () => [],
    }));

    const cvModule = await import("../_data/cv.js");
    const cv = cvModule.default;

    expect(() => cv.name).toThrow();
    expect(errorSpy).toHaveBeenCalled();
  });

  it("throws and logs when a markdown file is missing (e.g., location)", async () => {
    vi.doMock("fs", () => ({
      readFileSync: () => {
        const err = new Error("ENOENT: no such file or directory");
        err.code = "ENOENT";
        throw err;
      },
      readdirSync: () => [],
    }));

    const cvModule = await import("../_data/cv.js");
    const cv = cvModule.default;

    expect(() => cv.location).toThrow();
    expect(errorSpy).toHaveBeenCalled();
  });

  it("throws and logs when an experience file is missing", async () => {
    vi.doMock("fs", () => ({
      readFileSync: () => {
        const err = new Error("ENOENT: no such file or directory");
        err.code = "ENOENT";
        throw err;
      },
      readdirSync: () => [{ name: "01-stuart.md", isDirectory: () => false }],
    }));

    const cvModule = await import("../_data/cv.js");
    const cv = cvModule.default;

    expect(() => cv.experience).toThrow();
    expect(errorSpy).toHaveBeenCalled();
  });
});
