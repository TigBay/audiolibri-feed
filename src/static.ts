import fs from "fs/promises"
import path from "path"
import { buildFeed } from "./feed.js"
import { initCache } from "./cache.js"
import { SITE_URL } from "./config.js"

type FeedEntry = { title: string; path: string; note: string; keepMissing?: boolean }

// Programmi: aggiornati di continuo (le ultime puntate in onda)
const programmi: FeedEntry[] = [
  {
    title: "Ad alta voce",
    path: "programmi/adaltavoce",
    note: "Il programma di Radio3: tutte le puntate dal 20 ottobre 2026 in poi",
    keepMissing: true
  }
]

// Audiolibri completi dall'archivio di Ad alta voce
const audiolibri: FeedEntry[] = [
  {
    title: "Mansfield Park – Jane Austen",
    path: "audiolibri/mansfieldpark",
    note: "Il libro letto in Ad alta voce prima di Miss Brodie"
  }
]

const allFeeds = [...programmi, ...audiolibri]
const stato: { path: string; ok: boolean; errore?: string }[] = []

await initCache()
await fs.mkdir("out/rss", { recursive: true })

for (const feed of allFeeds) {
  try {
    console.log(`Generating ${feed.title}: ${feed.path}`)
    const xml = await buildFeed(feed.path, { keepMissing: feed.keepMissing })
    const file = path.join("out/rss", `${feed.path}.xml`)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, xml)
    console.log(`Generated ${file}`)
    stato.push({ path: feed.path, ok: true })
  } catch (err) {
    stato.push({ path: feed.path, ok: false, errore: String((err as Error)?.stack ?? err).slice(0, 500) })
    console.error(`Skipped ${feed.title} (${feed.path})`)
    console.error(err)
  }
}

const feedUrl = (feed: FeedEntry) => `${SITE_URL}/rss/${feed.path}.xml`

const htmlRows = (feeds: FeedEntry[]) =>
  feeds
    .map(
      f => `<tr>
  <td>${f.title}<br><small>${f.note}</small></td>
  <td><a href="${feedUrl(f)}">${feedUrl(f)}</a></td>
</tr>`
    )
    .join("\n")

await fs.writeFile("out/stato.json", JSON.stringify({ aggiornato: new Date().toISOString(), feed: stato }, null, 2))

await fs.writeFile(
  "out/index.html",
  `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Audiolibri feed</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 760px; margin: 2rem auto; padding: 0 16px; line-height: 1.5; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border-bottom: 1px solid #8884; padding: .5rem; text-align: left; vertical-align: top; }
  a { word-break: break-all; }
  small { opacity: .7; }
</style>
</head>
<body>
<h1>Audiolibri feed</h1>
<p>Ad alta voce e audiolibri di RaiPlay Sound per qualsiasi app di podcast.</p>
<h2>Programmi</h2>
<table>${htmlRows(programmi)}</table>
<h2>Audiolibri</h2>
<table>${htmlRows(audiolibri)}</table>
</body>
</html>
`
)
