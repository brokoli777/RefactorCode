import { setupServer } from "msw/node";
import { handlers } from "../mocks/handler.js";
import { geminiRefactor } from "../src/ai-providers/gemini.js";

export const server = setupServer(...handlers);

server.listen();

describe("geminiRefactor with mocked LLM API", () => {
  it("should refactor code and write to an output file successfully", async () => {
    const text = "const a = 1;";
    const modelType = "gemini-1.5-flash";
    const inputFile = "input.js";
    const API_KEY = 'dummy-api-key';

    const result = await geminiRefactor(
      text,
      modelType,
      inputFile,
      null,
      API_KEY,
    );

    const output = result.response.text();

    expect(result).toBeDefined();
    expect(output).toBeDefined();
    //output should contain explanation and refactored code
    expect(output).toContain("refactoredCode");
    expect(output).toContain("explanation");
    
  });
});
