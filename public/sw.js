// Firebase Messaging SW
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyD_VgKQLA6tLLYDd4wRU5PR4c9DxEdQdUk",
    authDomain: "maverick-budget.firebaseapp.com",
    projectId: "maverick-budget",
    storageBucket: "maverick-budget.firebasestorage.app",
    messagingSenderId: "891091568658",
    appId: "1:891091568658:web:5eac14e5ea7945316cb0cb"
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification || {};
    const notificationTitle = title || 'Maverick Budget';
    const notificationOptions = {
          body: body || 'Budget updated',
          icon: icon || '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'maverick-budget-update',
          renotify: true,
          data: payload.data,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Click notification to open app
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
          clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                  for (const client of clientList) {
                            if (client.url.includes(self.location.origin) && 'focus' in client) {
                                        return client.focus();
                            }
                  }
                  return clients.openWindow('/');
          })
        );
});

// Asset caching
const CACHE_NAME = 'maverick-v5';
const PRECACHE = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)));
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
          caches.keys().then(keys =>
                  Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
                                 )
        );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    if (e.request.mode === 'navigate') {
          e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')));
    } else {
          e.respondWith(
                  caches.match(e.request).then(r => r || fetch(e.request).then(res => {
                            const clone = res.clone();
                            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                            return res;
                  }))
                );
    }
});
