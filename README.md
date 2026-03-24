# CyDef CTF Platform

A full-stack Next.js 14 Capture The Flag competition platform for the CyDef cybersecurity workshop.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (Postgres + Row-Level Security) |
| Styling | Tailwind CSS + custom CSS |
| Deployment | Vercel (free tier) |
| Auth | Cookie-based (httpOnly, no JWT library needed) |

---

## Pre-Deployment Checklist

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New project**, choose a name (e.g. `cydef-ctf`) and a strong DB password
3. Wait ~2 minutes for the project to provision
4. Go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2 — Run the database schema

1. In your Supabase dashboard, go to **SQL Editor → New query**
2. Paste the entire contents of `supabase-schema.sql`
3. Click **Run** — this creates all tables, the RPC function, and seeds the 10 challenges

### Step 3 — Create the steganography image for Q9

1. Go to [incoherency.co.uk/image-steganography/](https://incoherency.co.uk/image-steganography/)
2. Upload any photo (a landscape, logo, etc.)
3. In the **Encode** tab, enter the message: `FLAG{HIDDEN_IN_PIXELS}`
4. Click **Encode** and download the resulting PNG
5. Rename it to `steg-image.png` and place it in `public/challenge-pages/`

### Step 4 — Set environment variables

Create a `.env.local` file in the project root (copy from `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=choose-a-strong-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Important:** `ADMIN_PASSWORD` is the only credential for the admin panel.
> Pick something strong before you deploy.

### Step 5 — Run locally to verify

```bash
npm install
npm run dev
```

Visit:
- `http://localhost:3000` — team login
- `http://localhost:3000/admin` — admin panel
- `http://localhost:3000/leaderboard` — leaderboard

---

## Deploy to Vercel

1. Push this repo to GitHub (or GitLab / Bitbucket)
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo
3. In **Environment Variables**, add all four variables from Step 4
   (change `NEXT_PUBLIC_APP_URL` to your Vercel URL, e.g. `https://cydef-ctf.vercel.app`)
4. Click **Deploy** — takes ~2 minutes

---

## Event Day Workflow

### Before participants arrive

1. Open `/admin` and log in with your `ADMIN_PASSWORD`
2. Go to **Teams** tab → create one team per group (max 3 people each)
3. Note each team's **join code** — hand these out to teams on paper or on a slide
4. Go to **Challenges** tab — verify all challenges are visible (green)
   - Q10 (Layers of lies) is hidden by default — reveal it when you want to unlock the final challenge
5. Tell participants to open your Vercel URL and enter their join code

### Starting the event

1. In the **Overview** tab, set the duration (default 90 min) and click **Start**
2. The timer appears on every team's challenge page
3. Submissions are logged live in the **Submissions** tab

### During the event

- **Submissions tab**: see every flag attempt in real time (correct = green, wrong = red)
- **Score adjustment**: if you want to manually award/deduct points, use the form in the Overview tab
- **Reveal Q10**: go to Challenges tab and toggle Q10 to Visible whenever you're ready

### Ending the event

1. Click **Stop** to stop the timer
2. Go to **Leaderboard** tab → click **Snapshot & Publish**
3. This freezes the current scores and makes them visible to all participants at `/leaderboard`
4. Display the leaderboard on a shared screen for the podium reveal

---

## Folder Structure

```
cydef-ctf/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Team login (/)
│   │   ├── challenges/page.tsx       # Challenge board (/challenges)
│   │   ├── leaderboard/page.tsx      # Leaderboard (/leaderboard)
│   │   ├── admin/page.tsx            # Admin panel (/admin)
│   │   └── api/
│   │       ├── team/login            # POST: team login
│   │       ├── team/logout           # DELETE: team logout
│   │       ├── team/submit           # POST: flag submission
│   │       ├── team/submissions      # GET: solved challenge IDs
│   │       ├── challenges            # GET: visible challenges
│   │       ├── gamestate             # GET: timer + leaderboard state
│   │       └── admin/
│   │           ├── login             # POST/DELETE: admin auth
│   │           ├── teams             # GET/POST/DELETE: team management
│   │           ├── challenges        # GET/PATCH: challenge visibility
│   │           ├── submissions       # GET: all subs, PATCH: score adjust
│   │           ├── timer             # POST: start/stop/reset
│   │           └── leaderboard       # POST: snapshot/hide
│   ├── components/
│   │   ├── ui/NavBar.tsx
│   │   ├── ui/Timer.tsx
│   │   └── challenges/ChallengeCard.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   └── challenges-data.ts
│   └── types/index.ts
├── public/
│   └── challenge-pages/
│       ├── q3.html                   # Disabled button challenge
│       ├── q4.html                   # Console flag challenge
│       ├── q5.html                   # Cookie manipulation
│       ├── q7.html                   # SQL injection demo
│       ├── q10.html                  # Multi-step final challenge
│       └── steg-image.png            # ← YOU MUST CREATE THIS (see Step 3)
├── supabase-schema.sql               # Run this in Supabase SQL Editor
├── .env.example                      # Copy to .env.local and fill in
└── README.md
```

---

## Challenge Answer Key

| # | Title | Flag | Difficulty | Points |
|---|---|---|---|---|
| 1 | Shift happens | `FLAG{CAESAR_IS_EASY}` | Easy | 100 |
| 2 | Encoded in plain sight | `FLAG{BASE64_IS_NOT_ENCRYPTION}` | Easy | 100 |
| 3 | Hidden in the HTML | `FLAG{INSPECT_UNLOCKS_SECRETS}` | Easy | 100 |
| 4 | Console confessions | `FLAG{CONSOLE_TELLS_ALL}` | Easy | 100 |
| 5 | Cookie monster | `FLAG{COOKIES_ARE_CRUMBLY}` | Medium | 200 |
| 6 | What's my shift? | `FLAG{CRACKED_THE_UNKNOWN}` | Medium | 200 |
| 7 | Always true | `FLAG{SQL_INJECTION_BYPASSED}` | Medium | 200 |
| 8 | Cracking the fingerprint | `FLAG{password}` | Medium | 200 |
| 9 | The image knows more | `FLAG{HIDDEN_IN_PIXELS}` | Hard | 300 |
| 10 | Layers of lies | `FLAG{combine_your_new_skills}` | Hard | 300 |

**Q6 note:** Ciphertext `QWLR{NCLNVPO_ESP_FYVYZHY}` was encrypted with Caesar shift +11. Participants decrypt by shifting −11 (or equivalently +15).

**Q10 note:** The HTML comment contains `TVNITntqdnRpcHVsX2Z2YnlfdWxkX3pycHNzen0=`. Base64 decode → `MSHN{jvtipul_fvby_uld_zrpssz}`. Caesar shift −7 → `FLAG{combine_your_new_skills}`.

---

## Customisation

**Change challenge points:** Edit the `points` column values in `supabase-schema.sql` before running, or update them directly in the Supabase table editor.

**Add/remove challenges:** Insert/delete rows in the `challenges` table via the Supabase table editor. The platform handles any number of challenges dynamically.

**Change event duration:** Set the duration in minutes in the admin Overview tab before clicking Start. Default is 90 minutes.

**Change the admin password:** Update `ADMIN_PASSWORD` in your environment variables and redeploy.
