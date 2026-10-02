importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC0jRaEosVqCYEo7TVT1CukL7InDKKjm5I",
  projectId: "e-commerce-shop-25c48",
  messagingSenderId: "861084465044",
  appId: "1:861084465044:web:0f6d68a4982c02ecb0c181",
});

const messaging = firebase.messaging();

// Fires when a push arrives while the tab is closed or backgrounded -
// this is the actual "notify me even when the site isn't open" case,
// the whole reason FCM exists instead of just using the SSE pipeline
// cart-service already has.
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "Herbsvedic", {
    body: body || "",
    icon: "/favicon.ico",
  });
});