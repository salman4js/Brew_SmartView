// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        // Perform any static caching here, if needed.
        caches.open('my-cache').then((cache) => {

        })
    );
});

self.addEventListener('activate', (event) => {
    // Clean up any old caches if needed
});

self.addEventListener('message', (event) => {
    const notificationTimings = event.data.timings;
    notificationTimings.length > 0 && notificationTimings.forEach((key) => {
        const [hours, minutes] = key.split(':');
        const notificationTime = new Date();
        notificationTime.setHours(parseInt(hours, 10));
        notificationTime.setMinutes(parseInt(minutes, 10));

        const currentTime = new Date();
        const timeDifference = notificationTime.getTime() - currentTime.getTime();
        if (timeDifference > 0) {
            setTimeout(() => {
                self.registration.showNotification(event.data.messageTitle, {
                    body: event.data.messageBody,
                }).then(r => {

                });
            }, timeDifference);
        }
    });
});
