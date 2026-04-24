// ============================================================
//  OCEAN BLUE THEME  —  Drop this into your project
//  Usage: import { OCEAN_THEME, BRANCH_THEMES, CSS_VARIABLES } from './oceanTheme'
// ============================================================

// ── 1. Single global theme token set ────────────────────────
export const OCEAN_THEME = {
  // Primary brand colours
  primary:        "#0077B6",   // deep ocean blue
  primaryDim:     "#023E8A",   // darker navy
  primaryBorder:  "#0096C7",   // bright mid-blue
  primaryLight:   "#90E0EF",   // sky / highlight
  primaryPale:    "#CAF0F8",   // near-white tint
  accent:         "#00B4D8",   // vivid cyan accent

  // Surfaces
  bgPage:         "#F0F8FF",   // alice blue page bg
  bgCard:         "#FFFFFF",
  bgCardAlt:      "#E8F4FD",   // subtle blue-tinted card
  bgSidebar:      "#03045E",   // deep navy sidebar

  // Text
  textOnDark:     "#FFFFFF",
  textOnLight:    "#03045E",
  textMuted:      "#4A6FA5",
  textSecondary:  "#5E85B0",

  // Borders
  border:         "rgba(0, 119, 182, 0.20)",
  borderStrong:   "rgba(0, 150, 199, 0.45)",

  // Status colours (keep your existing semantic meaning)
  success:        "#0A9396",
  warning:        "#E9C46A",
  danger:         "#E63946",
  info:           "#4CC9F0",

  // Glow / shadows
  glow:           "rgba(0, 180, 216, 0.12)",
  shadowCard:     "0 2px 12px rgba(0, 119, 182, 0.10)",
  shadowHeader:   "0 4px 20px rgba(3, 4, 94, 0.18)",
};

// ── 2. Replace your BRANCH_THEMES with ocean-blue versions ──
//    All branches share the ocean palette; only the label/initial differ.
export const BRANCH_THEMES = {
  raya: {
    primary:      OCEAN_THEME.primary,
    primaryDim:   OCEAN_THEME.primaryDim,
    primaryBorder:OCEAN_THEME.primaryBorder,
    glow:         OCEAN_THEME.glow,
    label:        "Raya Branch",
    initial:      "R",
  },
  lakshmi: {
    primary:      OCEAN_THEME.primary,
    primaryDim:   OCEAN_THEME.primaryDim,
    primaryBorder:OCEAN_THEME.primaryBorder,
    glow:         OCEAN_THEME.glow,
    label:        "Lakshmi Branch",
    initial:      "L",
  },
  laxmiNagar: {
    primary:      OCEAN_THEME.primary,
    primaryDim:   OCEAN_THEME.primaryDim,
    primaryBorder:OCEAN_THEME.primaryBorder,
    glow:         OCEAN_THEME.glow,
    label:        "Laxmi Nagar Branch",
    initial:      "LN",
  },
  // ← Add more branches here following the same pattern
};

// ── 3. CSS custom properties string ─────────────────────────
//    Inject into your root element or <style> tag at app startup.
export const CSS_VARIABLES = `
  :root {
    --ocean-primary:         ${OCEAN_THEME.primary};
    --ocean-primary-dim:     ${OCEAN_THEME.primaryDim};
    --ocean-primary-border:  ${OCEAN_THEME.primaryBorder};
    --ocean-primary-light:   ${OCEAN_THEME.primaryLight};
    --ocean-primary-pale:    ${OCEAN_THEME.primaryPale};
    --ocean-accent:          ${OCEAN_THEME.accent};

    --ocean-bg-page:         ${OCEAN_THEME.bgPage};
    --ocean-bg-card:         ${OCEAN_THEME.bgCard};
    --ocean-bg-card-alt:     ${OCEAN_THEME.bgCardAlt};
    --ocean-bg-sidebar:      ${OCEAN_THEME.bgSidebar};

    --ocean-text-on-dark:    ${OCEAN_THEME.textOnDark};
    --ocean-text-on-light:   ${OCEAN_THEME.textOnLight};
    --ocean-text-muted:      ${OCEAN_THEME.textMuted};
    --ocean-text-secondary:  ${OCEAN_THEME.textSecondary};

    --ocean-border:          ${OCEAN_THEME.border};
    --ocean-border-strong:   ${OCEAN_THEME.borderStrong};

    --ocean-success:         ${OCEAN_THEME.success};
    --ocean-warning:         ${OCEAN_THEME.warning};
    --ocean-danger:          ${OCEAN_THEME.danger};
    --ocean-info:            ${OCEAN_THEME.info};

    --ocean-glow:            ${OCEAN_THEME.glow};
    --ocean-shadow-card:     ${OCEAN_THEME.shadowCard};
    --ocean-shadow-header:   ${OCEAN_THEME.shadowHeader};
  }
`;

// ── 4. Tailwind-style utility class map (optional) ───────────
//    If you use inline styles or a CSS-in-JS approach, import this map.
export const THEME_CLASSES = {
  header:   { background: OCEAN_THEME.primaryDim,   color: OCEAN_THEME.textOnDark },
  sidebar:  { background: OCEAN_THEME.bgSidebar,    color: OCEAN_THEME.textOnDark },
  card:     { background: OCEAN_THEME.bgCard,        border: `1px solid ${OCEAN_THEME.border}`, boxShadow: OCEAN_THEME.shadowCard },
  badge:    { background: OCEAN_THEME.primaryPale,   color: OCEAN_THEME.primaryDim },
  button:   { background: OCEAN_THEME.primary,       color: OCEAN_THEME.textOnDark, border: "none" },
  buttonOutline: { background: "transparent", color: OCEAN_THEME.primary, border: `1px solid ${OCEAN_THEME.primaryBorder}` },
  inputFocus: { outline: `2px solid ${OCEAN_THEME.primaryBorder}`, outlineOffset: "2px" },
  sectionLabel: { color: OCEAN_THEME.textMuted, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },
};
