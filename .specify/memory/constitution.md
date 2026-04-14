# 🏛️ Project Constitution & AI Coding Guidelines

## 1. Core Philosophy: Bootstrap 5 First
- This project is built strictly on **Bootstrap 5**.
- **NEVER** write custom CSS for layout, spacing (margins/paddings), sizing, or typography if a Bootstrap utility class exists (e.g., use `mt-4`, `d-flex`, `justify-content-between`, `text-center`, `fw-bold`).
- Rely entirely on Bootstrap's grid system (`container`, `row`, `col-*`). Do not invent custom grid wrappers unless absolutely necessary for a complex, non-standard layout.

## 2. Strictly Use Established Variables (Design System)
- Our Design System is firmly established in `:root` inside `css/main.css`.
- **NEVER** use hardcoded colors (e.g., `#104084` or `rgba`). You MUST use the defined CSS variables (e.g., `var(--bs-primary)`, `var(--custom-primary-hover)`, `var(--bs-white)`).
- The font family (Almarai) is set globally. Do not redefine `font-family` on individual elements.

## 3. Absolute Prohibitions (The "Never Do This" List)
- **NO INLINE STYLES:** Never use `style="..."` anywhere in the HTML. This is a strict rule.
- **NO ID STYLING:** Do not use `#id` selectors in `main.css`. Target elements via classes only.
- **NO CSS DUPLICATION:** Do not write custom CSS that exactly mimics a Bootstrap utility. 
- **MINIMIZE `!important`:** Only use it if overriding a stubborn native Bootstrap component behavior is impossible otherwise.

## 4. Component Construction & UI Elements
- When building standard components (like Navbars, Footers, Modals, Cards), ALWAYS start with the official Bootstrap 5 HTML structure and classes.
- Customize their look using our CSS variables and Bootstrap utilities first. 
- If custom CSS is unavoidable, write it cleanly in `css/main.css` using semantic, self-explanatory class names (e.g., `.custom-hero-bg`, `.navbar-brand-logo`).

## 5. Responsive & Interactive States
- Mobile-first approach is mandatory.
- Use Bootstrap breakpoints properly (`sm`, `md`, `lg`, `xl`, `xxl`). Ensure components like the Navbar collapse correctly on mobile.
- All interactive elements must have clear `:hover`, `:active`, and `:focus` states using our predefined custom variable shades.

## 6. RTL & LTR Bi-Directional Support (Arabic & English)
- **Logical Properties ONLY:** NEVER use physical CSS directions (e.g., `left`, `right`, `margin-left`, `padding-right`). ALWAYS use modern CSS Logical Properties (e.g., `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-start`).
- **Bootstrap 5 Directional Utilities:** Rely strictly on BS5's logical utility classes. Use `ms-*` (margin-start) instead of left margins, `pe-*` (padding-end), `text-start`, `text-end`, and `float-start`.
- **JavaScript & Sliders:** Any JS initialization (especially Swiper.js) MUST respect the document's direction. Dynamically check `document.documentElement.dir === 'rtl'` if programmatic changes are needed.
- **HTML Structure:** The `<html>` tag must define the direction and language (e.g., `<html lang="ar" dir="rtl">` or `<html lang="en" dir="ltr">`). All code must work seamlessly simply by changing this attribute.