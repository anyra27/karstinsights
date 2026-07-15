# Auto-refresh setup — Portrait of a Graduate dashboard

The dashboard at `/PortraitOfAGraduate/` auto-refreshes every night at 3:30 AM Pacific by reading the live response Sheet. This file walks you through the one-time setup. ~30 minutes total, most of which is waiting on Google to provision things.

## What's already in the repo (no action required)

- `PortraitOfAGraduate/index.html` — fetches `data.json` on load and overlays current numbers
- `PortraitOfAGraduate/data.json` — bootstrapped from the local xlsx; the workflow rewrites this nightly
- `PortraitOfAGraduate/scripts/refresh.py` — pulls the Sheet → writes `data.json`
- `.github/workflows/refresh-portrait-of-a-graduate.yml` — cron-driven workflow

## What you need to do once

### 1. Create a Google Cloud service account

If you have the GCP project that the form's Apps Script is bound to, use it. If not, any GCP project will work — the service account just needs Sheets API access.

1. Open <https://console.cloud.google.com/>.
2. Create a project (or pick an existing one).
3. Enable the **Google Sheets API** for the project.
4. Go to **IAM & Admin → Service Accounts → Create service account**.
5. Name it something like `rjuhsd-insights-refresher`. No optional roles needed.
6. After creation, click the account → **Keys → Add Key → Create new key → JSON**.
7. A JSON file downloads. Open it in a text editor — you'll paste it as a GitHub secret.

### 2. Share the response Sheet with the service account

1. Open the response Sheet: <https://docs.google.com/spreadsheets/d/1lZkJXGnop17WAaoftePHGBSDyxzEMkQ8vN9MjaCSZK0/edit>
2. Click **Share** (top right).
3. Paste the service account's email address (looks like `something@project-id.iam.gserviceaccount.com` — it's in the JSON file under `"client_email"`).
4. Set permission to **Viewer** (read-only is all the script needs).
5. Uncheck "Notify people" — the bot doesn't need an email.
6. **Share**.

### 3. Add three secrets to the GitHub repo

1. Open <https://github.com/anyra27/RJUHSD.Insights/settings/secrets/actions>.
2. Click **New repository secret**, repeat three times:

   | Name | Value |
   |---|---|
   | `GOOGLE_CREDENTIALS_JSON` | Paste the **entire contents** of the JSON file from step 1 (including the curly braces). |
   | `SHEET_ID` | `1lZkJXGnop17WAaoftePHGBSDyxzEMkQ8vN9MjaCSZK0` |
   | `SHEET_RANGE` | `Responses!A1:Y` |

### 4. Trigger the first run manually

1. Open <https://github.com/anyra27/RJUHSD.Insights/actions>.
2. Pick **Refresh Portrait of a Graduate dashboard** from the left sidebar.
3. Click **Run workflow → main → Run workflow**.
4. Watch it finish (~30 sec). Successful run will commit a `Refresh Portrait of a Graduate data.json (n=...)` commit if the Sheet has changed.
5. If it fails, the logs will say why — most common is the Sheet not being shared with the service account, or a typo in the secret JSON.

After step 4, the cron takes over. The workflow runs every day at **10:30 UTC = 3:30 Pacific** (early enough that anyone checking in the morning sees fresh numbers, late enough that overnight responses are captured).

## How the dashboard uses `data.json`

On page load, the dashboard calls `fetch('data.json')` and overlays the live values on top of the static markup. If the fetch fails (offline, file missing, JSON malformed), the dashboard silently falls back to the values baked into the HTML — so you never see a broken page.

What gets refreshed live:
- **Pulse KPIs** — total responses, role mix, schools represented, Using AI mean
- **Six-skill distribution chart** (1-5 stacked bars)
- **Top-3 leaderboard** — counts, percentages, bar widths, and rank order
- **Three voices heatmap** — every cell, every gap, every top-3 share
- **Site-n bar chart** — counts per high school
- **Theme cards** — count + percentage + role-distribution chips, all 15 cards
- **Footer stamp** — "Built with Anyra · data refreshed [datetime] · n = [N]"

What stays curated (not auto-refreshed):
- **Headlines and ledes** — the editorial framing of each section
- **Verbatim quotes** — hand-picked from the open text; auto-rotation risks surfacing weak or off-tone responses
- **Insight card SVG glyphs** (the Key Insights tab) — directional findings, not bound to exact current numbers

When the *story* shifts (say, a new theme overtakes "Tool, not crutch" as the dominant AI frame), refresh the curation manually — that's an editorial decision, not a data one.

## Testing locally

You can run the script on your own machine without setting up GitHub at all — useful for a sanity check or when iterating on the regex bundles.

```bash
# In the insights-site repo root:
pip install google-api-python-client google-auth

# Save the service account JSON locally as ~/rjuhsd-bot-key.json (gitignored).
GOOGLE_CREDENTIALS_JSON=$(cat ~/rjuhsd-bot-key.json) \
SHEET_ID=1lZkJXGnop17WAaoftePHGBSDyxzEMkQ8vN9MjaCSZK0 \
SHEET_RANGE='Responses!A1:Y' \
python3 PortraitOfAGraduate/scripts/refresh.py

# Inspect the result:
python3 -c "import json; d=json.load(open('PortraitOfAGraduate/data.json')); print('n=', d['totals']['n']); print(d['top3']['overall'])"
```

If `data.json` looks right locally, the workflow will produce the same thing in CI.

## Adjusting the cadence

Edit `.github/workflows/refresh-portrait-of-a-graduate.yml`:

```yaml
on:
  schedule:
    - cron: "30 10 * * *"   # every day at 10:30 UTC = 3:30 Pacific
```

Common alternatives:
- Hourly: `"0 * * * *"`
- Every 4 hours: `"0 */4 * * *"`
- Once a week: `"30 10 * * 1"` (Mondays at 3:30 Pacific)

## Killing the auto-refresh

Two options:

1. **Pause:** open the workflow in the Actions tab → **⋯ → Disable workflow**. Stops the cron without deleting anything; you can re-enable any time.
2. **Lock the snapshot:** disable the workflow AND delete `PortraitOfAGraduate/scripts/` and `.github/workflows/refresh-portrait-of-a-graduate.yml`. The dashboard keeps fetching `data.json` (which is just frozen), so the numbers stay at whatever the last refresh wrote.

## What if the Sheet ID changes?

If Tu ever moves or recreates the response Sheet, update the `SHEET_ID` GitHub secret and re-share the new Sheet with the same service account email. No code changes needed.
