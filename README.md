# Galileo

Sito educativo in italiano, in stile Brilliant.org: corsi di matematica basati su **learning-by-doing**, con esercizi interattivi (drag-and-drop, scelta multipla, animazioni), matematica renderizzata in LaTeX e **gamification** (XP, streak, percorsi a livelli).

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion (animazioni)
- @dnd-kit (drag-and-drop)
- KaTeX (rendering LaTeX)
- Firebase Auth + Firestore (account e progressi), con fallback automatico a `localStorage` in modalità ospite

## Avvio

```bash
npm install
npm run dev
```

L'app è già completamente giocabile senza alcuna configurazione: senza un progetto Firebase, funziona in **modalità ospite** (progressi salvati in `localStorage` sul browser).

## Configurare Firebase (opzionale, per account e sync multi-dispositivo)

1. Crea un progetto su [Firebase Console](https://console.firebase.google.com).
2. Abilita **Authentication** → Sign-in method → Email/Password e Google.
3. Abilita **Firestore Database**.
4. Copia `.env.example` in `.env.local` e incolla le chiavi della tua web app Firebase.

## Struttura del progetto

```
src/
  pages/        pagine dell'app (Home, Corsi, mappa corso, player lezione, profilo, login)
  components/   componenti UI, motore esercizi, gamification, math (KaTeX)
  courses/      contenuti didattici (dati), separati dal codice applicativo
  lib/          Firebase, gestione progressi/XP/streak, registro icone
  hooks/        useAuth, useUserProgress, useCourseProgress
  types/        modelli dati (Corso, Lezione, Esercizio, Utente)
```

Per aggiungere un nuovo corso: crea una cartella in `src/courses/<id-corso>/`, definisci lezioni ed esercizi tipizzati, poi registra il corso in `src/courses/index.ts`.
