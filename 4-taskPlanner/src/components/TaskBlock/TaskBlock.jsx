import React from 'react';

import Sort from '../Sort/Sort';
import CreateTask from '../CreateTask/CreateTask';
import TaskList from '../TaskList/TaskList';
import styles from './TaskBlock.module.css';

const TaskBlock = () => {
  return (
    <div>
        <h2 className={styles.heading}>Ваши задачи: </h2>
        <Sort />
        <CreateTask />
        <TaskList />
    </div>
  )
}

export default TaskBlock;