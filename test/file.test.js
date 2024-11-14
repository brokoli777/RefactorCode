import { checkIfDirectory, readFile } from "../src/fileUtils";

describe("File Utility", () => {
  test("Read File", () => {
    readFile("./examples/test.txt").then((data) => {
      expect(data).toBe("Hello World");
    });
  });

  test("Read File Error, return null", () => {
    readFile("./examples/does-not-exist.txt").then((data) => {
      expect(data).toBe(null);
    });
  });

  test("should return true if the path is a directory", async () => {
    const result = await checkIfDirectory("./examples");
    expect(result).toBe(true);
  });

  test("should return false if the path is not a directory", async () => {
    const result = await checkIfDirectory("./examples/dummy-file.txt");
    expect(result).toBe(false);
  });
});
