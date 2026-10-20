# Audiolibri feed

I miei feed RSS per ascoltare **Ad alta voce** (Rai Radio 3) e alcuni audiolibri di RaiPlay Sound in una normale app di podcast, invece che nell'app RaiPlay Sound.

Elenco aggiornato dei feed: <https://tigbay.github.io/audiolibri-feed/>

## Feed

| Titolo | Note | Feed RSS |
|--------|------|----------|
| Ad alta voce | Il programma in onda. Le puntate vecchie restano: il feed cresce ogni giorno dal 20 ottobre 2026 | https://tigbay.github.io/audiolibri-feed/rss/programmi/adaltavoce.xml |
| Caro Michele – Natalia Ginzburg | Romanzo in lettere, lingua vicina al parlato | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/caromichele.xml |
| Le voci della sera – Natalia Ginzburg | Un paese, una famiglia, le sue voci | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/levocidellasera.xml |
| Le piccole virtù – Natalia Ginzburg | Brevi saggi autobiografici | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/lepiccolevirtu.xml |
| Valentino – Natalia Ginzburg | Racconto lungo, 5 puntate | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/valentino.xml |
| Racconti di Italo Calvino | Racconti brevi, uno per sera | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/raccontidiitalocalvino.xml |
| Favole al telefono – Gianni Rodari | Favole brevissime, lingua semplice | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/favolealtelefono.xml |

Lo stato dell'ultimo aggiornamento (quali feed sono stati generati e quali no) è in <https://tigbay.github.io/audiolibri-feed/stato.json>.

## Come si usa nelle app

Copia l'URL del feed e aggiungilo come feed RSS:

- **AntennaPod** (Android): `+` → *Aggiungi podcast tramite indirizzo RSS*
- **Pocket Casts**: cerca → incolla l'URL nella barra di ricerca
- **Podcast Addict** (Android): `+` → *Feed RSS*
- **Apple Podcasts** (iPhone): *Libreria* → `…` → *Segui uno show tramite URL*
- **Spotify**: non supporta feed RSS aggiunti a mano

Tutte queste app hanno tema scuro e sleep timer.

## Come funziona

1. Ogni ora (al minuto 19) parte la GitHub Action [`rss.yml`](.github/workflows/rss.yml). Si può avviare anche a mano da *Actions → Generate Feeds → Run workflow*.
2. Per ogni voce in [`src/static.ts`](src/static.ts) lo script scarica il JSON della pagina su raiplaysound.it, ad esempio `https://www.raiplaysound.it/audiolibri/caromichele.json`.
3. Gli URL audio di Rai (`relinkerServlet.htm`) vengono risolti fino al file MP3/MP4 sul CDN, così le app di podcast li riproducono senza problemi.
4. Gli URL già risolti finiscono in `cache/` e vengono ricontrollati ogni 14 giorni, per non rifare tutto a ogni esecuzione.
   Per i feed con `keepMissing: true` (per ora solo Ad alta voce) in cache vengono salvati anche titolo, descrizione e durata: così le puntate che Rai toglie dal programma restano nel feed.
5. I file XML vengono scritti in `out/` e pubblicati con **GitHub Pages**, insieme a `index.html` e `stato.json`.

I file audio restano sui server Rai: qui viene generato solo l'indice delle puntate.

### Aggiungere un audiolibro

Prendi l'indirizzo del libro su raiplaysound.it (per esempio `https://www.raiplaysound.it/audiolibri/caromichele`) e aggiungi una voce in `src/static.ts`:

```ts
{
  title: "Caro Michele – Natalia Ginzburg",
  path: "audiolibri/caromichele",
  note: "Breve descrizione"
}
```

Alla prossima esecuzione della Action il feed compare su GitHub Pages. Questo README invece si aggiorna a mano.

## Crediti e licenza

Basato su [giuliomagnifico/raiplaysound-feed](https://github.com/giuliomagnifico/raiplaysound-feed), a sua volta derivato da [frammenti/raiplaysoundrss](https://github.com/frammenti/raiplaysoundrss). Licenza [GPL-3.0](LICENSE).
