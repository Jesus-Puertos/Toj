---
name: TOJ Design System
colors:
  surface: '#f8fafa'
  surface-dim: '#d8dada'
  surface-bright: '#f8fafa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f4'
  surface-container: '#eceeee'
  surface-container-high: '#e6e8e9'
  surface-container-highest: '#e1e3e3'
  on-surface: '#191c1d'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#eff1f1'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a60'
  primary: '#00685e'
  on-primary: '#ffffff'
  primary-container: '#008377'
  on-primary-container: '#f4fffb'
  inverse-primary: '#64d9c9'
  secondary: '#a23e1f'
  on-secondary: '#ffffff'
  secondary-container: '#fe825e'
  on-secondary-container: '#721c00'
  tertiary: '#505d6f'
  on-tertiary: '#ffffff'
  tertiary-container: '#687688'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#82f6e5'
  primary-fixed-dim: '#64d9c9'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb59f'
  on-secondary-fixed: '#3b0a00'
  on-secondary-fixed-variant: '#822709'
  tertiary-fixed: '#d6e4f9'
  tertiary-fixed-dim: '#bac8dc'
  on-tertiary-fixed: '#0f1c2c'
  on-tertiary-fixed-variant: '#3a4859'
  background: '#f8fafa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e3'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2.5rem
  2xl: 4rem
---

## Brand & Style
This design system bridges the gap between high-trust public service and modern financial agility. It employs a **Dual-Mode Aesthetic** to serve two distinct user archetypes:

1.  **Citizen-Facing (The Concierge):** A warm, mobile-first experience using soft edges and generous whitespace. It draws inspiration from modern library patterns, emphasizing approachability and ease of use.
2.  **Government-Facing (The Dashboard):** A high-density, analytical environment focused on data integrity and throughput. It utilizes a structured, "utility-first" aesthetic to minimize eye strain during long-form administrative tasks.

The overall personality is **Authoritative yet Accessible**, radiating stability through deep tones while maintaining a fresh, modern edge with its jade-green primary accents.

## Colors
The palette is engineered for high legibility and semantic clarity:

*   **Jade (#009B8D):** Used as the primary action color and success indicator. It represents growth and financial health.
*   **Deep Blue (#0D1B2A):** The anchor for navigation, headers, and administrative backgrounds. It provides the "institutional" weight required for a GovTech platform.
*   **Terracotta (#E26D4A):** A sophisticated alert and secondary action color. It draws attention without the harshness of a standard red, used for secondary CTAs and cautionary status.
*   **General Background (#F8FAFA):** A slightly cooled off-white to reduce glare during extended usage sessions.

## Typography
This design system utilizes **Inter** for all interface elements due to its exceptional x-height and legibility in data-heavy contexts.

*   **Headlines:** Utilize tighter letter-spacing and heavier weights to establish a strong hierarchy.
*   **Citizen App:** Leans toward `body-lg` for primary interactions to ensure accessibility on mobile devices.
*   **Government CRM:** Prefers `body-sm` and `label-caps` to maximize information density on large displays.
*   **Numerical Data:** Tabular figures should be enabled via OpenType features to ensure financial columns align perfectly.

## Layout & Spacing
A dual-track spacing philosophy is applied:

*   **Citizen Layout:** A mobile-first, single-column flow with a maximum width of 600px for tablet/desktop centering. It uses `lg` and `xl` spacing to create a "breathable" feel that reduces cognitive load.
*   **Government CRM:** A 12-column fluid grid designed for 1440p displays. It uses `sm` and `md` spacing to pack data efficiently. Sidebars are fixed at 240px, while content areas expand to fill the viewport.

## Elevation & Depth
Depth is used to signify "workspaces" versus "reference areas":

*   **Layer 0 (Flat):** The general background (#F8FAFA).
*   **Layer 1 (Card/Surface):** Pure white (#FFFFFF) with a 1px border (#E5E7EB).
*   **Layer 2 (Interactive):** Citizen app uses soft, ambient shadows (0 10px 15px -3px rgba(13, 27, 42, 0.05)) to suggest "touchability."
*   **Layer 3 (Modals):** High-contrast shadows with a 40% Deep Blue backdrop blur to isolate critical financial tasks.
*   **Administrative Depth:** In the CRM, elevation is represented primarily through tonal shifts (slight grays) and inset borders rather than shadows to keep the UI feeling "crisp" and "fast."

## Shapes
Shape language is the primary differentiator between the two experiences:

*   **Citizen App:** Inherits `rounded-xl` (1.5rem) for primary buttons and `rounded-lg` (1rem) for cards. This creates a friendly, "safe" environment.
*   **Government CRM:** Overrides the system default to use `rounded-sm` (0.125rem) or `rounded-none`. The squared edges communicate precision, order, and professionalism.
*   **Form Inputs:** Maintain a consistent `rounded-md` (0.375rem) across both platforms for a balanced middle ground.

## Components
### Buttons
*   **Primary:** Jade background with white text. High-radius in Citizen app, squared in CRM.
*   **Secondary:** Deep Blue ghost buttons with 1px borders.
*   **Critical:** Terracotta background for destructive actions (e.g., "Cancel Payment").

### Inputs
*   **Validation:** Use Jade for success and Terracotta for errors. 
*   **Focus:** 2px solid ring of Jade with 2px offset.

### Cards
*   **Citizen:** White background, soft shadow, 1.5rem padding.
*   **CRM:** White background, 1px border, 0.75rem padding, condensed header rows.

### Data Tables (CRM Exclusive)
*   Alternating row stripes using the Neutral background color.
*   Sticky headers with Deep Blue text.
*   Compact padding to ensure 20+ rows are visible without scrolling.

### Progress Indicators
*   Used heavily in Citizen-facing apps for multi-step applications. Use Jade "fill" with a soft gray track.