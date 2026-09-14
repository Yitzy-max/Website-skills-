# Website brief — universal template

Copy this, fill the `>>` slots, paste it after `/website`. Works for any industry and any
kind of site. Everything below the slots is fixed machinery — don't edit it per job.

Slots you fill: 1-7. Blocks 8-11 stay the same every time.

If you only half-fill it, that's fine — `/website` will ask for whatever's missing in one
batch before it builds anything.

---

## 1. THE BUSINESS

```
Name:        >> 
Trade:       >> (barber / med spa / electrician / solar / dentist / gym / law / roofing / ...)
Location:    >> city, state — and whether they serve a radius or people come to them
What they do: >> in the owner's own words, not marketing words. 2-3 lines.
Who walks in: >> who the customer actually is. Age, what they're worried about, what they
                 searched to get here.
Why them:    >> the one honest reason someone picks them over the shop down the road.
```

## 2. SITE TYPE

Pick one. This decides the whole page structure, so don't skip it.

```
>> [ ] Single-page informational — who/what/proof/contact. Most local trades.
   [ ] Multi-page informational — separate service pages. Use when they have 4+ distinct
       services worth ranking for separately.
   [ ] Booking-led — the whole page funnels to a scheduler (Booksy, Calendly, Square).
   [ ] Lead-gen / quote — the form IS the product. Solar, roofing, legal, contractors.
   [ ] Menu / catalog — restaurants, salons with long service lists. Content-heavy.
   [ ] Portfolio-led — the work sells it. Photographers, designers, remodelers, landscapers.
   [ ] Landing page — one offer, one action, usually paired with ads.
```

Pages needed (if multi-page):
```
>> 
```

## 3. THE ONE ACTION

What does a visitor do if the site works? Pick ONE primary. Everything else is secondary.

```
Primary:   >> [ ] tap to call   [ ] book online   [ ] submit a form   [ ] request a quote
              [ ] get directions  [ ] order / buy   [ ] message on WhatsApp/IG   [ ] other: ___
Link/number: >> the actual destination
Secondary:   >> (optional — one only)
```

## 4. PROOF

What makes a stranger trust them in six seconds. Whatever's true:

```
>> Reviews / rating / count:
>> Years in business:
>> Licenses, certifications, insurance:
>> Recognizable clients, brands, or partners:
>> Before/afters, volume numbers, guarantees:
>> Awards, press, local reputation:
```

## 5. CONTENT STATUS

Be honest here — it controls whether the AI asks or invents.

```
Real content I have:      >> hours, phone, address, services, prices, bio, ...
Real content I DON'T have: >> 
Photos:                    >> [ ] client gave me real photos  [ ] none yet, use placeholders
                              [ ] I'm generating/sourcing them
```

**Rule: ask me for anything missing. Never invent business facts — no fake reviews, fake
credentials, fake prices, fake staff names.**

## 6. DIRECTION

Describe the **feeling**, not the layout. Layout is the AI's job; feeling is yours.

Good: *"Old-school, worn, confident. Leather and brass. A shop that's been here 14 years,
not a startup."*
Good: *"Clinical and calm. This is medical, not a spa day. Trust over luxury."*
Bad: *"Modern and clean with a hero section and three cards."* ← that's you designing badly.

Useful axes to pin down: warm↔cold · premium↔approachable · loud↔quiet · classic↔contemporary ·
clinical↔human · dense↔airy

```
Feeling:      >> 
Colors:       >> (or "you pick" — ui-ux-pro-max has 192 palettes)
Type:         >> (or "you pick")
Avoid:        >> anything that would feel wrong for this trade
Reference:    >> (optional) a site whose FEEL you want — not to copy, to calibrate
```

## 7. MOTION TIER

```
>> [ ] Tier 0 — None. Fast, static, clean. Sometimes the right call (medical, legal, urgent-need
          trades where people are in a hurry).
   [ ] Tier 1 — Ships on most sites. Lenis momentum scroll, one scrub-linked hero moment,
          staggered reveals, parallax on section images, magnetic primary button.
          Cheap, fast, reads as premium.
   [ ] Tier 2 — The demo tier. Everything in 1, plus pinned scroll sections, page transitions
          (barba-js), a WebGL or canvas hero. Use on demos you sell with and on
          portfolio/brand-led sites.
   [ ] Tier 3 — Full scroll-driven build. Frame sequences, shader transitions, heavy
          choreography. Only when it's the actual product.
```

Specific moments you want (optional):
```
>> 
```

**Motion is scroll-LINKED, not entrance-triggered.** Use `gsap-scrolltrigger` with
`scrub: true` so scroll position drives the animation directly and it rewinds when you scroll
back. Entrance fade-ins are the cheap-feeling default — don't ship them as the main event.

---

# FIXED BLOCKS — same every job

## 8. CONSTRAINTS

- **Mobile first.** Most visitors are on a phone. Cut the motion budget to near-zero on
  phones: Lenis off, no pinning, reveals only.
- **Progressive enhancement, no exceptions.** Every motion feature degrades to a fully
  readable static page if it fails to load. All content visible without JS.
- The primary action is reachable without scrolling on mobile.
- Real, tappable phone number. Real, linked address. Correct hours.
- Fast on mobile data. No 4MB heroes. No framework for a five-section site.
- Accessible: real contrast, focus states, alt text, `prefers-reduced-motion` respected.
- Placeholder image slots that upgrade the moment a real photo drops in.
- No stock photo that obviously screams stock. No competitor's photography. No unlicensed images.

## 9. BANNED

Centered hero over a purple-blue gradient. Three feature cards in a row. Inter as the display
face. "Elevate your experience." "Your journey starts here." "We're passionate about…"
Glassmorphism by default. Emoji as section icons. A testimonial slider nobody will click.
Generic AI layout of any kind — if it looks like every other AI-built site, it failed.

## 10. PROCESS — follow in order, stop where told

1. **Gap check.** List everything missing from blocks 1-7 and ask me in ONE batch. Don't
   build on guesses.
2. **Direction.** `design-taste-frontend` commits to a direction. Palette, type pairing, and
   UI style from `ui-ux-pro-max`. Tokens locked with `design-system` / `theme-factory`.
   **→ SHOW ME the direction + tokens. STOP. Wait for my yes.**
3. **Build.** `ui-styling` for styling. `21st-ui` + the shadcn / Magic UI MCP servers for real
   components — don't hand-roll what already exists. `writing-guidelines` for every line the
   visitor reads: plain, human, the way the owner would say it. No salesy copy.
4. **Motion.** `web3d-integration-patterns` decides what earns its place at the chosen tier,
   then `gsap-scrolltrigger` / `motion-framer` / `locomotive-scroll` / `threejs-webgl`.
5. **Critique.** `/impeccable critique` and `/impeccable audit`. Fix what they find. If this is
   a redesign, run `redesign-existing-projects` first.
6. **Verify.** `webapp-testing` in a real browser at phone width AND desktop. Confirm: primary
   action works, form submits, phone taps, address links, nothing overflows, page is readable
   with JS disabled. `vercel-optimize` for load speed.
7. **Report** what you'd improve with more budget, and anything you need from me or the client.

## 11. DEMO MODE

Add this line when you're pre-building a spec demo to sell with, rather than a real client job:

```
DEMO MODE: invent a plausible business for this trade. Realistic name, services, and prices
for the area. Mark every invented fact in a DEMO-CONTENT.md so it's easy to swap for real
content after they say yes. Push the design harder than a paid job — this is a sales asset,
its job is to make someone say "I want that."
```
