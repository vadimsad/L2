export const hasNotificationSupport = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
}

export const registerServiceWorker = async (path) => {
    const swRegistration = await navigator.serviceWorker.register(path, { scope: '/' });
    return swRegistration;
}

export const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    return permission;
}

// Функция для отправки уведомлений
export const sendNotifications = (notifications) => {
    if (notifications.length > 0) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.active.postMessage({
                    action: 'sendNotifications',
                    notifications: notifications,
                })
            })
    }
}
