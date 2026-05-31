/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./public/src/**/*.{js,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Material Design surface tokens ──────────────────────────────
        "surface":                    "#faf9ff",
        "surface-dim":                "#d5d9ea",
        "surface-bright":             "#faf9ff",
        "surface-container-lowest":   "#ffffff",
        "surface-container-low":      "#f1f3ff",
        "surface-container":          "#e9edfe",
        "surface-container-high":     "#e4e8f9",
        "surface-container-highest":  "#dee2f3",
        "on-surface":                 "#161b27",
        "on-surface-variant":         "#41474c",
        "inverse-surface":            "#2b303d",
        "inverse-on-surface":         "#edf0ff",
        "surface-tint":               "#3a637c",
        "surface-variant":            "#dee2f3",

        // ── Outline tokens ──────────────────────────────────────────────
        "outline":                    "#72787d",
        "outline-variant":            "#c1c7cd",

        // ── Primary (Malom Blue) ────────────────────────────────────────
        "primary":                    "#315972",
        "on-primary":                 "#ffffff",
        "primary-container":          "#4a728c",
        "on-primary-container":       "#e4f3ff",
        "inverse-primary":            "#a3cce9",
        "primary-fixed":              "#c7e7ff",
        "primary-fixed-dim":          "#a3cce9",
        "on-primary-fixed":           "#001e2e",
        "on-primary-fixed-variant":   "#204b63",

        // ── Secondary ───────────────────────────────────────────────────
        "secondary":                  "#605f54",
        "on-secondary":               "#ffffff",
        "secondary-container":        "#e6e3d5",
        "on-secondary-container":     "#66655a",
        "secondary-fixed":            "#e6e3d5",
        "secondary-fixed-dim":        "#c9c7ba",
        "on-secondary-fixed":         "#1c1c14",
        "on-secondary-fixed-variant": "#48473d",

        // ── Tertiary (Bronze) ───────────────────────────────────────────
        "tertiary":                   "#6a512c",
        "on-tertiary":                "#ffffff",
        "tertiary-container":         "#846941",
        "on-tertiary-container":      "#ffeedc",
        "tertiary-fixed":             "#ffddb1",
        "tertiary-fixed-dim":         "#e3c193",
        "on-tertiary-fixed":          "#291800",
        "on-tertiary-fixed-variant":  "#5a431f",

        // ── Error ───────────────────────────────────────────────────────
        "error":                      "#ba1a1a",
        "on-error":                   "#ffffff",
        "error-container":            "#ffdad6",
        "on-error-container":         "#93000a",

        // ── Background ─────────────────────────────────────────────────
        "background":                 "#faf9ff",
        "on-background":              "#161b27",

        // ── Brand custom tokens ─────────────────────────────────────────
        "tatar-sage":                 "#A2A094",
        "bronze":                     "#8B6F47",
        "warm-white":                 "#FAFAF8",
        "stone":                      "#F5F4F1",
      },

      borderRadius: {
        DEFAULT: "2px",
        lg:      "4px",
        xl:      "8px",
        full:    "9999px",
      },

      spacing: {
        section_padding: "120px",
        unit:            "8px",
        max_width:       "1280px",
        gutter:          "24px",
        margin_mobile:   "20px",
      },

      fontFamily: {
        // Semantic aliases map to actual font stacks
        "display-lg":          ["Merriweather", "Georgia", "serif"],
        "headline-lg":         ["Merriweather", "Georgia", "serif"],
        "headline-lg-mobile":  ["Merriweather", "Georgia", "serif"],
        "headline-md":         ["Merriweather", "Georgia", "serif"],
        "body-lg":             ["Inter", "system-ui", "sans-serif"],
        "body-md":             ["Inter", "system-ui", "sans-serif"],
        "label-sm":            ["Inter", "system-ui", "sans-serif"],
      },

      fontSize: {
        "display-lg":         ["64px",  { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "300" }],
        "headline-lg":        ["48px",  { lineHeight: "1.2",  fontWeight: "300" }],
        "headline-lg-mobile": ["32px",  { lineHeight: "1.2",  fontWeight: "300" }],
        "headline-md":        ["32px",  { lineHeight: "1.3",  fontWeight: "300" }],
        "body-lg":            ["18px",  { lineHeight: "1.7",  fontWeight: "400" }],
        "body-md":            ["16px",  { lineHeight: "1.7",  fontWeight: "400" }],
        "label-sm":           ["12px",  { lineHeight: "1.2",  letterSpacing: "0.1em", fontWeight: "600" }],
      },

      maxWidth: {
        "max_width": "1280px",
      },
    },
  },
  plugins: [],
}
