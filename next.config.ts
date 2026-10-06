import fs from "fs";
import path from "path";
import type { NextConfig } from "next";

function generateFirebaseServiceWorker() {
  // Pin the worker's SDK to the installed `firebase` package so the page
  // and the worker never drift onto different major versions.
  const firebaseVersion = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "node_modules", "firebase", "package.json"), "utf8")
  ).version;

  const content = `
importScripts("https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}",
  projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
  messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Messages with a "notification" block are already displayed by the SDK
  // before this handler runs - showing them here too produced duplicates.
  // Only data-only messages need displaying by hand.
  if (payload.notification) return;
  const { title, body } = payload.data || {};
  if (!title) return;
  self.registration.showNotification(title, {
    body: body || "",
    icon: "/favicon.ico",
  });
});
`.trim();

  fs.writeFileSync(path.join(process.cwd(), "public", "firebase-messaging-sw.js"), content);
}

generateFirebaseServiceWorker();

const nextConfig: NextConfig = {};

export default nextConfig;