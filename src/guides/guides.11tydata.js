/* Directory data for /guides/. The index page opts out of the guide chrome
   by not declaring a `slug`. */
module.exports = {
  layout: "layout.njk",
  /* Static, not computed: Eleventy builds collections before eleventyComputed
     runs, so a computed `tags` never lands. The index opts out with
     eleventyExcludeFromCollections in its own front matter instead. */
  tags: "guides",
  eleventyComputed: {
    pageType: (data) => (data.slug ? "guide" : undefined),
    permalink: (data) =>
      data.slug ? `/guides/${data.slug}.html` : "/guides/index.html",
    crumbs: (data) =>
      data.slug
        ? [
            { label: "Home", url: "/index.html" },
            { label: "Guides", url: "/guides/" },
            { label: data.shortTitle }
          ]
        : [
            { label: "Home", url: "/index.html" },
            { label: "Guides" }
          ]
  }
};
