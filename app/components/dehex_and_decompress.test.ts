import { dehex_and_decompress } from "./dehex_and_decompress";

test("dehexes and decompresses a string that is hexed and compressed", () => {
  const expected = "test123";
  const raw = "789c2b492d2e31343206000aca0257";
  const result = dehex_and_decompress(raw);
  expect(result).toBe(expected);
});
