import { useContext, useEffect, useState } from 'react';
import { TasksContext } from '../components/App/App';
import { loadNotifiedTasksFromLS, saveNotifiedTasksToLS } from '../services/localstorage';
import { sendNotifications } from '../services/notifications';

const savedNotifiedTasks = loadNotifiedTasksFromLS();

function useTaskNotifications(tasks) {
    // Список задач, о которых уже были уведомления
    const [notifiedTasks, setNotifiedTasks] = useState(savedNotifiedTasks);
    const { onToggleTask, onSnoozeTask } = useContext(TasksContext);

    useEffect(() => {
        navigator.serviceWorker.addEventListener('message', handleNotificationClickMessage);

        // Запуск проверки задач и отправки уведомлений каждые 5 минут
        const intervalId = setInterval(() => {
            const notificationsToBeSent = checkTasksForApproachingDeadline(tasks);
            sendNotifications(notificationsToBeSent);
        }, 3 * 1000); // Один раз в минуту

        // Остановка интервала при размонтировании компонента
        return () => {
            clearInterval(intervalId);
            navigator.serviceWorker.removeEventListener('message', handleNotificationClickMessage)
        };

    }, [tasks, notifiedTasks]);

    useEffect(() => {
        saveNotifiedTasksToLS(notifiedTasks);
    }, [notifiedTasks])

    // Если одно из заданий будет удалено, то важно 
    // также удалить это задание из истории уведомлений,
    // чтобы новое созданное задание не было проигнорировано
    useEffect(() => {
        setNotifiedTasks((prev) => prev.filter(nTaskId => tasks.find(task => task.id === nTaskId)))
    }, [tasks])

    function checkTasksForApproachingDeadline(tasks) {
        const approachingDeadlineNotifications = [];
        const currentTime = Date.now();

        tasks.forEach((task) => {
            // Пропускаем задачу, если она выполнена, находится
            // в состоянии редактирования или о ней уже было уведомление
            if (task.isDone || task.onEdit || notifiedTasks.includes(task.id)) return;

            const timeUntilDeadline = task.dueDate - currentTime;
            const notificationTimeBeforeDeadline = task.notificationTime;

            if (timeUntilDeadline >= 0 && timeUntilDeadline <= notificationTimeBeforeDeadline) {
                approachingDeadlineNotifications.push({
                    title: 'Приближающаяся задача',
                    message: `Задача "${task.title}" скоро закончится.`,
                    taskId: task.id,
                });

                // Добавляем задачу в список уведомленных
                setNotifiedTasks((prev) => [...prev, task.id]);
            }
        });

        return approachingDeadlineNotifications;
    }

    function handleNotificationClickMessage(event) {
        const data = event.data;

        switch (data.action) {
            case 'markAsDone': {
                onToggleTask(data.taskId, true);
                break;
            }
            case 'snooze': {
                onSnoozeTask(data.taskId, 60 * 60 * 1000);
                break;
            }
        }
    }
}


export default useTaskNotifications;