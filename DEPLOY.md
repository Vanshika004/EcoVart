# Deployment & Vercel Checklist for EcoVart

Follow these steps to deploy the project to Vercel and wire Firebase + Payment keys.

1. Prepare Firebase

   - Create a Firebase project.
   - Enable Authentication (Email/Password).
   - Create Firestore database in native mode.
   - (Optional) Enable Firebase Storage and upload product images, or use `/public/images` for static assets.

2. Environment variables (set in Vercel project settings)

   - NEXT_PUBLIC_FB_API_KEY
   - NEXT_PUBLIC_FB_AUTH_DOMAIN
   - NEXT_PUBLIC_FB_PROJECT_ID
   - NEXT_PUBLIC_FB_STORAGE
   - NEXT_PUBLIC_FB_MSGID
   - NEXT_PUBLIC_FB_APPID

# 3. Payment keys (Razorpay / Stripe)

- For Razorpay, set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (never expose the secret in client-side envs).
- For Stripe, set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY. Use webhooks for payment confirmation and set STRIPE_WEBHOOK_SECRET in Vercel.

4. Webhooks & serverless functions

   - Use Vercel Serverless Functions or a small backend to handle payment webhooks and to create secure payment orders.
   - Do not perform payment verification on the client. Use server-side endpoints.

5. Firestore Rules

   - Deploy `ops/firestore.rules` to your Firebase project using the Firebase CLI:

     firebase deploy --only firestore:rules --project your-project-id

6. Vercel deployment

   - Push repo to Git provider (GitHub/GitLab).
   - Import project into Vercel and configure the environment variables above.
   - Vercel will run `npm run build` and deploy the site.
   -
   - 8. Service account for server-side admin operations

   - To allow role assignment and secure server-side operations, create a Firebase service account JSON (from Firebase Console > Project Settings > Service Accounts).
   - Store the JSON string securely in Vercel as an environment variable named `FIREBASE_SERVICE_ACCOUNT` (paste the whole JSON as a single value). Alternatively, set `GOOGLE_APPLICATION_CREDENTIALS` to point to a file on your server.

   - Example (Vercel):

     - Key: FIREBASE_SERVICE_ACCOUNT
     - Value: { ... entire service account JSON ... }

   - The API route `pages/api/admin/setRole.js` will parse this env var to initialize the Admin SDK and will verify the caller's ID token before performing role changes.

   7. Post-deploy checks

   - Create a test user and verify sign up/sign in works.
   - Create a product via vendor dashboard (or add directly in Firestore) and verify the Admin verification workflow.
   - Test a mock checkout flow with your payment test keys.

Security notes

- Never store secret keys in client-side env variables. Use server-side functions for webhooks and sensitive operations.
- Use HTTPS and enforce security rules in Firestore. Test rules with the Firebase emulator before production.
