import * as sass from "sass";

const result = sass.compile("src/styles/style.scss");
await Bun.write("src/public/style.css", result.css);
console.log("SCSS compiled successfully.");
