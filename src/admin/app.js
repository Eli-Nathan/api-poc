import AuthLogo from "./extensions/logo.png";
import MenuLogo from "./extensions/logo.png";
import favicon from "./extensions/favicon.ico";

export default {
  config: {
    // Replace the Strapi logo in auth (login) views
    auth: {
      logo: AuthLogo,
    },
    // Replace the favicon
    head: {
      favicon: favicon,
    },
    // Replace the Strapi logo in the main navigation
    menu: {
      logo: MenuLogo,
    },
    // Override or extend the theme
    theme: {
      colors: {
        alternative100: "#fddee1",
        alternative200: "#fbbdc3",
        alternative500: "#f89da5",
        alternative600: "#f67c87",
        alternative700: "#F45B69",
        buttonNeutral0: "#ffffff",
        buttonPrimary500: "#f67c87",
        buttonPrimary600: "#F45B69",
        danger100: "#fcecea",
        danger200: "#f5c0b8",
        danger500: "#ee5e52",
        danger600: "#d02b20",
        danger700: "#b72b1a",
        neutral0: "#ffffff",
        neutral100: "#f6f6f9",
        neutral1000: "#181826",
        neutral150: "#eaeaef",
        neutral200: "#dcdce4",
        neutral300: "#c0c0cf",
        neutral400: "#a5a5ba",
        neutral500: "#A98487",
        neutral600: "#8C6B6E",
        neutral700: "#6B4D50",
        neutral800: "#54373A",
        neutral900: "#212134",
        primary100: "#fddee1",
        primary200: "#fbbdc3",
        primary500: "#f89da5",
        primary600: "#f67c87",
        primary700: "#F45B69",
        secondary100: "#eaf5ff",
        secondary200: "#b8e1ff",
        secondary500: "#66b7f1",
        secondary600: "#0c75af",
        secondary700: "#006096",
        success100: "#eafbe7",
        success200: "#c6f0c2",
        success500: "#5cb176",
        success600: "#328048",
        success700: "#2f6846",
        warning100: "#fdf4dc",
        warning200: "#fae7b9",
        warning500: "#f29d41",
        warning600: "#d9822f",
        warning700: "#be5d01",
      },
    },
    translations: {
      en: {
        "app.components.LeftMenu.navbrand.title": "API dashboard",
        "app.components.LeftMenu.navbrand.workplace": "Wildway",
      },
    },
  },

  bootstrap() {},
};
