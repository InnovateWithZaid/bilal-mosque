

## Floating Theme Toggle Button

A small floating button will be added to the app that lets you switch between light and dark mode with a single tap.

### What you'll see
- A small circular button in the bottom-right corner of the screen, positioned just above the bottom navigation bar
- It shows a sun icon in dark mode and a moon icon in light mode
- Tapping it instantly switches the theme
- It has a frosted glass background to blend nicely with any page

### Technical details

**New file: `src/components/ThemeToggle.tsx`**
- A small component using `useTheme()` from `next-themes` to read and set the current theme
- Renders a fixed-position button at `bottom-24 right-4` (above the nav bar)
- Uses `Sun` and `Moon` icons from `lucide-react`
- Styled with `bg-card/90 backdrop-blur-sm` for a subtle glass effect, with `shadow-lg` and rounded-full shape
- Handles the `resolvedTheme` to correctly toggle between light and dark

**Modified file: `src/App.tsx`**
- Import and render `<ThemeToggle />` alongside `<Toaster />` and `<Sonner />` so it appears globally on every page

