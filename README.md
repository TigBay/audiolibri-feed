# Audiolibri feed

Feed RSS per ascoltare **Ad alta voce** (Rai Radio 3) e alcuni audiolibri di RaiPlay Sound in qualsiasi app di podcast (AntennaPod, Pocket Casts, Podcast Addict, Apple Podcasts…), con tema scuro e sleep timer.

Scelti per ascoltare prima di dormire e per allenare l'italiano di tutti i giorni.

## Programmi

| Titolo | Note | Feed RSS |
|--------|------|----------|
| Ad alta voce | Il programma di Radio3: il romanzo letto in questo periodo | https://tigbay.github.io/audiolibri-feed/rss/programmi/adaltavoce.xml |

## Audiolibri

| Titolo | Note | Feed RSS |
|--------|------|----------|
| Caro Michele – Natalia Ginzburg | Romanzo in lettere, lingua vicina al parlato (lettura di Anna Bonaiuto) | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/caromichele.xml |
| Le voci della sera – Natalia Ginzburg | Un paese, una famiglia, le sue voci | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/levocidellasera.xml |
| Le piccole virtù – Natalia Ginzburg | Brevi saggi autobiografici | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/lepiccolevirtu.xml |
| Valentino – Natalia Ginzburg | Racconto lungo, solo 5 puntate | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/valentino.xml |
| Racconti di Italo Calvino | Racconti brevi, uno per sera | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/raccontidiitalocalvino.xml |
| Favole al telefono – Gianni Rodari | Favole brevissime, lingua semplice | https://tigbay.github.io/audiolibri-feed/rss/audiolibri/favolealtelefono.xml |

## Come si usa

Copia l'URL del feed e incollalo nella tua app di podcast alla voce "Aggiungi feed RSS".

## Aggiungere un audiolibro

Apri la pagina del libro su raiplaysound.it, ad esempio `https://www.raiplaysound.it/audiolibri/caromichele`, e aggiungi in [src/static.ts](https://github.com/TigBay/audiolibri-feed/blob/main/src/static.ts):

```ts
{
  title: "Caro Michele – Natalia Ginzburg",
  path: "audiolibri/caromichele",
  note: "Breve descrizione"
}
```

La tabella qui sopra si aggiorna da sola alla prossima esecuzione della Action (ogni ora).

## Crediti

Basato su [giuliomagnifico/raiplaysound-feed](https://github.com/giuliomagnifico/raiplaysound-feed), a sua volta derivato da [frammenti/raiplaysoundrss](https://github.com/frammenti/raiplaysoundrss). Licenza GPL-3.0. I file audio restano sui server Rai: qui si genera solo l'indice delle puntate.
