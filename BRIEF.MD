#Project Brief: UX Heuristics Audit Tool


##Overview
A responsive, mobile-first utility app designed for UX practitioners and design leaders to conduct rapid heuristic evaluations in the field. This tool replaces cumbersome spreadsheets and static PDFs, allowing evaluators to walk through a product screen-by-screen, rate usability against established heuristics, and instantly generate shareable, visual severity reports. The design aesthetic is premium and modern, utilizing an "Ambient Gradient & 3D Accent" style that balances professional utility with an airy, engaging interface.



##Users
•	Design Leaders & UX Researchers: The primary users conducting live audits during product reviews, competitive analyses, or client meetings. They need a tool that is fast, touch-friendly, and capable of capturing nuanced feedback on the go without breaking their flow.
•	Product Managers & Developers: The secondary audience who receive the generated reports. They need clear, prioritized, and visually digestible summaries of UX debt and actionable recommendations.



##Design Style
The interface must feel airy, modern, and premium, stepping away from traditional stark utility apps and avoiding glassmorphism entirely. The visual direction is defined by:
•	Ambient Gradient Backgrounds: The foundational layer of the app is a soft, dreamy ambient gradient (e.g., sky blue blending into soft lavender and pale blush). This gradient covers the full viewport behind the main UI.
•	Crisp White Cards: All interactive UI content sits inside clean, pure white cards (#FFFFFF) with generous border radii (20px to 24px) and subtle, soft drop shadows. This creates a distinct separation between the content and the ambient background.
•	Vibrant Gradient Accents: A secondary gradient (e.g., pink-to-violet) is used purposefully for data visualization (score rings, progress bars) and key interactive states.
•	3D Accent Objects: Soft, glossy 3D rendered objects (e.g., a shield, a checkmark) are used as decorative accents, often partially cropped at the edges of the screen or cards, to add depth and personality without cluttering the interface.



##Layout & Navigation
•	Mobile-First Structure: Designed primarily for portrait orientation on mobile devices, ensuring all tap targets are accessible with one hand.
•	Card-Based Hierarchy: The primary layout relies on nested cards. A main container card holds the overarching audit data, while smaller nested cards with subtle borders group related insights (e.g., peer benchmarks or specific heuristic categories).
•	Bottom Navigation: A standard, accessible bottom tab bar for quick switching between core functions: Overview, Active Audits, History, and Settings.
•	Floating Actions: Key contextual actions (like "Add Note" or "Capture Screenshot") should be accessible via a floating action button (FAB) or anchored bottom pill button.



##Typography
•	Font Family: The Inter font family must be used across the application for its clean, modern readability and excellent legibility at small sizes on mobile screens.
•	Hierarchy:
◦	Headings: Bold, dark navy or deep charcoal sans-serif. Used for card titles and major data points (e.g., the overall audit score).
◦	Body Text: Medium gray for descriptions and secondary information.
◦	Microcopy: Small, legible text for labels, timestamps, and data visualization axes.
•	Constraints: Never use bordered fonts. Maintain consistent title and copy placement across all steps of the audit flow.

Role	Weight	Size (rem)	Color Variable
H1 (Score)	700	3.5+	--text-primary (#0F172A)
H2 (Title)	600	1.5	--text-primary (#0F172A)
Body (Label)	500	1.0	--text-primary (#0F172A)
Body (Desc)	400	0.875	--text-secondary (#64748B)
Small/Meta	400	0.75	--text-tertiary (#94A3B8)


##Color Palette
The color system relies on high contrast between the text and the white cards, while the background provides the visual interest. All text and interactive elements must meet WCAG 2.2 AA accessibility standards.

/* Ambient Background Gradient */
--color-bg-ambient-start: #BAE6FD; /* Sky Blue */
--color-bg-ambient-mid:   #DDD6FE; /* Soft Lavender */
--color-bg-ambient-end:   #FCE7F3; /* Pale Blush */
 
/* Surface & Shadows */
--color-surface-card:     #FFFFFF; /* Pure White */
--color-shadow-card:      0 10px 40px -10px rgba(0, 0, 0, 0.08);
--color-border-subtle:    #F1F5F9; /* Slate 100 for nested cards */
 
/* Typography */
--color-text-primary:     #0F172A; /* Slate 900 */
--color-text-secondary:   #64748B; /* Slate 500 */
--color-text-tertiary:    #94A3B8; /* Slate 400 */
 
/* Interactive Gradient Accent (Score Rings, Progress Bars) */
--color-accent-start:     #F43F5E; /* Rose 500 */
--color-accent-end:       #8B5CF6; /* Violet 500 */



##Components & UI Elements
•	Buttons: All primary and secondary buttons must be designed in a pill style (fully rounded ends).
•	Icons: Lead with a circular icon style. Ensure all icons are drawn from a consistent, modern, flat library. Do not use clip art styles.
•	Progress Indicators: Use thick, gradient-filled circular rings for overall scores and horizontal bars with rounded caps for individual heuristic categories.
•	Checkboxes/Toggles: Custom, oversized touch targets suitable for mobile use, utilizing the accent gradient when in the active state.



##Core Features & Functionality
1	New Audit Flow: A streamlined setup process to define the product being audited, the platform (iOS, Web, etc.), and the heuristic framework (e.g., Nielsen's 10).
2	Evaluation Interface: A swipeable or scrollable checklist where the user rates each heuristic (Pass, Warning, Critical). Includes quick-tap options to attach a photo (screenshot) or dictate a voice note.
3	Real-time Dashboard: As the audit progresses, a white card dashboard updates the overall score and category breakdowns using the gradient progress rings and bars.
4	Report Generation: One-tap export to generate a visually polished, shareable web link or PDF summarizing the findings, prioritized by severity.



##Tech Stack Recommendations
Given the need for a responsive, mobile-first experience with smooth transitions and potential native device access (camera for screenshots):
•	Framework: React Native (Expo) or a responsive Progressive Web App (PWA) using React/Next.js.
•	Styling: Tailwind CSS (or equivalent utility classes) for rapid UI development and consistent spacing.
•	Animations: Framer Motion (for web) or Reanimated (for React Native) to handle the smooth transitions between audit questions and the rendering of the gradient progress rings.




