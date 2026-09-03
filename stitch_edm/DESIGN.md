---
name: Estate Letter Editorial
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444651'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#fd8a42'
  on-secondary-container: '#682c00'
  tertiary: '#00312d'
  on-tertiary: '#ffffff'
  tertiary-container: '#004944'
  on-tertiary-container: '#65bbb1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#9cf2e8'
  tertiary-fixed-dim: '#80d5cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#00504a'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: plusJakartaSans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: plusJakartaSans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: plusJakartaSans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: plusJakartaSans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: plusJakartaSans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: notoSans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: notoSans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: notoSans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: notoSans
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: notoSans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  stat-display:
    fontFamily: plusJakartaSans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-xxs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-xxl: 3rem
  container-newsletter: 600px
  container-kakaotalk: 400px
  gutter-default: 1rem
  margin-mobile: 1rem
  margin-desktop: 1.5rem
---

## Brand & Style

The design system establishes an authoritative, institutional, yet accessible tone suited for high-stakes property advisory and certified brokerage reporting. The audience consists of property buyers, high-net-worth investors, apartment complex residents, and regular advisory clients looking for verified legal and market intelligence.

The visual style blends **Corporate Modernism** with **Financial Editorial Precision**. It eschews superficial trends in favor of crystalline structure: high-contrast typography, strict grid alignment, crisp micro-borders, and tactile data blocks. Every visual container serves to establish trust, compliance, and actionable clarity, whether delivered via desktop email clients, mobile EDM templates, or 1:1 mobile cards on KakaoTalk.

## Colors

- **Primary (`#1E3A8A`)**: Deep Trust Navy. Anchors mastheads, primary action triggers, certified broker seals, and leading visual markers. Evokes institutional weight and financial dependability.
- **Secondary (`#B45309`)**: Burnished Amber / Gold. Highlights transaction milestones, premium property callouts, exclusive insights, and critical regulatory dates without aggressive urgency.
- **Tertiary (`#0F766E`)**: Deep Pine Teal. Assigned to policy updates, official tax bureau notices, and positive yield or growth metrics.
- **Neutral (`#0F172A`)**: Deep Slate Gray. Primary text color engineered for crisp reading against pure white (`#FFFFFF`) cards and soft off-white canvas backgrounds (`#F8FAFC`). Subdued supporting neutrals utilize `#64748B` for secondary captions and `#E2E8F0` for structural dividing rules.

## Typography

The type system pairs **Plus Jakarta Sans** for alphanumeric headings, KPI callouts, and key data points with **Noto Sans** for high-density Korean editorial body text.

- Headings prioritize assertive weights (`700` and `800`) to anchor newsletter sections and ensure instant scannability on small screens.
- Body sizes stick to a comfortable `16px` (large) and `14px` (standard) base with generous line heights (`1.6` ratio) to guarantee legibility of complex tax clauses, legal notices, and multi-paragraph market summaries.
- Mobile scaling ensures headline text never wraps awkwardly in 1:1 or 4:5 KakaoTalk feed views.

## Layout & Spacing

The layout is built on a fixed-width container logic tailored specifically for direct distribution channels:
- **Email / EDM Template**: Centered `600px` fixed container on desktop, reflowing to `100%` viewport width with `16px` side margins on mobile clients.
- **KakaoTalk Card News**: Fixed `1:1` (Square, 400x400 / 800x800) or `4:5` (Vertical, 400x500 / 800x1000) structured cards using strict internal card padding of `20px` to `24px`.

The baseline scale uses an 8px grid (with 4px half-steps for compact badge padding and badge-to-title offsets). Multi-column market statistics reflow from a 3-column desktop layout to a 1-column or 2x2 grid layout on screens below 480px.

## Elevation & Depth

To maintain high deliverability across strict HTML email parsers (Outlook, Apple Mail, Gmail) and pixel fidelity across mobile messenger previews, visual hierarchy relies on **crisp low-contrast outlines** complemented by **subtle, high-diffusion ambient shadows**.

- **Canvas Tier**: `#F8FAFC` base slate tone.
- **Card Surface**: Pure `#FFFFFF` surface container framed with a hairline `1px solid #E2E8F0` border.
- **Featured Card Elevation**: For lead transaction spotlights or primary CTA blocks, apply an ambient shadow: `0 4px 16px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.03)`.
- **Policy Alert Banners**: Border-driven hierarchy with a thick `3px` left accent strip in primary navy or amber.

## Shapes

The design system maintains a **Soft (`1`)** shape language to reflect administrative precision and architectural structure:
- Base card containers and modal boxes employ `0.5rem` (`8px`) corners.
- Interactive buttons, stat callout tiles, and policy badges carry `0.25rem` (`4px`) to `0.375rem` (`6px`) soft corners.
- Micro-tags and regulatory agency pills utilize soft geometric containment rather than fully round circular pill geometry to preserve institutional formality.

## Components

### 1. Buttons & Action Links
- **Primary Consultation CTA**: Solid `#1E3A8A` background, pure white text, bold weight (`700`), `14px` vertical by `24px` horizontal padding, `6px` radius. Includes a subtle rightward chevron icon (`→`). Active/Hover: `#172554`.
- **Secondary / Direct Phone CTA**: Transparent background with a `1.5px solid #1E3A8A` stroke and `#1E3A8A` text.
- **Kakao Quick Consultation Button**: Soft pale yellow background (`#FEE500`) with `#191919` text, calibrated with bold typography for maximum mobile conversion.

### 2. Policy & Source Badges
- **Ministry of Land, Infrastructure and Transport (국토교통부)**: Subtle slate-blue surface (`#EFF6FF`), `#1E3A8A` text, `1px solid #DBEAFE`.
- **Ministry of Economy and Finance (기획재정부)**: Subtle amber surface (`#FEF3C7`), `#92400E` text, `1px solid #FDE68A`.
- **National Tax Service (국세청)**: Subtle emerald/teal surface (`#CCFBF1`), `#115E59` text, `1px solid #99F6E4`.
- Structure: `2px` vertical by `8px` horizontal padding, `11px` uppercase/bold text.

### 3. Market Summary Stat Tiles
- Background `#F8FAFC`, hairline `#E2E8F0` border, `12px` inner padding.
- Displays metric label in `#64748B` (`12px`), followed by the headline numerical value in `#0F172A` (`24px` to `28px` bold), with dynamic directional delta chips (`▲ 2.4%` in crimson `#DC2626`, `▼ 1.1%` in deep blue `#2563EB`).

### 4. Article & Card News Containers
- White background (`#FFFFFF`), `1px solid #E2E8F0` border, `16px` to `20px` internal padding.
- Card header contains metadata row (Badge + Timestamp + Certified Agent Name).
- Section divider: Hairline `1px` rule using `#F1F5F9`.

### 5. Official Disclaimers & Broker Identity Footer
- Muted `#64748B` body typography at `11px` with line-height `18px`.
- Dedicated brokerage credentials grid: Business License No., Dedicated Broker ID, Office Physical Address, and Dispute Resolution Contact, demarcated by an upper rule (`1px solid #CBD5E1`).