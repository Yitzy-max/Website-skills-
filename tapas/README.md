# There's Always Something Good in Tapas

A restaurant landing page whose hero is the MacBook Neo scroll animation with
the sequence swapped for food.

```
tapas/
  index.html      hero + the normal sections it hands off to
  css/hero.css    the hero, and only the hero (fsh-* classes)
  css/site.css    everything after the hero
  js/hero.js      the scrub engine — a 1:1 port of FrameSequenceHero
  frames/         the image sequence + how to produce it
```

## The hero

`js/hero.js` is the original component's logic, unchanged: the same
`scrollY / (spacerHeight - innerHeight)` progress, the same
`display += (target - display) * 0.28` easing with a 0.08 snap, the same eager
preload of 140 frames, the same four step windows (0.02, 0.28, 0.55, 0.82), the
same active/previous card behaviour and tick fill. It was ported out of React
because this project is plain HTML/CSS/JS; a React build of the same component
lives in `components/ui/frame-sequence-hero.tsx`.

One deliberate change: the stage sticks inside the spacer instead of being
fixed, so the hero lets go of the page the moment progress reaches 1 and the
sections below scroll normally. The progress math is untouched.

## Editing the content

- **Dishes** — the `steps` array at the top of `js/hero.js`. Titles, copy, the
  small accent colour, and the progress window each one owns.
- **Review** — the `.fsh-review` block in `index.html`. Currently a placeholder;
  swap in a real Google review.
- **Headline / nav / CTA** — `index.html`, inside `.fsh-root`.
- **Frames** — see `frames/README.md`.

Everything below `<!-- END HERO -->` is a normal page and shares nothing with
the animation.
