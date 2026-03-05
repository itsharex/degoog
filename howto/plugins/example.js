export default {
  name: "Example",
  async executeSearch(query, page = 1, timeFilter) {
    return [
      {
        title: "Example result for: " + query,
        url: "https://example.com",
        snippet: "Plugin engine example. Replace this file with your own.",
        source: "Example",
      },
    ];
  },
};
