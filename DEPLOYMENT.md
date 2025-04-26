# Fulmark HVAC - Instrukcja Wdrożenia

Ten dokument zawiera szczegółowe instrukcje dotyczące wdrożenia aplikacji formularza kontaktowego Fulmark HVAC na platformie Vercel oraz konfiguracji bazy danych Supabase.

## Wymagania wstępne

- Konto Vercel ([vercel.com](https://vercel.com))
- Konto Supabase ([supabase.com](https://supabase.com))
- Node.js 18+ i npm zainstalowane lokalnie
- Konto ElevenLabs z kluczem API ([elevenlabs.io](https://elevenlabs.io))

## Konfiguracja Supabase

1. Utwórz nowy projekt Supabase:
   - Przejdź do [https://app.supabase.com](https://app.supabase.com)
   - Kliknij "New Project"
   - Wprowadź nazwę projektu (np. "fulmark-hvac")
   - Ustaw silne hasło do bazy danych
   - Wybierz region najbliższy Twoim użytkownikom (np. eu-central-1 dla Europy)
   - Kliknij "Create new project"

2. Zanotuj URL projektu i klucz anonimowy:
   - Po utworzeniu projektu przejdź do zakładki "Settings" > "API"
   - Skopiuj "Project URL" i "anon public" key
   - Te wartości będą potrzebne jako zmienne środowiskowe

3. Utwórz tabele w bazie danych:
   - Przejdź do zakładki "SQL Editor"
   - Skopiuj zawartość pliku `supabase/migrations/20250425_initial_schema.sql`
   - Wklej kod SQL do edytora i kliknij "Run"
   - Sprawdź, czy tabele zostały utworzone w zakładce "Table Editor"

## Konfiguracja ElevenLabs

1. Utwórz konto na [https://elevenlabs.io](https://elevenlabs.io)
2. Po zalogowaniu przejdź do zakładki "Profile" > "API Key"
3. Skopiuj swój klucz API
4. Ten klucz będzie potrzebny jako zmienna środowiskowa `ELEVENLABS_API_KEY`

## Zmienne środowiskowe

Skonfiguruj następujące zmienne środowiskowe w projekcie Vercel:

```env
ELEVENLABS_API_KEY=twój_klucz_api_elevenlabs
VITE_SUPABASE_URL=twój_url_projektu_supabase
VITE_SUPABASE_ANON_KEY=twój_klucz_anonimowy_supabase
```

## Wdrożenie na Vercel

1. Przygotuj repozytorium Git:
   - Upewnij się, że Twój kod jest w repozytorium Git (GitHub, GitLab lub Bitbucket)
   - Upewnij się, że plik `.env` jest dodany do `.gitignore` i nie jest przesyłany do repozytorium

2. Zaloguj się do swojego konta Vercel:
   - Przejdź do [https://vercel.com](https://vercel.com)
   - Zaloguj się lub utwórz nowe konto

3. Importuj projekt:
   - Kliknij "Add New" > "Project"
   - Wybierz swoje repozytorium z listy
   - Jeśli nie widzisz swojego repozytorium, może być konieczne połączenie konta Vercel z kontem GitHub/GitLab/Bitbucket

4. Skonfiguruj projekt:
   - Framework Preset: Vite
   - Build Command: `npm run build:prod` (lub `npm run build` dla standardowego buildu)
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Dodaj zmienne środowiskowe:
   - W sekcji "Environment Variables" dodaj wszystkie wymagane zmienne
   - Upewnij się, że nazwy zmiennych są dokładnie takie same jak w pliku `.env.example`

6. Kliknij "Deploy" i poczekaj na zakończenie procesu wdrażania

## Konfiguracja domeny (opcjonalnie)

1. Po wdrożeniu projektu przejdź do zakładki "Domains"
2. Możesz użyć domyślnej domeny Vercel (np. `fulmark-hvac.vercel.app`) lub dodać własną domenę
3. Aby dodać własną domenę:
   - Kliknij "Add" i wprowadź nazwę domeny
   - Postępuj zgodnie z instrukcjami, aby skonfigurować rekordy DNS

## Weryfikacja po wdrożeniu

Po wdrożeniu sprawdź, czy:

1. Formularz działa poprawnie
2. Nagrywanie i transkrypcja głosu działają prawidłowo
3. Dane formularza są zapisywane w bazie Supabase

Aby sprawdzić dane w Supabase:

- Zaloguj się do panelu Supabase
- Przejdź do zakładki "Table Editor"
- Wybierz tabelę `form_submissions` lub `voice_notes`
- Sprawdź, czy dane są poprawnie zapisywane

## Rozwiązywanie problemów

Jeśli napotkasz problemy:

1. Sprawdź logi wdrożenia w panelu Vercel:
   - Przejdź do zakładki "Deployments"
   - Wybierz najnowsze wdrożenie
   - Kliknij "View Logs"

2. Sprawdź, czy zmienne środowiskowe są poprawnie ustawione:
   - Przejdź do zakładki "Settings" > "Environment Variables"
   - Upewnij się, że wszystkie wymagane zmienne są obecne i poprawne

3. Sprawdź logi Supabase:
   - Przejdź do panelu Supabase
   - Przejdź do zakładki "Database" > "Logs"

4. Upewnij się, że klucz API ElevenLabs jest ważny i ma wystarczającą liczbę kredytów:
   - Zaloguj się do panelu ElevenLabs
   - Sprawdź status swojego konta i dostępne kredyty

## Aktualizacje i utrzymanie

1. Aby zaktualizować aplikację:
   - Wprowadź zmiany w kodzie
   - Zatwierdź zmiany w repozytorium Git
   - Vercel automatycznie wykryje zmiany i wdroży nową wersję

2. Monitorowanie:
   - Regularnie sprawdzaj logi Vercel i Supabase
   - Monitoruj wykorzystanie API ElevenLabs

## Rozwój lokalny

Aby uruchomić projekt lokalnie:

```bash
# Klonowanie repozytorium
git clone <URL_REPOZYTORIUM>
cd fulmark-hvac-form

# Instalacja zależności
npm install

# Konfiguracja zmiennych środowiskowych
# Utwórz plik .env na podstawie .env.example

# Uruchomienie serwera deweloperskiego
npm run dev

# Budowanie wersji produkcyjnej
npm run build

# Podgląd wersji produkcyjnej
npm run preview
```

Upewnij się, że plik `.env` zawiera wszystkie wymagane zmienne środowiskowe.
