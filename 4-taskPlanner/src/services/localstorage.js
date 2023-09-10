const LOCALSTORAGE__TASKS = 'tasks';
const LOCALSTORAGE_NOTIFIED_TASKS = 'tasks-notified';

export const saveTasksToLS = (tasks) => {
    localStorage.setItem(LOCALSTORAGE__TASKS, JSON.stringify(tasks));
};

export const loadTasksFromLS = () => {
    const savedTasks = localStorage.getItem(LOCALSTORAGE__TASKS);
    return savedTasks ? JSON.parse(savedTasks).map(task => ({ ...task, dueDate: new Date(task.dueDate), creationDate: new Date(task.creationDate) })) : [];
};

export const saveNotifiedTasksToLS = (notifiedTasks) => {
    localStorage.setItem(`${LOCALSTORAGE_NOTIFIED_TASKS}`, JSON.stringify(notifiedTasks));
}

export const loadNotifiedTasksFromLS = () => {
    const savedTasks = localStorage.getItem(LOCALSTORAGE_NOTIFIED_TASKS);
    return savedTasks ? JSON.parse(savedTasks) : [];
};