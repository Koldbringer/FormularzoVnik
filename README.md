# Fulmark HVAC - Formularz Kontaktowy

Aplikacja formularza kontaktowego dla firmy Fulmark Klimatyzacja, umożliwiająca klientom składanie zapytań dotyczących usług HVAC z funkcją nagrywania notatek głosowych.

## Funkcje

- Formularz kontaktowy z walidacją danych
- Nagrywanie i transkrypcja notatek głosowych (ElevenLabs API)
- Przechowywanie danych w bazie Supabase
- Responsywny design dostosowany do urządzeń mobilnych i desktopowych
- Nowoczesny interfejs użytkownika z wykorzystaniem shadcn/ui i Tailwind CSS

## Technologie

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase (baza danych)
- ElevenLabs API (transkrypcja głosu)
- React Router
- React Query

## Wymagania

- Node.js 18+ i npm
- Konto Supabase
- Klucz API ElevenLabs

## Instalacja

```bash
# Klonowanie repozytorium
git clone <URL_REPOZYTORIUM>
cd fulmark-hvac-form

# Instalacja zależności
npm install

# Konfiguracja zmiennych środowiskowych
# Utwórz plik .env z następującymi zmiennymi:
# ELEVENLABS_API_KEY=twój_klucz_api
# VITE_SUPABASE_URL=twój_url_supabase
# VITE_SUPABASE_ANON_KEY=twój_klucz_anonimowy_supabase

# Uruchomienie aplikacji w trybie deweloperskim
npm run dev
```

## Struktura bazy danych

Aplikacja korzysta z dwóch tabel w Supabase:

1. `form_submissions` - przechowuje dane z formularza
2. `voice_notes` - przechowuje transkrypcje notatek głosowych

Skrypt SQL do utworzenia tabel znajduje się w `supabase/migrations/20250425_initial_schema.sql`.

## Wdrożenie

Szczegółowe instrukcje wdrożenia aplikacji na platformie Vercel znajdują się w pliku `DEPLOYMENT.md`.

## Rozwój

```bash
# Uruchomienie w trybie deweloperskim
npm run dev

# Budowanie wersji produkcyjnej
npm run build

# Podgląd wersji produkcyjnej
npm run preview
```

## Licencja

Copyright © 2025 Fulmark. Wszelkie prawa zastrzeżone.
# RiseFormularz
