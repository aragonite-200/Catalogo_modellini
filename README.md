# Catalogo Modellini

App mobile per catalogare una collezione di modellini. Permette di aggiungere una scheda con foto e dettagli, consultare e cercare i modelli salvati e vedere un riepilogo della collezione.

## Funzionalità

- Aggiunta di un modellino con marca, modello, produttore, versione, scala, prezzo e foto.
- Scelta di un'immagine dalla galleria o acquisizione con la fotocamera.
- Elenco ricercabile per marca, modello, produttore e scala.
- Scheda di dettaglio e rimozione di un modellino.
- Riepilogo con numero di modelli, valore stimato e distribuzioni per scala e marca.
- Widget iOS per statistiche, ultimi arrivi e aggiunta rapida.

## Requisiti

- Node.js compatibile con Expo SDK 57.
- npm.
- Per eseguire l'app nativamente: Xcode e iOS Simulator su macOS, oppure Android Studio e un emulatore Android.

Il progetto usa Expo SDK 57 e React Native 0.86. La documentazione Expo di riferimento indicata nelle istruzioni del repository è [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/); per comandi e librerie specifici del progetto, verifica la compatibilità con SDK 57.

## Avvio

Installa le dipendenze dal lockfile:

```bash
npm ci
```

Avvia il server di sviluppo:

```bash
npm start
```

Poi segui le istruzioni mostrate nel terminale per aprire l'app su un dispositivo o un emulatore. Sono disponibili anche questi comandi:

```bash
npm run android  # avvia la versione Android nativa
npm run ios      # avvia la versione iOS nativa (macOS e Xcode)
npm run web      # avvia la versione web
```

L'app include moduli nativi e widget iOS. Per le funzionalità che li usano, avviala con un development build configurato per la piattaforma; la disponibilità in Expo Go può essere limitata.

## Struttura del progetto

```text
src/
  app/          schermate e navigazione Expo Router
  components/   componenti riutilizzabili e grafici
  constants/    tema e valori condivisi
  hooks/        hook per tema e schema colori
  utils/        inizializzazione del database SQLite
widgets/        widget iOS
```

I dati dei modellini sono memorizzati nel database SQLite locale. Le immagini vengono copiate nella cartella `images` dello spazio documenti dell'app; il database conserva il nome del file. I dati sono locali al dispositivo e il progetto non configura sincronizzazione o backup cloud.

## Qualità del codice

```bash
npm run lint
```

## Note

- L'autorizzazione alla fotocamera viene richiesta quando si sceglie di scattare una foto.
- La cartella `app/` citata nella documentazione generica Expo non è usata direttamente qui: le rotte dell'app si trovano in `src/app/`.
