# LPD Kalkulator - Upgraded Version

🚀 **Major Upgrade:** Vollständiger Umbau von Passwort-Login auf Supabase Auth mit Live-Daten und Kunden-Verwaltung.

## 🆕 Neue Features

### ✅ Implemented
- **Supabase Auth Login** - E-Mail/Passwort statt statisches Passwort
- **Live Produktdaten** - Direkt aus `blanks` Tabelle
- **Kunden-Verwaltung** - Suche, Auswahl und Neuanlage
- **Angebots-Historie** - Automatisches Speichern aller Angebote
- **PDF mit Kundendaten** - Professioneller Header mit Firmenadresse
- **Glassmorphism Design** - Verbesserte Optik mit Backdrop-Blur
- **Auto-Login** - Session-Management

### 🗄️ Database Integration
- Nutzt bestehende `customers` und `blanks` Tabellen
- Neue `quotes` Tabelle für Angebote (siehe SQL-Datei)
- RLS Policies für sicheren Zugriff

## 🚀 Deployment

**Live URL:** https://lpd-kalkulator.vercel.app

- ✅ GitHub Repo: https://github.com/ghostzicht/lpd-kalkulator
- ✅ Vercel Auto-Deploy aktiviert
- ✅ SSL/HTTPS automatisch

## 🔐 Setup Required

### 1. Quotes Tabelle erstellen
Falls die `quotes` Tabelle noch nicht existiert, führe das SQL aus `create_quotes_table.sql` in Supabase aus:

```sql
-- In Supabase SQL Editor ausführen
-- Siehe create_quotes_table.sql für vollständiges SQL
```

### 2. Login Daten
- **URL:** https://lpd-kalkulator.vercel.app
- **Login:** maurice.roth@localprintdepartment.de
- **Passwort:** Admin2024!

## 🧮 Kalkulations-Logik (unverändert)

- **Druckkosten:** DTG/DTF/Plastisol = 3.77€ EK / 8€ VK pro Seite
- **Formel:** `(EK × Multiplikator) + Druckkosten = VK brutto`
- **Staffelrabatte:** 
  - 6-9 Stück: 10%
  - 10-14 Stück: 15%
  - 15-19 Stück: 20%
  - 20-24 Stück: 25%
  - 25-29 Stück: 30%
  - 30-49 Stück: 35%
  - 50-89 Stück: 40%
  - 90-99 Stück: 45%
  - 100+ Stück: 50%

## 📱 Usage Flow

1. **Login** mit Supabase Auth
2. **Kunde wählen** (Suche oder neu anlegen)
3. **Produkt wählen** (Live aus Datenbank)
4. **Konfiguration** (Druckart, Seiten, Menge)
5. **PDF Export** → Angebot wird automatisch gespeichert
6. **Historie** ansehen über "📚 Angebote anzeigen"

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (Single-File)
- **Auth:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **Hosting:** Vercel (Auto-Deploy)
- **CDN:** Supabase JS Client

## 📝 Files

- `index.html` - Hauptanwendung (50KB)
- `create_quotes_table.sql` - SQL Setup für Angebote
- `README.md` - Diese Anleitung

---

**Built by Ghostzicht 👻 for LPD**  
*Ready for production use!*