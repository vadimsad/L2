import React, { useContext, useState } from 'react'
import styles from './CreateTask.module.css'
import { TasksContext } from '../App/App'

const CreateTask = () => {
    const {onAddTask} = useContext(TasksContext);

    return (
        <button type='button' className={`${styles.buttonWrapper} task-row`} onClick={onAddTask}>
            <div className={`${styles.createButton} btn-primary`}></div>
            <div className={styles.createText}>Создать задачу</div>
        </button>
    )
}

export default CreateTask