import fs from "fs/promises"
import path from "path"
import { buildFeed } from "./feed.js"
import { initCache } from "./cache.js"
import { REPO_URL, SITE_URL } from "./config.js"

type FeedEntry = { title: string; path: string; note: string }

// Programmi: aggiornati di continuo (le ultime puntate in onda)
const programmi: FeedEntry[] = [
  {
    title: "Ad alta voce",
    path: "programmi/adaltavoce",
    note: "Il programma di Radio3: il romanzo letto in questo periodo"
  }
]

// Audiolibri completi dall'archivio di Ad alta voce
const audiolibri: FeedEntry[] = [
  {
    title: "Caro Michele – Natalia Ginzburg",
    path: "audiolibri/caromichele",
    note: "Romanzo in lettere, lingua vicina al parlato (lettura di Anna Bonaiuto)"
  },
  {
    title: "Le voci della sera – Natalia Ginzburg",
    path: "audiolibri/levocidellasera",
    note: "Un paese, una famiglia, le sue voci"
  },
  {
    title: "Le piccole virtù – Natalia Ginzburg",
    path: "audiolibri/lepiccolevirtu",
    note: "Brevi saggi autobiografici"
  },
  {
    title: "Valentino – Natalia Ginzburg",
    path: "audiolibri/valentino",
    note: "Racconto lungo, solo 5 puntate"
  },
  {
    title: "Racconti di Italo Calvino",
    path: "audiolibri/raccontidiitalocalvino",
    note: "Racconti brevi, uno per sera"
  },
  {
    title: "Favole al telefono – Gianni Rodari",
    path: "audiolibri/favolealtelefono",
    note: "Favole brevissime, lingua semplice"
  }
]

const allFeeds = [...programmi, ...audiolibri]

await initCache()
await fs.mkdir("out/rss", { recursive: true })

for (const feed of allFeeds) {
  try {
    console.log(`Generating ${feed.title}: ${feed.path}`)
    const xml = await buildFeed(feed.path)
    const file = path.join("out/rss", `${feed.path}.xml`)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, xml)
    console.log(`Generated ${file}`)
  } catch (err) {
    console.error(`Skipped ${feed.title} (${feed.path})`)
    console.error(err)
  }
}

const feedUrl = (feed: FeedEntry) => `${SITE_URL}/rss/${feed.path}.xml`

const markdownRows = (feeds: FeedEntry[]) =>
  feeds.map(f => `| ${f.title} | ${f.note} | ${feedUrl(f)} |`).join("\n")

const htmlRows = (feeds: FeedEntry[]) =>
  feeds
    .map(
      f => `<tr>
  <td>${f.title}<br><small>${f.note}</small></td>
  <td><a href="${feedUrl(f)}">${feedUrl(f)}</a></td>
</tr>`
    )
    .join("\n")

const readme = `# Audiolibri feed

Feed RSS per ascoltare **Ad alta voce** (Rai Radio 3) e alcuni audiolibri di RaiPlay Sound in qualsiasi app di podcast (AntennaPod, Pocket Casts, Podcast Addict, Apple Podcasts…), con tema scuro e sleep timer.

Scelti per ascoltare prima di dormire e per allenare l'italiano di tutti i giorni.

## Programmi

| Titolo | Note | Feed RSS |
|--------|------|----------|
${markdownRows(programmi)}

## Audiolibri

| Titolo | Note | Feed RSS |
|--------|------|----------|
${markdownRows(audiolibri)}

## Come si usa

Copia l'URL del feed e incollalo nella tua app di podcast alla voce "Aggiungi feed RSS".

## Aggiungere un audiolibro

Apri la pagina del libro su raiplaysound.it, ad esempio \`https://www.raiplaysound.it/audiolibri/caromichele\`, e aggiungi in [src/static.ts](${REPO_URL}/blob/main/src/static.ts):

\`\`\`ts
{
  title: "Caro Michele – Natalia Ginzburg",
  path: "audiolibri/caromichele",
  note: "Breve descrizione"
}
\`\`\`

La tabella qui sopra si aggiorna da sola alla prossima esecuzione della Action (ogni ora).

## Crediti

Basato su [giuliomagnifico/raiplaysound-feed](https://github.com/giuliomagnifico/raiplaysound-feed), a sua volta derivato da [frammenti/raiplaysoundrss](https://github.com/frammenti/raiplaysoundrss). Licenza GPL-3.0. I file audio restano sui server Rai: qui si genera solo l'indice delle puntate.
`

await fs.writeFile("README.md", readme)

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
