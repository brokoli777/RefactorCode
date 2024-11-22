import { showBanner } from "../src/banner";
import { stdout } from "process";
import { jest } from "@jest/globals";

const writeSpy = jest.spyOn(stdout, "write").mockImplementation(() => {});

test("should write ASCII art to stdout", () => {
  showBanner();
  expect(writeSpy).toHaveBeenCalled();
  expect(writeSpy).toHaveBeenCalledTimes(1);
});

afterAll(() => {
  writeSpy.mockRestore();
});
