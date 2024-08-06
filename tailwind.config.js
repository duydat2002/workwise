/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#546fff",
          light: "#8aa0e8",
          extraLight: "var(--primary-extraLight-color)",
        },
        textColor: {
          primary: "var(--primary-text-color)",
          secondary: "var(--secondary-text-color)",
          subtitle: "var(--subtitle-text-color)",
          tooltip: "var(--tooltip-text-color)",
        },
        bgColor: {
          primary: "var(--primary-bg-color)",
          secondary: "var(--secondary-bg-color)",
          tooltip: "var(--tooltip-bg-color)",
        },
        borderColor: {
          DEFAULT: "var(--border-color)",
          dark: "var(--border-dark-color)",
          extraDark: "var(--border-super-dark-color)",
        },
        link: "var(--link-color)",
        error: "var(--error-color)",
        hover: "var(--hover-color)",
        modal: "var(--modal-color)",
      },
      width: {
        "sidebar-normal": "var(--sidebar-normal-width)",
        "sidebar-narrow": "var(--sidebar-narrow-width)",
      },
      boxShadow: {
        DEFAULT: "4px 0 24px rgba(0,0,0,0.15)",
        item: "0px 1px 1px #091E4240, 0px 0px 1px #091E424F",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant, matchVariant, addUtilities }) {
      matchVariant("has", (value) => {
        return `&${value}`;
      });
      matchVariant("parent", (value) => {
        return `${value} &`;
      });
      matchVariant("pseudo", (value) => {
        return `&::${value}`;
      });
      addVariant("exact-link", `&.exact-link-active`);
      addVariant("not-lastchild", `&>*:not(:last-child)`);
      addVariant("not-firstchild", `&>*:not(:first-child)`);
      addUtilities({
        ".flex-center": {
          "align-items": "center",
          "justify-content": "center",
        },
      });
      addUtilities({
        ".text-dots": {
          overflow: "hidden",
          "white-space": "nowrap",
          "text-overflow": "ellipsis",
        },
      });
      addUtilities({
        ".absolute-center": {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
      });
      addUtilities({
        ".line-clamp-3": {
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "3",
          overflow: "hidden",
          "text-overflow": "ellipsis",
        },
      });
      addUtilities({
        ".required-field::after": {
          content: '" *"',
          color: "var(--error-color)",
        },
      });
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
