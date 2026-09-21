# UI/UX Guidelines — SIWES & Entrepreneurship Program Management Portal

## 1. Design Goal

The SIWES & Entrepreneurship Program Management Portal should have a clean, professional, modern university-portal interface.

The design should feel trustworthy, practical, accessible, and professional.

The priority is usability and clarity over decoration.

---

## 2. Overall Design Principles

- Keep layouts clean and uncluttered.
- Use consistent spacing and alignment.
- Prioritize readable content and clear navigation.
- Use a limited colour palette.
- Use colour to communicate meaning, not simply decoration.
- Keep visual effects subtle.
- Avoid unnecessary animations.
- Avoid excessive gradients.
- Avoid excessive rounded cards.
- Avoid excessive shadows.
- Avoid decorative shapes that do not improve usability.
- Avoid filling every section with icons.
- Avoid excessive use of large headings.
- Keep important actions visually obvious.
- Design for mobile as well as desktop.

The portal should look like a real institutional system that could be used by students, trainers, coordinators, and administrators.

---

## 3. Brand Colour System

Use the following core palette consistently.

### Primary

Deep Navy:
`#0F2747`

Use for:
- Main navigation
- Primary headings where appropriate
- Primary buttons
- Important interface elements
- Footer background

### Secondary

Professional Blue:
`#1D5FA7`

Use for:
- Links
- Secondary interface elements
- Hover states
- Selected navigation items
- Supporting accents

### Accent

Warm Gold:
`#D4A72C`

Use sparingly for:
- Small highlights
- Important visual accents
- Selected indicators
- Supporting brand details

Gold should NOT become the dominant colour.

### Neutral Colours

White:
`#FFFFFF`

Light Background:
`#F7F9FC`

Border:
`#E2E8F0`

Primary Text:
`#172033`

Secondary Text:
`#5B6474`

Muted Text:
`#7A8494`

---

## 4. Semantic Status Colours

Status colours must remain consistent throughout the application.

Success:
`#16834B`

Use for:
- Paid
- Approved
- Completed
- Successful

Pending / Warning:
`#B7791F`

Use for:
- Pending
- Awaiting review
- In progress where appropriate

Error / Rejected:
`#C53030`

Use for:
- Failed
- Rejected
- Errors

Information:
`#2563A6`

Use for:
- Informational messages
- Neutral system notices

Do not use status colours simply because they look attractive.

---

## 5. Page Structure

Pages should generally use a consistent structure:

1. Navigation
2. Main content
3. Supporting sections where necessary
4. Footer

Dashboard pages should use:

1. Dashboard navigation/sidebar
2. Page heading
3. Important summary information
4. Main content
5. Supporting actions/information

Do not create completely different layouts for every page without a functional reason.

---

## 6. Navigation

The main navigation should be simple and easy to understand.

Public navigation may include:

- Home
- About
- Skills
- How It Works
- FAQ
- Contact
- Login / Register

Keep navigation labels short and clear.

Avoid unnecessary menu items.

On mobile, navigation should collapse into a simple mobile menu.

---

## 7. Typography

Use a clean modern sans-serif typeface.

Recommended hierarchy:

- Page title: strong and clear
- Section heading: medium/large
- Subheading: moderate
- Body text: comfortable reading size
- Supporting text: smaller but still readable

Do not use excessively large typography simply to make the page look impressive.

Body text should have comfortable line height and readable line length.

Avoid using many different font sizes in the same section.

---

## 8. Spacing

Use consistent spacing throughout the application.

Sections should have enough breathing room without creating unnecessarily large gaps.

Use a consistent spacing scale rather than random values.

Cards, forms, buttons, headings, and paragraphs should have predictable spacing relationships.

Avoid:

- Extremely cramped layouts
- Extremely large empty areas
- Random spacing between components

---

## 9. Buttons

Buttons should have clear labels describing the action.

Good examples:

- Apply Now
- Register
- Sign In
- Submit Application
- Make Payment
- View Application
- Submit Project
- View Result

Avoid vague labels such as:

- Click Here
- Continue
- Explore
- Let's Go

unless the context makes their meaning completely clear.

Primary buttons should use the primary brand colour.

Secondary buttons should be visually less prominent.

Dangerous actions such as deletion should use the error colour and require appropriate confirmation.

Do not make every button a pill shape.

---

## 10. Cards

Cards may be used to organize related information.

Use cards for things such as:

- Available skills
- Application summaries
- Payment information
- Training information
- Project information
- Dashboard statistics

Cards should remain simple.

Preferred characteristics:

- White background
- Subtle border
- Moderate border radius (rounded-lg)
- Soft shadow at rest (shadow-sm), deepening slightly on hover
- Slight lift on hover (small upward shift)
- Clear heading
- Good internal spacing

Do not put every piece of text into its own card.

---

## 11. Forms

Forms are especially important because students will use them for registration, profiles, applications, payments, and submissions.

Forms should:

- Clearly label every field.
- Use readable input sizes.
- Provide useful validation messages.
- Show required fields clearly.
- Keep related fields grouped together.
- Avoid unnecessary fields.
- Work well on mobile.
- Preserve entered information when possible after validation errors.

Never rely only on placeholder text as a field label.

---

## 12. Homepage Section Styling

The seven homepage components should feel like parts of one website.

### Hero

The hero should establish the portal identity.

Use:

- Strong heading
- Short supporting text
- Clear primary action
- Clean background
- Comfortable spacing

Avoid overly dramatic gradients or excessive decorative elements.

### About

Use a clean content-focused layout.

The section should explain the purpose of the SIWES & Entrepreneurship programme clearly.

### Skills

Skills may be presented using cards.

Cards can use subtle visual accents, but each card should follow the same design language.

Do not give every skill card a completely different colour.

### How It Works

Use a clear step-based layout.

Numbered steps are encouraged.

The visual hierarchy should make the process easy to understand at a glance.

### FAQ

Keep questions and answers easy to scan.

An accordion may be used if implemented simply and accessibly.

Avoid excessive decorative elements.

### Footer

The footer should provide useful supporting information and visually close the page.

Use the dark primary brand colour or another restrained dark neutral.

---

## 13. Section Colours

Different sections do NOT need completely different colours.

Use subtle variation instead.

Example:

- Hero: primary brand treatment
- About: white
- Skills: light neutral/brand-tinted background
- How It Works: white
- FAQ: light neutral background
- Footer: dark primary background

The whole homepage should still feel like one continuous design.

---

## 14. Images and Icons

Use images only when they improve communication.

Do not add stock images simply to fill empty space.

Icons should support understanding.

Avoid:

- Huge decorative icons
- Random icon styles
- Too many icons
- Icons with no functional purpose

Use one consistent icon style throughout the application.

---

## 15. Animation

Animations should be subtle, purposeful, and add polish without becoming
the focus of the page.

Acceptable examples:

- Small button hover transitions
- Navigation hover states
- Simple accordion transitions (FAQ)
- Small card hover feedback (slight lift, deeper shadow)
- One-time scroll-reveal: a section fades and shifts up slightly the
  first time it enters view, and never repeats
- Staggered entrance for grouped items (e.g. skill cards, step cards)
  appearing one after another, 50-100ms apart
- Smooth (not instant) scrolling when a navigation link jumps to a
  section on the same page

Avoid:

- Constant floating or looping animations
- Parallax scrolling effects
- Large entrance animations
- Flashing elements
- Auto-playing animations that repeat every time a section is
  scrolled past again
- Animations that slow down interaction or block content from being
  read immediately

The portal should still look good, and be fully usable, with
animations disabled (e.g. a user with "reduce motion" enabled in
their OS).

## 16. Responsive Design

The portal must work on:

- Desktop
- Laptop
- Tablet
- Mobile phone

Do not simply shrink desktop layouts.

Mobile layouts should intentionally reorganize content.

Check:

- Navigation
- Buttons
- Forms
- Cards
- Tables
- Dashboard layouts
- Text wrapping
- Spacing

Buttons and form controls should remain easy to use on touch screens.

---

## 17. Accessibility

Design decisions should consider accessibility.

Use:

- Sufficient colour contrast
- Readable text
- Visible focus states
- Proper form labels
- Semantic HTML
- Keyboard-accessible controls
- Meaningful button labels
- Alt text for meaningful images

Do not communicate important information using colour alone.

For example, an approved status should say "Approved" rather than being represented only by green.

---

## 18. Content Style

Use clear, natural language.

The portal should sound like a real university programme.

Avoid excessive marketing language such as:

- "Unlock your potential"
- "Empowering the future"
- "Revolutionizing education"
- "Seamless experience"
- "Next-generation platform"

Prefer direct language.

Example:

Instead of:

"Unlock your entrepreneurial potential through our revolutionary learning ecosystem."

Use:

"Complete your SIWES and Entrepreneurship programme, select a training area, submit your project, and track your progress online."

---

## 19. Developer Consistency Rules

All developers working on frontend components must follow this document.

Before creating new visual styles, check whether an existing style can be reused.

Do not introduce a new colour, button style, card style, font style, border radius, or animation without a clear reason.

Do not redesign another developer's component without discussing it with the lead developer.

Components should look like they belong to the same application.

---

## 20. Component-Specific Rule

The following components are assigned to different developers:

- Navbar
- Hero
- About
- Skills Showcase
- How It Works
- FAQ
- Footer

Each developer should focus on the assigned component while following the shared design system.

The component may have its own layout, but it must remain visually consistent with the rest of the website.

---

## 21. Quality Check Before Pull Request

Before creating a PR, check:

- Does the component match the project colour palette?
- Does it look consistent with the other sections?
- Is the spacing clean?
- Is the text readable?
- Does it work on mobile?
- Are buttons clearly labelled?
- Are hover/focus states reasonable?
- Did you avoid unnecessary animations?
- Did you avoid excessive rounded cards?
- Did you avoid unnecessary gradients?
- Does it look like a professional university portal?
- Does it feel polished and appropriate for a university programme?

If the answer to these questions is yes, the component is ready for review.

---

## 22. Design Standard

The final portal should communicate:

**Professional**  
**Clean**  
**Trustworthy**  
**Modern**  
**Simple**  
**Accessible**  
**Institutional**

The goal is not to make the portal visually complicated.

The goal is to make it look like a real system that students and university staff would confidently use.
