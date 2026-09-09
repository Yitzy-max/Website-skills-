"use client";

import { useEffect, useState } from "react";
import { Drumstick, Layers, Sandwich, UtensilsCrossed } from "lucide-react";
import {
  FrameSequenceHero,
  type FrameSequenceStep,
} from "@/components/ui/mac-book-neo-hero";
import {
  FRAME_COUNT,
  POSTER,
  desktopFrame,
  mobileFrame,
  mobileFrameCount,
} from "@/lib/tapas-frames";

/**
 * One step per dish, and the ranges are not arbitrary: the sequence gives each
 * photo an equal quarter of the scroll, so a step boundary has to land exactly
 * where the sequence cuts to the next dish. Otherwise the card describes wings
 * while the screen is showing tacos.
 *
 * Keep this list in the same order as the photos fed to the frame script.
 */
const steps: FrameSequenceStep[] = [
  {
    from: 0.03,
    to: 0.25,
    color: "#c8871b",
    num: "01",
    total: "04",
    icon: <Drumstick size={15} strokeWidth={1.75} />,
    title: "Wings worth the napkins.",
    description:
      "Fried to order and tossed in hot honey or buffalo, with slaw on the side to cool it down.",
    label: "Off the fryer",
  },
  {
    from: 0.25,
    to: 0.5,
    color: "#6e7a4b",
    num: "02",
    total: "04",
    icon: <Layers size={15} strokeWidth={1.75} />,
    title: "Nachos built for a crowd.",
    description:
      "Slow-cooked beef, guacamole made that morning, pickled jalapeño and chipotle crema.",
    label: "Loaded",
  },
  {
    from: 0.5,
    to: 0.75,
    color: "#a8371f",
    num: "03",
    total: "04",
    icon: <UtensilsCrossed size={15} strokeWidth={1.75} />,
    title: "Three tacos to a board.",
    description:
      "Slow-cooked beef, pico and crema, with the chipotle dip on the side for dunking.",
    label: "Handhelds",
  },
  {
    from: 0.75,
    to: 1.01,
    color: "#8b4b2a",
    num: "04",
    total: "04",
    icon: <Sandwich size={15} strokeWidth={1.75} />,
    title: "Sliders, two to a plate.",
    description:
      "Griddled beef, tomato and lettuce on a brioche bun. Fries come with them.",
    label: "Off the grill",
  },
];

type Plan = {
  id: string;
  count: number;
  eager: number;
  path: (i: number) => string;
};

/**
 * Frames are the entire weight of this hero, so which set we load is the
 * single biggest performance decision on the page. Phones get half-width
 * frames at a third of the count; anyone on save-data or reduced-motion gets
 * one still image and no sequence at all.
 */
function resolvePlan(): Plan {
  const poster: Plan = { id: "poster", count: 1, eager: 1, path: () => POSTER };

  if (FRAME_COUNT === 0) return poster;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (reduced || conn?.saveData) return poster;

  if (window.matchMedia("(max-width: 768px)").matches) {
    const count = mobileFrameCount();
    return {
      id: "mobile",
      count,
      eager: Math.min(40, count),
      path: mobileFrame,
    };
  }

  return {
    id: "desktop",
    count: FRAME_COUNT,
    eager: Math.min(120, FRAME_COUNT),
    path: desktopFrame,
  };
}

export function TapasHero() {
  const [plan, setPlan] = useState<Plan | null>(null);

  // Resolved after mount so the server and the client never disagree about
  // which frame set the <img> starts on.
  useEffect(() => setPlan(resolvePlan()), []);

  if (!plan) return <div className="fsh-boot" aria-hidden />;

  return (
    <FrameSequenceHero
      key={plan.id}
      className="fsh-tapas"
      frameCount={plan.count}
      framePath={plan.path}
      eagerCount={plan.eager}
      scrollHeight="600vh"
      brand="Tapas"
      navLinks={[
        { label: "Menu", href: "#menu" },
        { label: "Drinks", href: "#drinks" },
        { label: "Hours", href: "#hours" },
        { label: "Find us", href: "#find-us" },
      ]}
      ctaLabel="Book a table"
      ctaHref="#book"
      title={
        <>
          <span className="fsh-title-dark">Tapas</span>{" "}
          <span className="fsh-title-rainbow">to share</span>
        </>
      }
      subtitle="Keep scrolling."
      steps={steps}
    />
  );
}
