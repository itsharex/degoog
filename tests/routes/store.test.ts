import { describe, test, expect, beforeAll } from "bun:test";

let storeRouter: {
  request: (req: Request | string) => Response | Promise<Response>;
};

beforeAll(async () => {
  const mod = await import("../../src/server/routes/store");
  storeRouter = mod.default;
});

describe("routes/store", () => {
  test("GET /api/store/items without auth returns 401 or 200", async () => {
    const res = await storeRouter.request("http://localhost/api/store/items");
    expect([200, 401]).toContain(res.status);
    if (res.status === 200) {
      const body = (await res.json()) as { items: unknown };
      expect(Array.isArray(body.items)).toBe(true);
    }
  });
});
