module.exports = function (eleventyConfig) {
  // Static assets copied through untouched.
  // Ship only what pages reference. The 21 AI-placeholder PNGs left in
  // images/ (category-*, department-*, heroindex*, services-hero) are
  // superseded by the real photography in IMAGE-MANIFEST.md and are
  // deliberately not deployed; they stay in the repo/history only.
  /* Look one record out of a data array by key. Used for internal linking
     between departments and services. */
  eleventyConfig.addFilter("findBy", (list, key, value) =>
    (list || []).find((item) =>
      key.split(".").reduce((o, k) => (o == null ? o : o[k]), item) === value));

  /* llms.txt is plain text, but the copy in _data stores HTML entities
     because it is authored for HTML. Decode them for text output. */
  eleventyConfig.addFilter("plain", (value) => {
    if (value === undefined || value === null) return "";
    const named = {
      amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
      ndash: "\u2013", mdash: "\u2014", rsquo: "\u2019", lsquo: "\u2018",
      ldquo: "\u201C", rdquo: "\u201D", hellip: "\u2026", reg: "\u00AE",
      trade: "\u2122", copy: "\u00A9", deg: "\u00B0", ge: "\u2265",
      le: "\u2264", times: "\u00D7", bull: "\u2022", sup2: "\u00B2",
      iexcl: "\u00A1", ntilde: "\u00F1", eacute: "\u00E9", raquo: "\u00BB"
    };
    return String(value)
      .replace(/<[^>]+>/g, "")
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&([a-z][a-z0-9]*);/gi, (m, n) => (n in named ? named[n] : m))
      .replace(/\s+/g, " ")
      .trim();
  });

  // Build timestamp, used by llms.txt so consumers can tell how fresh it is.
  eleventyConfig.addGlobalData("buildTime", () => new Date().toISOString().slice(0, 10));

  eleventyConfig.addPassthroughCopy("images/*.webp");
  eleventyConfig.addPassthroughCopy("images/card/*.webp");
  eleventyConfig.addPassthroughCopy("images/wide/*.webp");
  eleventyConfig.addPassthroughCopy("images/og-default.jpg");
  eleventyConfig.addPassthroughCopy("images/yonkerslogo.png");   // header logo
  eleventyConfig.addPassthroughCopy("images/logo3.png");         // hero logo
  eleventyConfig.addPassthroughCopy("images/benjamin-moore.png");// partner mark
  eleventyConfig.addPassthroughCopy({ "src/static": "." }); // favicons, robots.txt, .htaccess
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("fonts");


  /* Lean output: images/ and fonts/ hold the whole library, but the build
     ships only what a page or the stylesheet actually points at. Unreferenced
     files stay in the repo and reappear in _site/ the moment a template uses
     one. The referenced set comes from tools/refs.js, the same module the
     crawl uses, so the two cannot drift.

     Only runs on a full build. Under --serve, incremental rebuilds do not
     always re-copy passthrough files, so pruning there could leave a gap. */
  eleventyConfig.on("eleventy.after", ({ dir, runMode }) => {
    if (runMode !== "build") return;
    const fs = require("fs");
    const path = require("path");
    const { referencedFiles } = require("./tools/refs.js");

    const SITE = dir.output;
    if (!fs.existsSync(SITE)) return;

    const { files, referenced } = referencedFiles(SITE);
    const PRUNABLE = /^\/(images|fonts)\//;

    let removed = 0, bytes = 0;
    for (const f of files) {
      if (!PRUNABLE.test(f) || referenced.has(f)) continue;
      const abs = path.join(SITE, f);
      bytes += fs.statSync(abs).size;
      fs.rmSync(abs);
      removed++;
    }

    // drop directories the prune emptied
    const sweep = d => {
      for (const e of fs.readdirSync(d, { withFileTypes: true }))
        if (e.isDirectory()) sweep(path.join(d, e.name));
      if (fs.readdirSync(d).length === 0) fs.rmdirSync(d);
    };
    for (const d of ["images", "fonts"]) {
      const abs = path.join(SITE, d);
      if (fs.existsSync(abs)) sweep(abs);
    }

    if (removed) {
      console.log(`[11ty] Pruned ${removed} unreferenced asset(s), ${(bytes / 1048576).toFixed(1)} MB`);
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    // Flat .html output so every current URL survives unchanged.
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
