import { describe, it, expect, vi } from "vitest";

// Helper to mock fs module and reload cv.js with the mocked fs
// Returns the reloaded cv module for use in the test
function mockFsAndReloadCv(fsMock) {
  const Module = require("module");
  const originalRequire = Module.prototype.require;
  const realFs = require("fs");

  // Intercept require("fs") calls
  Module.prototype.require = function (id) {
    if (id === "fs") {
      return {
        ...realFs,
        ...fsMock,
      };
    }
    return originalRequire.apply(this, arguments);
  };

  // Clear module cache so cv.js reloads with mocked fs
  Object.keys(require.cache).forEach((key) => {
    delete require.cache[key];
  });

  // Return a cleanup function to restore original require
  return {
    cv: require("../_data/cv.js"),
    cleanup: () => {
      Module.prototype.require = originalRequire;
    },
  };
}

describe("cv.js error handling", () => {
  let errorSpy;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("throws and logs when a simple file is missing (e.g., name)", () => {
    const { cv, cleanup } = mockFsAndReloadCv({
      readFileSync: () => {
        const err = new Error("ENOENT: no such file or directory");
        err.code = "ENOENT";
        throw err;
      },
      readdirSync: () => [],
    });

    expect(() => cv.name).toThrow();
    expect(errorSpy).toHaveBeenCalled();
    cleanup();
  });

  it("throws and logs when a markdown file is missing (e.g., location)", () => {
    const { cv, cleanup } = mockFsAndReloadCv({
      readFileSync: () => {
        const err = new Error("ENOENT: no such file or directory");
        err.code = "ENOENT";
        throw err;
      },
      readdirSync: () => [],
    });

    expect(() => cv.location).toThrow();
    expect(errorSpy).toHaveBeenCalled();
    cleanup();
  });

  it("throws and logs when an experience file is missing", () => {
    const { cv, cleanup } = mockFsAndReloadCv({
      readFileSync: () => {
        const err = new Error("ENOENT: no such file or directory");
        err.code = "ENOENT";
        throw err;
      },
      readdirSync: (dir, options) => [
        { name: "01-stuart.md", isDirectory: () => false },
      ],
    });

    expect(() => cv.experience).toThrow();
    expect(errorSpy).toHaveBeenCalled();
    cleanup();
  });
});
