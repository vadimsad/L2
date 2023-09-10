self.addEventListener('notificationclick', async (event) => {
    const action = event.action;
    const taskId = event.notification.data.taskId;

    const notificationClickData = { action, taskId }

    // Теперь, когда Service Worker активен и контролирует страницы,
    // отправляем сообщения клиентам

    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            if (client.type === 'window' && 'focus' in client) {
                // Отправляем сообщение только активным окнам
                client.postMessage(notificationClickData);
            }
        })
    })
})

self.addEventListener("activate", (event) => {
    // Устанавливаем контроль над страницами немедленно
    event.waitUntil(clients.claim());
});

self.addEventListener('message', (event) => {
    const data = event.data;
    if (data.action === 'sendNotifications') {
        const notifications = data.notifications;

        // Отправить уведомления
        notifications.forEach((notification) => {
            self.registration.showNotification(notification.title, {
                body: notification.message,
                icon: './hourglass.svg',
                actions: [
                    { action: 'snooze', title: 'Отложить на час' },
                    { action: 'markAsDone', title: 'Выполнить' },
                ],
                data: { taskId: notification.taskId }
            });
        });
    }
});

self.addEventListener('install', () => {

})
