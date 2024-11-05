import { readFile, checkIfDirectory } from "../src/fileUtils";

describe("File Utility", () => {

    test("Read File", () => {

      readFile("./examples/test.txt").then((data) => {
        expect(data).toBe("Hello World");
      });
   
    });

    test('should return true if the path is a directory', async () => {
      const result = await checkIfDirectory('./examples');
      expect(result).toBe(true);
    });

});
