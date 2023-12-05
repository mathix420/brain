const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addVariant }) {
      addVariant("second-last", "&:nth-last-child(2)");
      addVariant("third-last", "&:nth-last-child(3)");
      addVariant("fourth-last", "&:nth-last-child(4)");
    }),
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#0d0d0d",
        },
      },
    },
  },
};
