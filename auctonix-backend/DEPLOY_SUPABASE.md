# Deploy Backend with Supabase PostgreSQL

This backend is now configured to read all deployment values from environment variables.

## 1) Get Supabase connection values
From Supabase project dashboard:
1. Go to `Project Settings` -> `Database`.
2. Copy the Transaction pooler host and port (`6543`), user, and password.
3. Use this JDBC format:

`jdbc:postgresql://db.<PROJECT_REF>.supabase.co:6543/postgres?sslmode=require`

## 2) Required environment variables
Set these in your hosting provider:

- `PORT` = `8080` (or let platform provide it)
- `DB_URL` = `jdbc:postgresql://<POOLER_HOST>:6543/postgres?sslmode=require`
- `DB_USERNAME` = `postgres.<PROJECT_REF>`
- `DB_PASSWORD` = `<SUPABASE_DB_PASSWORD>`
- `JWT_SECRET` = long random secret
- `JWT_EXPIRATION` = `86400000`
- `ML_SERVICE_BASE_URL` = your ML service URL (optional)

## 3) Build and run locally with env vars
PowerShell example:

```powershell
$env:DB_URL="jdbc:postgresql://db.<PROJECT_REF>.supabase.co:6543/postgres?sslmode=require"
$env:DB_USERNAME="postgres.<PROJECT_REF>"
$env:DB_PASSWORD="<SUPABASE_DB_PASSWORD>"
$env:JWT_SECRET="<LONG_RANDOM_SECRET>"
./mvnw.cmd spring-boot:run
```

## 4) Docker deploy command
Build:

```powershell
docker build -t auctonix-backend .
```

Run:

```powershell
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e DB_URL="jdbc:postgresql://db.<PROJECT_REF>.supabase.co:6543/postgres?sslmode=require" \
  -e DB_USERNAME="postgres.<PROJECT_REF>" \
  -e DB_PASSWORD="<SUPABASE_DB_PASSWORD>" \
  -e JWT_SECRET="<LONG_RANDOM_SECRET>" \
  auctonix-backend
```

## 5) Common deploy failure checks
- Wrong port: app must bind to `PORT`.
- SSL missing on Supabase URL: include `?sslmode=require`.
- Username format wrong: should be `postgres.<PROJECT_REF>`.
- IP restrictions/firewall on host (if any custom network setup).
- Migrations/schema issues: check app startup logs for table errors.

## 6) Render redeploy (recommended for your case)
Use these exact steps in Render Dashboard:

1. Open your backend Web Service -> `Environment`.
2. Remove old Render Postgres values that point to `dpg-...` hosts.
3. Set:
  - `DB_URL` = `jdbc:postgresql://<POOLER_HOST>:6543/postgres?sslmode=require`
  - `DB_USERNAME` = `postgres.<PROJECT_REF>`
  - `DB_PASSWORD` = `<SUPABASE_DB_PASSWORD>`
  - `JWT_SECRET` = long random value
4. Save changes, then click `Manual Deploy` -> `Deploy latest commit`.

If your logs show `UnknownHostException: dpg-...`, the app is still using old Render DB host values, not Supabase.
