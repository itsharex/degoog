import * as cheerio from "cheerio";
import type { SearchEngine, SearchResult, TimeFilter } from "../types";

const GSA_USER_AGENTS = [
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/406.0.862495628 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_4_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/406.0.862495628 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/398.0.833143299 Mobile/15E148 Safari/604.1",
];

function randomArcId(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
  let id = "";
  for (let i = 0; i < 23; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export class GoogleVideosEngine implements SearchEngine {
  name = "Google Videos";

  async executeSearch(
    query: string,
    page: number = 1,
    timeFilter?: TimeFilter,
  ): Promise<SearchResult[]> {
    const start = (page - 1) * 20;
    const arcId = `srp_${randomArcId()}_1${String(start).padStart(2, "0")}`;
    const asyncParam = `arc_id:${arcId},use_ac:true,_fmt:prog`;

    const params = new URLSearchParams({
      q: query,
      tbm: "vid",
      hl: "en",
      ie: "utf8",
      oe: "utf8",
      start: String(start),
      asearch: "arc",
      async: asyncParam,
    });

    if (timeFilter && timeFilter !== "any") {
      const tbsMap: Record<string, string> = {
        hour: "qdr:h",
        day: "qdr:d",
        week: "qdr:w",
        month: "qdr:m",
        year: "qdr:y",
      };
      if (tbsMap[timeFilter]) params.set("tbs", tbsMap[timeFilter]);
    }

    const ua =
      GSA_USER_AGENTS[Math.floor(Math.random() * GSA_USER_AGENTS.length)];
    const response = await fetch(
      `https://www.google.com/search?${params.toString()}`,
      {
        headers: {
          "User-Agent": ua,
          Accept: "*/*",
          Cookie: "CONSENT=YES+",
        },
      },
    );

    const html = await response.text();
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    $(".MjjYud").each((_, el) => {
      const titleEl = $(el).find("h3").first();
      const linkEl = $(el).find("a[href]").first();
      const descEl = $(el).find(".ITZIwc, [data-sncf]").first();
      const thumbEl = $(el).find("img[src]").first();
      const durationEl = $(el).find(".k1U36b").first();
      const vidId = $(el).find("[data-vid]").attr("data-vid") || "";

      const title = titleEl.text().trim();
      let href = linkEl.attr("href") || "";

      if (href.startsWith("/url?")) {
        try {
          const parsed = new URL(href, "https://www.google.com");
          href =
            parsed.searchParams.get("q") ||
            parsed.searchParams.get("url") ||
            href;
        } catch {}
      }

      let thumbnail = thumbEl.attr("src") || "";
      if (vidId && !thumbnail) {
        thumbnail = `https://i.ytimg.com/vi/${vidId}/mqdefault.jpg`;
      }

      if (
        title &&
        href &&
        href.startsWith("http") &&
        !href.includes("google.com/search")
      ) {
        results.push({
          title,
          url: href,
          snippet: descEl.text().trim(),
          source: this.name,
          thumbnail,
          duration: durationEl.text().trim(),
        });
      }
    });

    return results;
  }
}
