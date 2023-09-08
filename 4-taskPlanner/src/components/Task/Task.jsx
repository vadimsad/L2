import React, { useContext } from 'react'

import styles from './Task.module.css';
import { TasksContext } from '../App/App';
import {formatDateToDisplay} from '../../utils/formatDate';

const Task = ({id, title, description, creationDate, dueDate, isDone}) => {
  const {onToggleTask, onEditStart, onDeleteTask} = useContext(TasksContext);

  function handleTaskToggle(event) {
    const isTaskDone = event.target.checked;
    onToggleTask(id, isTaskDone);
  }

  function handleEditStart() {
    onEditStart(id)
  }

  function handleDelete() {
    onDeleteTask(id);
  }

  const dueDateFormatted = formatDateToDisplay(dueDate);
  const creationDateFormatted = formatDateToDisplay(creationDate);

  return (
    <label className={`task-row ${styles.item} ${isDone ? styles.done : ''}`}>
        <input type="checkbox" checked={isDone} onChange={handleTaskToggle}/>
        <span className='custom-checkbox'></span>
        <div className={`${styles.prop} grid-area-title`}>
            <div className={styles.title}>{title}</div>
            {description}
        </div>
        <div className={`${styles.prop} ${styles.centered} grid-area-due`}>{dueDateFormatted}</div>
        <div className={`${styles.prop} ${styles.centered} grid-area-creation`}>{creationDateFormatted}</div>
        <button type="button" className={`${styles.edit} btn-primary`} onClick={handleEditStart}></button>
        <button type="button" className={`${styles.delete} btn-primary`} onClick={handleDelete}></button>
    </label>
  )
}

export default Task