# EcoVart MVP

Minimal Next.js + Tailwind + Firebase MVP for Carbon Footprint tracking and a small shop.

Features included:

- Next.js (pages router)
- Tailwind CSS
- Firebase Auth & Firestore (save footprint history)
- Calculator (estimates monthly footprint and computes EcoPoints)
- Shop page with ProductCard component

Getting started (local):

1. Install dependencies

   npm install

2. Create a Firebase project and enable Email/Password auth and Firestore.
3. Fill in `.env.local` with your Firebase project values (see variables in `.env.local`).

4. Run the dev server

   npm run dev

Build for production

npm run build
npm start

Deploying to Vercel

- Push this repository to GitHub.
- Import into Vercel and set the environment variables (the NEXT*PUBLIC_FB*\* keys) in the Vercel project settings.
- Vercel will run `npm run build` automatically.

Notes & verification

- Auth state is tracked via `onAuthStateChanged` in `pages/_app.js`.
- Footprint results are saved under `users/{uid}/history/{autoId}` with fields: commute, food, shopping, totalMonthly, points, createdAt.
- Tailwind is configured in `tailwind.config.js` and `styles/globals.css`.

Small next steps you might do after cloning:

- Add real product images in `/public/images` and update product data in `pages/shop.js`.
- Add a user dashboard page to view saved history.
