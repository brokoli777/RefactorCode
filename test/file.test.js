import { readFile } from "../src/fileUtils";


describe("File Utility", () => {

    test("Read File", () => {

      readFile("./examples/test.txt").then((data) => {
        expect(data).toBe("Hello World");
      });
   
    });

});
