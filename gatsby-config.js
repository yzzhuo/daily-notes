module.exports = {
  pathPrefix: "/daily-notes",
  plugins: [
    {
      resolve: `gatsby-theme-blog`,
      options: {},
    },
  ],
  // Customize your site metadata:
  siteMetadata: {
    title: `June's blog`,
    author: `June Zhuo`,
    description: `Make everything be fun`,
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/yzzhuo`,
      },
      {
        name: `github`,
        url: `https://github.com/yzzhuo`,
      },
    ],
  },
}
