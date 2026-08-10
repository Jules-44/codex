# Chronicle of War — Implementation Plan

> **Working title**: *Chronicle of War*
> **Alternative names considered**: *Warfare Chronicles*, *The Conflict Codex*, *War Annals*, *The War Record*, *Arms & Ages*
> If you'd like to change the name before launch, all references live in one config file.

A comprehensive, beautifully designed static website documenting all human warfare from 1950 to the present day. Built with Nuxt.js 3 and deployed as a fully static site on Vercel.

---

## Decisions Summary

| Decision | Choice |
|---|---|
| Framework | Nuxt.js 3 (Vue 3) — latest stable |
| Node.js | v24 (minimum v22) |
| Rendering | Static generation (`nuxt generate`) |
| Styling | Vanilla CSS (with CSS variables for dual theming) |
| Data layer | Curated JSON files (repo-local, agent-friendly) |
| Search | **Deferred** — not in Phase 1 |
| Hosting | Vercel (free subdomain for now) |
| Theme | Two POC options built: Dark documentary vs. Clean encyclopedic — user picks |
| Timeline | Color-coded by region, filterable by conflict type |
| World map | **Deferred to Phase 1.5** |
| War pages | **Modal / slide-over panel** — user never leaves the timeline |
| Sub-events | Historically accurate terminology (battles, operations, sieges, campaigns) |

---

## Conflict Scope

All of the following are in scope:
- Interstate wars
- Civil wars
- Insurgencies & guerrilla conflicts
- Colonial independence wars
- Proxy wars
- Genocides & mass atrocities with military involvement
- Coups with significant armed conflict
- UN peacekeeping operations that became active conflicts

---

## Data Model

Each war is stored as a JSON file at `content/wars/<war-id>.json`:

```json
{
  "id": "korean-war",
  "name": "Korean War",
  "alternate_names": ["Forgotten War", "Korean Conflict"],
  "type": "interstate",
  "region": "asia-pacific",
  "start_date": "1950-06-25",
  "end_date": "1953-07-27",
  "status": "ended",
  "countries": {
    "side_a": ["South Korea", "United States", "United Kingdom"],
    "side_b": ["North Korea", "China", "Soviet Union"],
    "neutral": []
  },
  "outcome": "Armistice — Korean Peninsula divided at 38th parallel",
  "casualties": {
    "total_estimate": "3,000,000",
    "military": "1,200,000",
    "civilian": "1,800,000"
  },
  "short_description": "A war between North and South Korea, in which a United Nations force led by the United States fought for the South, and China fought for the North.",
  "tags": ["cold-war", "un-intervention", "armistice"],
  "sub_events": [
    {
      "id": "battle-of-pusan-perimeter",
      "name": "Battle of Pusan Perimeter",
      "type": "battle",
      "date": "1950-08-04",
      "end_date": "1950-09-18",
      "location": "Pusan, South Korea",
      "short_description": "UN forces held a defensive perimeter around the port of Pusan."
    }
  ]
}
```

**Regions** (for color-coding):

| Region | Color |
|---|---|
| Middle East | Amber |
| Europe | Steel Blue |
| Asia-Pacific | Jade |
| Africa | Gold |
| Americas | Crimson |
| Central Asia | Violet |
| Multi-Regional | Silver |

---

## Site Structure

```
/                            -> Homepage: full timeline + region/type filters
  War card (click)           -> Opens slide-over modal panel (no page change)
        Sub-events tab       -> List of battles/operations/sieges within that war
/about                       -> About the project
```

War detail is presented in a modal/slide-over panel that slides in from the right while the timeline remains visible and dimmed in the background.

---

## Phase Plan

### Phase 1 — Foundation (Build Now)

**Goal**: Stunning, navigable site with real content and two theme POCs.

1. **Project setup** — Nuxt.js 3 (latest), Vue 3, Node 24, `nuxt generate` static output, configured for Vercel
2. **Design system** — CSS custom properties for both themes, typography: Cinzel Decorative (headings) + Inter (body), region color tokens, animation tokens
3. **Theme POC A — Dark Documentary** — Background: #0d0d0d/#111318, Accent: deep crimson #8b1a1a + aged gold #c9a84c. Feel: war museum, documentary series
4. **Theme POC B — Clean Encyclopedic** — Background: #f8f6f1 (aged paper), Accent: navy #1a2744 + burgundy #6b1f1f. Feel: premium atlas, scholarly
5. **Timeline component** — Vertical scroll, grouped by decade (2020s to 1950s), conflict cards with region color + type badge, filter bar by region and conflict type, scroll-in animations
6. **War detail modal** — Slide-over from right, timeline dimmed behind, sections: Overview / Countries / Casualties / Sub-Events, keyboard dismissible
7. **Seed data** — 27 major wars

---

### Phase 2 — Minor Wars

Expand to ~100+ conflicts: Latin American guerrilla wars, India-Pakistan conflicts, African civil wars (Sierra Leone, Liberia, Mozambique, Angola, DRC), Central Asian post-Soviet conflicts.

---

### Phase 1.5 — World Map (deferred)

SVG world map with time scrubber — drag through years and watch conflicts light up. Click a conflict on the map to open its modal.

---

### Phase 3 — Obscure Wars

True global exhaustiveness — every documented armed conflict since 1950: Football War, Sand War, Cod Wars, smaller Pacific/Caribbean conflicts.

---

### Phase 3.5 — Search (deferred)

Fuse.js real-time search bar filtering the timeline as the user types.

---

### Phase 4 — Agent Enrichment

AI agent enriches each war.json with: full narrative, key figures, political context, aftermath, completed sub-events, source citations.

---

## Seeded Wars — Phase 1

| War | Region | Years | Type |
|---|---|---|---|
| Korean War | Asia-Pacific | 1950-1953 | Interstate |
| First Indochina War | Asia-Pacific | 1946-1954 | Colonial independence |
| Algerian War of Independence | Africa | 1954-1962 | Colonial independence |
| Vietnam War | Asia-Pacific | 1955-1975 | Interstate / Civil |
| Six-Day War | Middle East | 1967 | Interstate |
| Yom Kippur War | Middle East | 1973 | Interstate |
| Soviet-Afghan War | Central Asia | 1979-1989 | Interstate |
| Iran-Iraq War | Middle East | 1980-1988 | Interstate |
| Falklands War | Americas | 1982 | Interstate |
| Gulf War | Middle East | 1990-1991 | Interstate |
| Rwandan Genocide | Africa | 1994 | Genocide / Civil |
| First Chechen War | Europe | 1994-1996 | Civil |
| Bosnian War | Europe | 1992-1995 | Civil |
| Kosovo War | Europe | 1998-1999 | Civil / Interstate |
| Second Chechen War | Europe | 1999-2009 | Civil |
| War in Afghanistan (US-led) | Central Asia | 2001-2021 | Interstate |
| Iraq War | Middle East | 2003-2011 | Interstate |
| Darfur Conflict | Africa | 2003-present | Civil / Genocide |
| 2006 Lebanon War | Middle East | 2006 | Interstate |
| Libyan Civil War | Africa | 2011-present | Civil |
| Syrian Civil War | Middle East | 2011-present | Civil / Proxy |
| War in Donbas | Europe | 2014-2022 | Civil / Interstate |
| Yemeni Civil War | Middle East | 2014-present | Civil / Proxy |
| ISIS/ISIL Conflict | Multi-Regional | 2013-2019 | Insurgency |
| Russia-Ukraine War | Europe | 2022-present | Interstate |
| Tigray War (Ethiopia) | Africa | 2020-2022 | Civil |
| Sudan Civil War | Africa | 2023-present | Civil |

---

## Tech Stack

```
nuxt@latest           -> Nuxt 3 (latest stable)
vue@latest            -> Vue 3 (latest stable)
node                  -> v24 (minimum v22)
fuse.js               -> Deferred (Phase 3.5)
```

---

## Verification Plan

After Phase 1 build:
- nuxt generate completes without errors
- All 27 seeded war cards render on the timeline
- Region color-coding is correct
- Conflict type filter works
- Clicking a war card opens the slide-over modal
- Modal shows correct war data (name, dates, countries, casualties, sub-events)
- Modal dismisses on Esc key and backdrop click
- Both theme POCs are accessible (toggle in header)
- Site is responsive on mobile, tablet, and desktop
- Deploys successfully to Vercel
