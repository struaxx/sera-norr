

## Probleem

Het buildCode wordt voor elke aanvraag identiek gegenereerd als de configuratie hetzelfde is. Twee oorzaken:

1. **Bug in `generateBuildCode`**: `Date.now().toString(36).substring(-4)` — `substring()` behandelt negatieve waarden als 0, dus het geeft de volledige string terug in plaats van de laatste 4 tekens. Moet `slice(-4)` zijn.
2. **Geen regeneratie bij submit**: Het buildCode wordt eenmalig gegenereerd en in localStorage bewaard. Bij een tweede aanvraag wordt hetzelfde code hergebruikt.
3. **Dossier referentie niet gekoppeld aan database**: De `dossierRef` wordt client-side aangemaakt maar niet opgeslagen of meegestuurd in de e-mail.

## Oplossing

### 1. Fix `generateBuildCode` in `configurator-store.ts`
- `substring(-4)` → `slice(-4)` zodat de timestamp-suffix daadwerkelijk uniek is.

### 2. Unieke dossier referentie per aanvraag
- Bij elke submit in `requestQuote` (api.ts): gebruik het database-gegenereerde `id` (UUID) uit het `form_submissions` antwoord om een unieke dossierref te maken, bijv. `DOS-2503-XXXX` (jaar+maand + laatste 4 chars van DB id).
- Stuur deze dossierRef mee in de e-mail subject line in plaats van alleen het buildCode.

### 3. Dossier ref in e-mail
- Update `submit-form` edge function: return het submission `id` (dit doet het al via `data.id`).
- Update `send-confirmation-email` aanroep (als apart) of de email subject in `requestQuote` om de unieke dossierRef te gebruiken.

### 4. Forceer nieuw buildCode bij elke submit
- In de dossier-fase, regenereer het buildCode vlak voor verzending zodat het altijd een vers timestamp bevat.

### Bestanden die worden aangepast
- `src/stores/configurator-store.ts` — fix `slice(-4)`, add random suffix
- `src/lib/configurator/api.ts` — genereer unieke dossierRef op basis van DB id, gebruik in email subject

