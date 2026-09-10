# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no build step — confirmed by the user for the Tapas surface
(offered Next.js + shadcn + Tailwind + TypeScript, declined). Sites must open by
double-clicking `index.html` and deploy by uploading a folder. Motion libraries
load from CDN with a static fallback; nothing may hard-require npm or a bundler.

## Users

Two distinct audiences, and the repo serves both:

1. **The prospect (site owner).** A small local business owner in Ocean County, NJ
   — 10K–100K/month revenue, simple offering, few or no products to configure.
   They are shown a finished demo of *their own* business before they have paid.
   Their job in that moment: decide in under a minute whether this looks better
   than what they have. They are not evaluating code.
2. **The restaurant's diner** (for the Tapas surface). Books by phone, drives to
   Route 9, mostly evening/weekend, frequently on a phone. Their job: confirm this
   place is kosher, see what the food looks like, get the hours, and call.

## Product Purpose

The repo is a working portfolio of pre-built client websites. Each surface is a
speculative demo built from a real local business's public information, shown to
that owner as a finished product. Success is the owner saying yes; the site is
then finished and handed over. Price point is ~$800, so build cost per site must
stay low and nothing may require ongoing infrastructure.

## Positioning

The demo is of *their* business, not a template with their name dropped in: real
address, real hours, real menu items, real review language. A competitor sending a
generic template cannot truthfully claim the same.

## Operating Context

- Sites are shown on a laptop or phone, often in the owner's own business, on
  whatever connection is there. Assume slow networks and no dev server.
- Photography almost always arrives *after* the demo is shown. Every image slot
  must degrade to something intentional-looking, and upgrade by dropping in a file
  with no code change. This is a hard constraint, not a convenience.
- Reservation/ordering systems are usually the owner's existing phone line.

## Capabilities and Constraints

- No backend, no database, no build step, no npm install to view.
- Forms cannot submit anywhere; the primary action is a `tel:` call link.
- The build environment's egress proxy blocks Google Maps, Yelp, Grubhub,
  Instagram, and most restaurant directories, so first-party photography and
  live menu scraping are unavailable here. Web search is available.

## Brand Commitments

### Tapas (active client surface — `tapas/`)

Confirmed facts, all from public listings. Do not embellish these:

- Name: **Tapas**. Address: 1580 Lakewood Rd (Route 9), Toms River, NJ 08755.
- Phone: **(732) 660-1700**. Hours: **daily 5:00–10:00pm**.
- **Glatt kosher meat**, under **KCL** (Kehillos Chareidim of Lakewood & Central
  Jersey) supervision. **BYOB.**
- Concept: **small plates / mostly appetizers** — this is what reviewers single
  out and it is the restaurant's actual differentiator, not a styling choice.
- Google rating **4.8**.
- Real menu items on record: short rib cigars (shredded beef short rib, crispy
  wrapper, roasted garlic aioli); tapas flatbread (BBQ brisket, in-house crispy
  flatbread, arugula, chipotle aioli); BBQ brisket nachos; mango habanero chicken
  poppers; honey buffalo poppers; BBQ brisket tacos; cornflake chicken fingers;
  grilled steak skewer marinated in house sauce with fresh salad; mango chicken;
  Tapas burger.
- User decision: the kosher identity is **foregrounded**, treated as a mark of
  quality rather than a footnote disclaimer.

### Il Giardinello Di Bacoli (earlier client surface — repo root)

Separate surface, separate visual world. Not a system to inherit from.

## Evidence on Hand

- Menu items, hours, phone, address, supervision, and rating above: sourced from
  public aggregator listings via web search. Reliable enough to show the owner,
  and to be confirmed by them before launch.
- Review language on record, usable as quoted sentiment: reviewers describe the
  appetizer-forward concept as the draw, praise generous portions and the service
  (a server named Gio is named by a reviewer).
- **No photography.** The user is supplying the restaurant's own Google photos.
  Until they land, every slot is a placeholder. Do not fabricate photographs of
  this restaurant's actual food or room and present them as real, and do not
  invent prices, awards, chef biographies, or press.
- No prices are on record. Do not print prices.

## Product Principles

1. **Real facts or no facts.** Every claim on a client surface traces to public
   record or to the owner. Empty beats invented — an owner catches a made-up
   detail instantly, and it costs the sale.
2. **Photography-shaped holes.** Design so the real photo is the payoff, and so
   the page never looks broken while the hole is still a hole.
3. **The phone is the conversion.** Every surface ends at a call, and the number
   is reachable from any scroll position on mobile.
4. **Zero operational tail.** Nothing that requires the owner to maintain,
   renew, or log into anything after handoff.
5. **Each client gets its own world.** No shared theme across client surfaces;
   two demos that look related undercut the pitch of both.

## Accessibility & Inclusion

Diners skew across a wide age range and browse on phones in low light. Real
contrast minimums (4.5:1 body), visible keyboard focus, working reduced-motion
path, and legible tap targets are requirements, not polish.
