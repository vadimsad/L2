export default function taskReducer(tasks, action) {
    switch (action.type) {
        case 'added': {
            const emptyTask = {
                id: tasks.length > 0 ? findMaxId(tasks) + 1 : 0,
                title: '',
                description: '',
                creationDate: new Date(),
                dueDate: '',
                isDone: false,
                onEdit: true,
                notificationTime: 30 * 60 * 1000
            };

            return [
                ...tasks,
                emptyTask
            ];
        }
        case 'edit_start': {
            return tasks.map(task => {
                if (task.id === action.id) {
                    return { ...task, onEdit: true };
                } else {
                    return task;
                }
            })
        }
        case 'edited': {
            return tasks.map(task => {
                if (task.id === action.task.id) {
                    return { ...action.task, onEdit: false };
                } else {
                    return task;
                }
            })
        }
        case 'toggled': {
            return tasks.map(task => {
                if (task.id === action.id) {
                    return { ...task, isDone: action.isDone };
                } else {
                    return task;
                }
            })
        }
        case 'snoozed': {
            return tasks.map(task => {
                if (task.id === action.id) {
                    const snoozedDate = new Date(task.dueDate.getTime() + action.duration);
                    return { ...task, dueDate: snoozedDate }
                } else {
                    return task;
                }
            })
        }
        case 'sorted': {
            switch (action.mode) {
                case 'asc': {
                    return tasks.toSorted((a, b) => {
                        if (typeof a[action.field] === 'string') {
                            return a[action.field].localeCompare(b[action.field])
                        } else {
                            return a[action.field] - b[action.field];
                        }
                    })
                }
                case 'desc': {
                    return tasks.toSorted((a, b) => {
                        if (typeof a[action.field] === 'string') {
                            return b[action.field].localeCompare(a[action.field])
                        } else {
                            return b[action.field] - a[action.field];
                        }
                    })
                }
                default: {
                    return tasks;
                }
            }
        }
        // case 'notified': {
        //     return tasks.map(task => {
        //         if (task.id === action.id) {
        //             return { ...task, wasNotified: true }
        //         } else {
        //             return task;
        //         }
        //     })
        // }
        case 'deleted': {
            return tasks.filter(task => task.id !== action.id);
        }
        default: {
            throw new Error(`Unknown action: ${action.type}`);
        }
    }
}

function findMaxId(array) {
    let maxID = array[0].id;

    array.forEach(({ id }) => {
        if (id > maxID) {
            maxID = id;
        }
    })

    return maxID;
}