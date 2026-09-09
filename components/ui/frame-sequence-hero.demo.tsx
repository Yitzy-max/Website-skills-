import { FrameSequenceHero, type FrameSequenceStep } from "@/components/ui/frame-sequence-hero";

const FRAME_COUNT = 941;

// Swap this for the tapas sequence once the frames are rendered — see
// tapas/frames/README.md. Until then it runs on the reference sequence.
const framePath = (i: number) =>
  `https://raw.githubusercontent.com/duthiljean/hero-apple/main/frames/frame_${String(i).padStart(4, "0")}.jpg`;

const steps: FrameSequenceStep[] = [
  { from: 0.02, to: 0.28, color: "#B08948", num: "01", total: "04", icon: "✦",
    title: "Gambas al ajillo.",
    description: "Head-on shrimp, garlic, a little chili. Still bubbling in the oil when it reaches the table.",
    label: "Dish one" },
  { from: 0.28, to: 0.55, color: "#A8543C", num: "02", total: "04", icon: "◐",
    title: "Patatas bravas.",
    description: "Crisp outside, soft in the middle, brava sauce with just enough heat to notice.",
    label: "Dish two" },
  { from: 0.55, to: 0.82, color: "#6F7A4C", num: "03", total: "04", icon: "▣",
    title: "Pan con tomate.",
    description: "Grilled bread, ripe tomato rubbed in by hand, good oil, flaked salt. Nothing else.",
    label: "Dish three" },
  { from: 0.82, to: 1.01, color: "#7A3B4A", num: "04", total: "04", icon: "⌁",
    title: "Small plates, long nights.",
    description: "Come with four people, order eight things, stay past closing. That's how it's meant to go.",
    label: "The room" },
];

export default function Demo() {
  return (
    <FrameSequenceHero
      frameCount={FRAME_COUNT}
      framePath={framePath}
      eagerCount={140}
      scrollHeight="600vh"
      brand={
        <>
          <span className="fsh-brand-dot" />
          Tapas
        </>
      }
      navLinks={[
        { label: "Menu", href: "#menu" },
        { label: "The room", href: "#room" },
        { label: "Reviews", href: "#reviews" },
        { label: "Visit", href: "#visit" },
      ]}
      ctaLabel="Book a table"
      ctaHref="#visit"
      title={
        <>
          <span className="fsh-title-line">
            There's Always Something <em className="fsh-title-accent">Good</em>
          </span>
          <span className="fsh-title-line">in Tapas</span>
        </>
      }
      subtitle="Scroll to explore"
      asideStep={0}
      aside={
        <>
          <span className="fsh-review-stars" aria-label="Five out of five stars">★★★★★</span>
          <p className="fsh-review-quote">
            "The food, the atmosphere and the service were incredible. We came in for one
            drink and stayed three hours."
          </p>
          <p className="fsh-review-attr">Google review · placeholder</p>
        </>
      }
      steps={steps}
    />
  );
}
