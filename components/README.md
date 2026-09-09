# FrameSequenceHero — install notes

This repo **cannot render this component as-is**. It is a static HTML/CSS/JS
site: no React, no TypeScript, no Tailwind, no bundler, no `node_modules`.
The files here are staged so they drop straight into a real project.

`components.json` at the repo root looks like a shadcn config but is not one —
it only holds a registry URL and has no `aliases`, `tailwind`, `style`, or
`rsc` keys, so `shadcn` has nothing to resolve `@/components/ui` against.

## Component path

The demo imports from `@/components/ui/mac-book-neo-hero`, so the component
must live at **`components/ui/`** (or `src/components/ui/` — whichever your
`aliases.ui` points at). That path is not cosmetic:

- `shadcn` writes to `aliases.ui` and expects to find existing components
  there. Put it elsewhere and the CLI will not see it, will not overwrite it
  on update, and can install a duplicate alongside it.
- `@/…` is a **tsconfig path alias**, not a filesystem path. Without
  `"paths": { "@/*": ["./*"] }` in `tsconfig.json`, the demo's import fails to
  resolve no matter where the file sits.

## Setting up a project that can run it

From a directory *outside* this static site:

```bash
# 1. Next.js with TypeScript + Tailwind 4
npx create-next-app@latest my-app --typescript --tailwind --eslint --app
cd my-app

# 2. shadcn — writes a real components.json with aliases and tailwind config
npx shadcn@latest init

# 3. the keyframe the rainbow headline needs
npm i tw-animate-css
```

Then copy `ui/mac-book-neo-hero.tsx`, `ui/mac-book-neo-hero.css`, and
`demo.tsx` into the new project, keeping the `components/ui/` layout.

Vite instead of Next: `npm create vite@latest my-app -- --template react-ts`,
then follow Tailwind's Vite guide and run `npx shadcn@latest init`. The
component is client-only React with no Next-specific APIs, so it works in
either. Keep the `"use client"` directive for Next's App Router; it is inert
under Vite.

## Styles

Add the keyframe to your Tailwind entry (`app/globals.css` on Next,
`src/index.css` on Vite):

```css
@import "tailwindcss";
@import "tw-animate-css";

@keyframes fsh-shimmer {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
```

**That keyframe alone is not enough.** The component renders nothing but
`fsh-*` class names and ships no styles, so with only the keyframe you get a
column of unstyled divs — no pinned stage, no full-bleed frame, no card
positioning, and 941 images loading behind a loader that never covers
anything. `fsh-shimmer` only animates the gradient on `.fsh-title-rainbow`.

`ui/mac-book-neo-hero.css` supplies the rest. Import it in your layout:

```tsx
import "@/components/ui/mac-book-neo-hero.css";
```

or paste its contents into your Tailwind entry css below the keyframe.

## One deliberate change to the original

`.fsh-stage` is `position: sticky` with `margin-bottom: -100vh`, not fixed.
Fixed only works when the hero is the entire document — the moment anything
follows it, a fixed stage sits over that content forever. Sticky releases at
the end of the spacer, and the negative margin keeps the stage from adding its
own 100vh, so progress still reaches exactly 1.0 on the same pixel the stage
unpins. Behaviour during the hero is identical.

## Note on the demo's frames

`framePath` points at 941 JPEGs of Apple's MacBook marketing video on a
third-party GitHub repo. Fine for a local demo; swap in your own frames before
anything ships or is sold to a client.

A working restaurant conversion of this hero — same engine, own frames — lives
in [`../tapas/`](../tapas), ported to vanilla JS so it runs in this repo.
