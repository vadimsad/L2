import { createContext, useEffect, useReducer } from 'react';
import TaskBlock from '../TaskBlock/TaskBlock';
import taskReducer from '../../reducer/reducer';
import { loadTasksFromLS } from '../../services/taskService';

const initialTasks = loadTasksFromLS();

export const TasksContext = createContext(null);

const App = () => {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  // function checkTaskDeadlines() {
  //   if ('PushManager' in window) {
  //     navigator.serviceWorker.ready.then(function(registration) {
  //       registration.pushManager.subscribe({ userVisibleOnly: true })
  //         .then(function(subscription) {
  //           console.log('Подписка на push-уведомления успешно выполнена.');
  //         })
  //         .catch(function(error) {
  //           console.error('Ошибка при подписке на push-уведомления:', error);
  //         });
  //     });
  //   }
  // }

  // checkTaskDeadlines(

  function handleAddTask() {
    dispatch({
      type: 'added'
    });
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
      onSortTasks: handleSortTasks,
      }}>
      <TaskBlock />
    </TasksContext.Provider>
  )
}

export default App;