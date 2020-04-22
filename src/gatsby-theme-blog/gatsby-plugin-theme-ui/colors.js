import merge from "deepmerge"
import defaultThemeColors from "gatsby-theme-blog/src/gatsby-plugin-theme-ui/colors"

/*
 * Want to change your theme colors?
 * Try uncommenting the color overrides below
 * to go from default purple to a blue theme
 */

const darkGreen = `#108043`
const lightGreen = `#BBE5B3`
const inkGray = `#212B36`

export default merge(defaultThemeColors, {
  text: inkGray,
  primary: darkGreen,
  modes: {
    dark: {
      primary: lightGreen,
      highlight: darkGreen,
    },
  },
})
