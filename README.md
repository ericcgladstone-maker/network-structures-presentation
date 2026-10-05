# Contemporary network structures in organizations

Eric Gladstone · research talk · October 2026.

An illustrated walkthrough of organizational network analysis. An animated deck sits on the left and the text on the right, one passage at a time. It runs about 65 minutes at 1×, with reading speeds up to 5×. The talk moves from what a network is, through what flows along ties, measurement, formal and working structure, cohesion, centrality, knowledge, vulnerability, overload, the content layer, access, dynamics, reorganization, interventions, evidence and privacy, to human–AI networks.

Every result comes from **Northline Systems**, a fictional company. Its people, relationships, messages and text features are synthetic, generated deterministically from a fixed seed. Nothing describes a real employer, employee or message.

- **Live:** https://networkstructures.eric-c-gladstone.workers.dev
- **Also at:** https://graystoneindustries.co/talks/ (embedded)

## Use

Press play, or step through the talk one passage at a time with ‹ › (or the arrow keys); the slide moves with the text, and past a page's last passage ‹ › turn the page. Click the slide to step through its states, and use the reading-speed menu to go faster. Expand fills the screen; Esc exits. `?embed=1` hides the page header and the text drawers so the player can sit inside a frame.

Run locally with any static server, for example `python3 -m http.server 8970 --directory public`.

## Files

`public/` is the whole site:
- `index.html`, the player (`player.js`, `player.css`), the timed text (`timeline.js`) and the reference list (`sources.js`);
- the deck in `deck/`, with its precomputed synthetic data in `deck/data/`;
- self-hosted Geist fonts.

It makes no third-party requests.

`sync.sh` copies the site from the working project into `public/`. Deploy with `npx wrangler deploy`.
