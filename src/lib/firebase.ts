import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// getApps().length check prevents calling initializeApp() twice during
// Next.js's hot-reload in development, which would otherwise throw.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

/**
 * Asks the browser for notification permission, then gets a real
 * device token back from Firebase if granted. Returns null on
 * anything other than a clean success - denied permission, unsupported
 * browser, no service worker - so callers can just check truthiness
 * rather than handling several different failure shapes.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  const supported = await isSupported();
  if (!supported) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const messaging = getMessaging(app);
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token || null;
  } catch (err) {
    console.error("Failed to get FCM token:", err);
    return null;
  }
}