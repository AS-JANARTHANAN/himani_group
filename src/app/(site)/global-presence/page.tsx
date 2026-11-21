import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Icon from "@/components/Icon";
import { CtaBand, E, Heading } from "@/components/site/Blocks";
import PresenceExplorer from "@/components/site/PresenceExplorer";
import Sections from "@/components/site/Sections";
import { getContent, getLocations } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("presence");
  return pageMeta(c.seo, "/global-presence", { image: c.hero?.image });
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function Presence() {
  const [c, locations] = await Promise.all([getContent("presence"), getLocations()]);
  const { hero, reach } = c;
  const labels: Record<string, string> = { hq: c.locations.hqLabel, office: c.locations.officeLabel, market: c.locations.marketLabel };
  const countries = new Set(locations.map((l) => l.country)).size;
  const routes = Math.max(0, locations.length - 1);
  const groups = (["hq", "office", "market"] as const).map((k) => ({ k, items: locations.filter((l) => l.kind === k) })).filter((g) => g.items.length);

  const blocks = {
    hero: (
      <section className="presence-hero">
        <div className="wrap">
          <div className="presence-head">
            <div className="tag" {...E("hero.eyebrow")}>{hero.eyebrow}</div>
            <Heading as="h1" className="h1" title={hero.title} accent={hero.titleAccent} k="hero." />
            {hero.text ? <p className="lede reveal" {...E("hero.text")}>{hero.text}</p> : null}
          </div>
          <PresenceExplorer
            locations={locations.map(({ id, city, country, kind, lat, lng, description }) => ({ id, city, country, kind, lat, lng, description }))}
            stats={[
              { value: pad(countries), label: hero.statCountries },
              { value: pad(locations.length), label: hero.statLocations },
              { value: pad(routes), label: hero.statRoutes },
            ]}
            hint={hero.hint}
            labels={labels}
          />
        </div>
      </section>
    ),
    reach: (
      <section className="section">
        <div className="wrap">
          <div className="split" style={{ alignItems: "end" }}>
            <div className="reveal">
              <div className="eyebrow" {...E("reach.eyebrow")}>{reach.eyebrow}</div>
              <h2 className="h2" style={{ marginBottom: 0 }} {...E("reach.title")}>{reach.title}</h2>
            </div>
            <p className="lede reveal d1" style={{ margin: 0 }} {...E("reach.text")}>{reach.text}</p>
          </div>
          {reach.points?.length ? (
            <div className="reach-grid">
              {reach.points.map((p: any, i: number) => (
                <div className={`reach-item reveal d${i % 4}`} key={i} {...E(`reach.points.${i}`)}>
                  <span className="ic">{p.icon ? <Icon name={p.icon} size={26} /> : pad(i + 1)}</span>
                  <h3 className="h3">{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    ),
    locations: locations.length ? (
      <section className="section on-dark">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow" {...E("locations.eyebrow")}>{c.locations.eyebrow}</div>
              <h2 className="h2" {...E("locations.title")}>{c.locations.title}</h2>
            </div>
          </div>
          <div className="directory">
            {groups.map((g) => (
              <div className="dir-group reveal" key={g.k}>
                <div className="dir-label" {...E(`locations.${g.k}Label`)}>
                  <span className={`dot ${g.k}`} /> {labels[g.k]}
                </div>
                <div className="dir-items">
                  {g.items.map((l) => (
                    <div className={`dir-card ${g.k}`} key={l.id} data-edit={`location:${l.id}`}>
                      <div className="dir-city">{l.city}</div>
                      <div className="dir-country">{l.country}</div>
                      {l.description ? <p>{l.description}</p> : null}
                      <div className="dir-coord">
                        {Math.abs(l.lat).toFixed(2)}° {l.lat >= 0 ? "N" : "S"} · {Math.abs(l.lng).toFixed(2)}° {l.lng >= 0 ? "E" : "W"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    cta: <CtaBand cta={c.cta} />,
  };

  return <Sections page="presence" data={c} blocks={blocks} />;
}
