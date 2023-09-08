const LOCALSTORAGE_KEY = 'tasks-dfgh1fd56t5dgh';

export const saveTasksToLS = (tasks) => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tasks));
};

export const loadTasksFromLS = () => {
    const savedTasks = localStorage.getItem(LOCALSTORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks).map(task => ({ ...task, dueDate: new Date(task.dueDate), creationDate: new Date(task.creationDate) })) : [];
};