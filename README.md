# NeoInquiry - AI Omnichannel Inquiry Intelligence

NeoInquiry is a frontend demonstration of an AI-assisted workflow for preventing missed customer inquiries across email, chat, WhatsApp, and Instagram.

## Demo

- Live source repository: https://github.com/kingvis/SCHEMA_DEMO_NeoInquiry
- Live Firebase deployment: https://REMOVED_FIREBASE_HOSTING_SITE.web.app
- Video walkthrough: shared separately via Google Drive with the submission email

## What this demonstrates

- Unified inquiry inbox across multiple channels
- AI-assisted intent, urgency, sentiment, and routing classification
- Draft responses for human review before sending
- Follow-up workflow and analytics for response-time and conversion outcomes
- Agent console for triage, drafting, follow-up, and insight workflows

## Run locally

1. Clone the repository or download the files.
2. Open `index.html` in a modern browser.
3. No build step, dependencies, or API keys are required.

The demo uses deterministic client-side logic and in-memory data. A production implementation would connect the classification and draft functions to an LLM API, persist data, authenticate users, and receive channel webhooks.

## Firebase vertical slice

The repository includes an optional Firebase integration for the first production boundary:

- `firebase-client.js` loads Firestore inquiries when a valid Firebase Web App configuration is present.
- `firebase-client.js` exposes inquiry search and customer-context reads for the application/MCP boundary.
- `mcp-server.mjs` exposes the same two read-only operations through MCP over stdio.
- `firestore.rules` requires authenticated users to carry a matching `tenantId` claim and prevents direct inquiry writes.
- Draft submission creates a pending approval record instead of sending directly.
- `neo-inquiry.mjs` provides `validate`, `seed`, and `check-deploy` commands.

### Enable Firebase

1. Create a Firebase project and Web App.
2. Copy the Web App configuration into `firebase-config.js`.
3. Enable anonymous authentication for the `demo` tenant, or replace it with your production identity provider and set a `tenantId` custom claim.
4. Deploy `firestore.rules` using the Firebase CLI.
5. Install dependencies with `npm install`.
6. Run `npm run validate`.
7. Set `GOOGLE_APPLICATION_CREDENTIALS` and `NEO_TENANT_ID`, then run `npm run seed`.
8. Run `npm run mcp` from an MCP-compatible host to expose the read-only tools.

Firebase Hosting serves the static demo after `firebase deploy --only hosting`. Enable Google sign-in in Firebase Console under Authentication before using production user accounts.

The service-account file must never be committed. Firebase mode is disabled automatically when the web configuration is empty, so the static demo still runs without credentials.

### Connected Firebase project

- Project: `REMOVED_FIREBASE_PROJECT_NAME`
- Project ID: `REMOVED_FIREBASE_PROJECT`
- Hosting site: `REMOVED_FIREBASE_HOSTING_SITE`
- Firestore database: `(default)` in `nam5`

## Personally owned files

- `index.html` - application markup and layout
- `styles.css` - design system, responsive layout, and animations
- `app.js` - application state, demo data, interactions, classification logic, and charts

## AI assistance disclosure

AI coding assistance was used while iterating on the UI. The architecture, product decisions, classification behavior, narrative framing, and final review are my own.
