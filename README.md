# StudyBench

AI-generated math & physics practice — quizzes, flashcards, and step-by-step solutions. Built with Next.js.

## 1. Run it locally

```bash
npm install
```

Copy the env example and paste in your real key:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace the placeholder with your real key from console.anthropic.com:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Then start the dev server:

```bash
npm run dev
```

Open http://localhost:3000 — you should see StudyBench running.

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
```

Create a new repo on github.com, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/studybench.git
git branch -M main
git push -u origin main
```

`.env.local` is in `.gitignore` — your key never gets committed. Good.

## 3. Deploy to Vercel

1. Go to vercel.com, sign in with GitHub, click **Add New → Project**.
2. Import the `studybench` repo.
3. Before deploying, open **Environment Variables** and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key
4. Click **Deploy**. You'll get a `studybench-xxxx.vercel.app` URL.

## Notes

- The Anthropic key only ever lives on the server (`app/api/generate/route.js`) — it's never sent to the browser.
- Each generated problem/flashcard set/solution costs a small amount of API usage on your Anthropic account (fractions of a cent per call with Sonnet).
- To change the model, edit the `model` field in `app/api/generate/route.js`.
