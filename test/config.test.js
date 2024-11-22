import { jest } from "@jest/globals";
import path from "path";

await jest.unstable_mockModule("fs", () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

await jest.unstable_mockModule("os", () => ({
  homedir: jest.fn(() => "/mock/home"), // mock home directory path
}));

await jest.unstable_mockModule("toml", () => ({
  parse: jest.fn(),
}));

const { getConfig } = await import("../src/config");

describe("getConfig", () => {
  it("should return null if the TOML file does not exist", async () => {
    const fs = await import("fs");
    fs.existsSync.mockReturnValue(false);

    const result = getConfig();
    expect(result).toBeNull();
  });

  it("should return parsed config when the TOML file exists", async () => {
    const fs = await import("fs");
    const toml = await import("toml");

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('key = "value"');
    toml.parse.mockReturnValue({ key: "value" });

    const result = getConfig();
    expect(result).toEqual({ key: "value" });

    expect(fs.readFileSync).toHaveBeenCalledWith(
      expect.stringContaining(path.join("/mock/home", ".refactorcode.toml")),
      "utf-8",
    );
    expect(toml.parse).toHaveBeenCalledWith('key = "value"');
  });

  it("should handle errors when reading the TOML file", async () => {
    const fs = await import("fs");

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockImplementation(() => {
      throw new Error("File read error");
    });

    const originalExit = process.exit;
    const originalError = console.error;
    process.exit = jest.fn();
    console.error = jest.fn();

    getConfig();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("Error reading TOML file: File read error"),
    );
    expect(process.exit).toHaveBeenCalledWith(1);

    process.exit = originalExit;
    console.error = originalError;
  });
});
