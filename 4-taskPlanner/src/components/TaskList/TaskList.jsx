import React, { useContext, useEffect } from 'react'

import { TasksContext } from '../App/App';
import Task from '../Task/Task';
import EditTask from '../EditTask/EditTask';
import styles from './TaskList.module.css';
import { saveTasksToLS } from '../../services/localstorage';
import useTaskNotifications from '../../hooks/useTaskNotifications';

const TaskList = () => {
    const {tasks} = useContext(TasksContext);

    useEffect(() => {
        saveTasksToLS(tasks);
    }, [tasks])

    useTaskNotifications(tasks);

    return (
        <div className={styles.tasksWrapper}>
            {tasks.map(task => {
                if (task.onEdit) {
                    return <EditTask key={task.id} {...task} />
                }
                return <Task key={task.id} {...task} />
            })}
        </div>
    )
}

export default TaskList