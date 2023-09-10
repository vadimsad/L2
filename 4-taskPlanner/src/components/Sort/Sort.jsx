import React, { useContext, useEffect, useState } from 'react';
import styles from './Sort.module.css';
import { TasksContext } from '../App/App';

const SORT_MODES = {
  none: 'none',
  asc: 'asc',
  desc: 'desc',
};
const SORT_FIELDS = {
  title: 'title',
  dueDate: 'dueDate',
  creationDate: 'creationDate',
};

const Sort = () => {
  const [sorting, setSorting] = useState({
    field: SORT_FIELDS.title,
    mode: SORT_MODES.none,
  });
  const {onSortTasks} = useContext(TasksContext);

  useEffect(() => {
    onSortTasks(sorting);
  }, [sorting])


  function changeSort(sortProperty) {
    if (sorting.field === sortProperty) {
      const currentMode = sorting.mode;
      const modeValues = Object.values(SORT_MODES);
      const currentModeIndex = modeValues.indexOf(currentMode);
      const nextModeIndex = (currentModeIndex + 1) % modeValues.length;
      const nextMode = modeValues[nextModeIndex];

      setSorting({
        field: sortProperty,
        mode: nextMode,
      });
    } else {
      setSorting({
        field: sortProperty,
        mode: SORT_MODES.asc,
      });
    }
  }

  function getSortButtonClassName(field) {
    if (sorting.field === field) {
      return `sort-${sorting.mode}`;
    }
    return `sort-none`;
  }

  return (
    <div className={`task-row ${styles.header}`}>
        <button 
        className={`${styles.taskTitle} ${getSortButtonClassName(SORT_FIELDS.title)} grid-area-title`} 
        type="button" 
        onClick={() => changeSort(SORT_FIELDS.title)}>
          <span>Название</span>
        </button>
        <button 
        className={`${getSortButtonClassName(SORT_FIELDS.dueDate)} grid-area-due`} 
        type="button" 
        onClick={() => changeSort(SORT_FIELDS.dueDate)}>
          <span>Срок</span>
        </button>
        <button 
        className={`${getSortButtonClassName(SORT_FIELDS.creationDate)} grid-area-creation`} 
        type="button" 
        onClick={() => changeSort(SORT_FIELDS.creationDate)}>
          <span>Создано</span>
        </button>
    </div>
  )
}

export default Sort;