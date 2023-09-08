import React, { useContext, useState } from 'react'

import { TasksContext } from '../App/App';
import { formatDateToInputDate } from '../../utils/formatDate';
import styles from './EditTask.module.css';

const EditTask = ({id, title, description, creationDate, dueDate, onEdit}) => {

  const defaultDueDate = dueDate ? formatDateToInputDate(new Date(dueDate)) : '';

  const {onEditTask, onDeleteTask} = useContext(TasksContext);
  const [titleValue, setTitleValue] = useState(title);
  const [descriptionValue, setdDescriptionValue] = useState(description);
  const [dueDateValue, setdDueDateValue] = useState(defaultDueDate);

  function handleTitleChange(changeEvent) {
    const newValue = changeEvent.target.value;
    setTitleValue(newValue);
  }

  function handleDescriptionChange(changeEvent) {
    const newValue = changeEvent.target.value;
    setdDescriptionValue(newValue);
  }

  function handleDueDateChange(changeEvent) {
    const newValue = changeEvent.target.value;
    setdDueDateValue(newValue);
  }

  function handleSaveTask(event) {
    event.preventDefault();

    const editedTask = {
      id,
      title: titleValue,
      description: descriptionValue,
      creationDate: creationDate || new Date(),
      dueDate: new Date(dueDateValue),
      onEdit,
      isDone: false,
    }
    onEditTask(editedTask);
  }

  function handleDelete() {
    onDeleteTask(id);
  }

  return (
    <form className={`task-row ${styles.form}`} onSubmit={handleSaveTask} >
        <div></div>
        <div className={`${styles.descriptionBlock} ${styles.inputBlock} grid-area-title`}>
            <label className={styles.label}>
              <span>Название задачи*</span>
              <input type="text" value={titleValue} onChange={handleTitleChange} placeholder='Введите название' autoFocus required />
            </label>
            <label className={styles.label}>
              <span>Описание задачи</span>
              <textarea type="text" cols="30" rows="5" value={descriptionValue} onChange={handleDescriptionChange} placeholder='Введите описание' />
            </label>
        </div>
        <div className={`${styles.inputBlock} ${styles.dateInput}`}>
          <label className={styles.label}>
            <span>Срок выполнения*</span>
            <input type="datetime-local" value={dueDateValue} onChange={handleDueDateChange} required />
          </label>
        </div>
        <button type="submit" className={`btn-primary`}></button>
        <button type="button" className={`${styles.delete} btn-primary`} onClick={handleDelete}></button>
    </form>
  )
}

export default EditTask;