import { createContext, useReducer } from 'react';
import TaskBlock from '../TaskBlock/TaskBlock';
import taskReducer from '../../reducer/reducer';
import { loadTasksFromLS } from '../../services/localstorage';
import { hasNotificationSupport, registerServiceWorker, requestNotificationPermission } from '../../services/notifications';

const initialTasks = loadTasksFromLS();

export const TasksContext = createContext(null);

const App = () => {

  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  function handleAddTask() {
    dispatch({
      type: 'added'
    });

    // Просим разрешение на уведомления при создании задачи
    if (hasNotificationSupport()) {
      registerServiceWorker('./service-worker.js')
        .then(() => requestNotificationPermission())
    }
  }

  function handleEditStart(id) {
    dispatch({
      type: 'edit_start',
      id
    })
  }

  function handleEditTask(task) {
    dispatch({
      type: 'edited',
      task
    });
  }

  function handleDeleteTask(id) {
    dispatch({
      type: 'deleted',
      id
    });
  }

  function handleToggleTask(id, isDone) {
    dispatch({
      type: 'toggled',
      id,
      isDone
    })
  }

  function handleSnoozeTask(id, duration) {
    dispatch({
      type: 'snoozed',
      id,
      duration
    })
  }

  function handleSortTasks({field, mode}) {
    dispatch({
      type: 'sorted',
      field,
      mode
    })
  }

  return (
    <TasksContext.Provider value={{
      tasks, 
      onAddTask: handleAddTask, 
      onEditStart: handleEditStart,
      onEditTask: handleEditTask, 
      onDeleteTask: handleDeleteTask,
      onToggleTask: handleToggleTask,
      onSnoozeTask: handleSnoozeTask,
      onSortTasks: handleSortTasks,
      }}>
      <TaskBlock />
    </TasksContext.Provider>
  )
}

export default App;