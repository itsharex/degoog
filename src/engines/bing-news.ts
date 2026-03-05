import * as cheerio from "cheerio";
import type { SearchEngine, SearchResult, TimeFilter } from "../types";
import { getRandomUserAgent } from "../user-agents";

export class BingNewsEngine implements SearchEngine {
  name = "Bing News";

  async executeSearch(query: string, page: number = 1, timeFilter?: TimeFilter): Promise<SearchResult[]> {
    const first = (page - 1) * 40;
    let url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&count=40&first=${first}`;
    if (timeFilter && timeFilter !== "any") {
      const freshMap: Record<string, string> = { hour: "Hour", day: "Day", week: "Week", month: "Month" };
      if (freshMap[timeFilter]) url += `&qft=sortbydate%3d"1"`;
    }
    const response = await fetch(url, {
      headers: { "User-Agent": getRandomUserAgent() },
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    $(".news-card, .newsitem").each((_, el) => {
      const titleEl = $(el).find("a.title");
      const title = titleEl.text().trim();
      const href = titleEl.attr("href") || "";
      const snippet = $(el).find(".snippet").text().trim();
      const thumbnail = $(el).find("img").attr("src") || $(el).find("img").attr("data-src") || "";
      const source = $(el).find(".source").text().trim();

      if (title && href && href.startsWith("http")) {
        results.push({
          title,
          url: href,
          snippet: source ? `${source} — ${snippet}` : snippet,
          source: this.name,
          thumbnail,
        });
      }
    });

    return results;
  }
}
