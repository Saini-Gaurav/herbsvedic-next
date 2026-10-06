import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

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

// The scope getToken() registers firebase-messaging-sw.js under by default.
const FCM_SW_SCOPE = "/firebase-cloud-messaging-push-scope";

/**
 * Firebase only auto-displays a notification when NO tab of this site is
 * visible. While one is, the service worker hands the payload to the page
 * instead - and without an onMessage() listener it's silently dropped.
 * This shows it ourselves in that case. Resolves to an unsubscribe function.
 */
export async function listenForForegroundMessages(): Promise<() => void> {
  if (!(await isSupported())) return () => {};

  const messaging = getMessaging(app);
  return onMessage(messaging, async (payload) => {
    const { title, body } = payload.notification || {};
    if (!title || Notification.permission !== "granted") return;

    // Showing it through the service worker registration (rather than
    // `new Notification()`) also works on Android Chrome, where the
    // constructor throws.
    const registration = await navigator.serviceWorker.getRegistration(FCM_SW_SCOPE);
    if (registration) {
      await registration.showNotification(title, { body, icon: "/favicon.ico", data: payload.data });
    } else {
      new Notification(title, { body, icon: "/favicon.ico" });
    }
  });
}