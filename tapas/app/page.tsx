import { TapasHero } from "@/components/tapas-hero";

const menu = [
  {
    group: "Off the fryer",
    items: [
      ["Hot honey wings", "Fried to order, slaw on the side"],
      ["Buffalo wings", "Blue cheese, celery, plenty of napkins"],
    ],
  },
  {
    group: "Loaded",
    items: [
      ["Beef nachos", "Slow-cooked beef, guac, chipotle crema"],
      ["Green nachos", "Same pile, no beef, extra jalapeño"],
    ],
  },
  {
    group: "Handhelds",
    items: [
      ["Beef tacos", "Three to a board, pico and crema"],
      ["Sliders", "Two to a plate, tomato, lettuce, fries"],
    ],
  },
];

export default function Home() {
  return (
    <>
      <TapasHero />

      <main className="site-body">
        <section className="band" id="menu">
          <p className="eyebrow">Menu</p>
          <h2 className="band-title">
            Order a few things. Then order a few more.
          </h2>
          <div className="menu-grid">
            {menu.map((g) => (
              <div key={g.group} className="menu-group">
                <h3 className="menu-group-title">{g.group}</h3>
                <ul className="menu-list">
                  {g.items.map(([name, note]) => (
                    <li key={name}>
                      <span className="menu-item">{name}</span>
                      <span className="menu-note">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="band band-split" id="hours">
          <div>
            <p className="eyebrow">Hours</p>
            <p className="band-lede">
              Kitchen runs late Thursday through Saturday. The bar runs later.
            </p>
            <dl className="facts">
              <div>
                <dt>Mon – Wed</dt>
                <dd>4pm – 11pm</dd>
              </div>
              <div>
                <dt>Thu – Sat</dt>
                <dd>4pm – 1am</dd>
              </div>
              <div>
                <dt>Sunday</dt>
                <dd>2pm – 10pm</dd>
              </div>
            </dl>
          </div>
          <div id="find-us">
            <p className="eyebrow">Find us</p>
            <p className="band-lede">
              Walk-ins get the bar. Tables are worth booking on a weekend.
            </p>
            <p className="address">
              128 Main Street
              <br />
              Open kitchen, twelve seats at the pass
            </p>
            <a className="book" href="#book">
              Book a table
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
