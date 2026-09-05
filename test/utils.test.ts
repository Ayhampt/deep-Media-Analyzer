import { describe, it, expect } from "vitest";
import { formatBytes, generateHash, cn } from "../lib/utils";

describe("lib/utils", () => {
  it("formatBytes returns 0 Bytes for 0", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
  });

  it("formatBytes formats KB correctly", () => {
    expect(formatBytes(1024)).toBe("1 KB");
  });

  it("generateHash is deterministic and returns hex-like string", () => {
    const a = generateHash("hello");
    const b = generateHash("hello");
    expect(typeof a).toBe("string");
    expect(a).toBe(b);
    expect(a.startsWith("0x")).toBe(true);
  });

  it("cn merges class names", () => {
    const result = cn("btn", "btn-primary", { hidden: false });
    expect(result.includes("btn")).toBe(true);
    expect(result.includes("btn-primary")).toBe(true);
  });
});
