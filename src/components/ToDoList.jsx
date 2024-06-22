import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTodolist, addTodo, sortTodo, updateTodo, toggleCompleted } from '../ToDoSlice';
import { TiPencil } from 'react-icons/ti';
import { BsTrash } from 'react-icons/bs';
import empty from '../assets/empty.jpg';

function ToDoList() {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todo.todoList);
  const sortCriteria = useSelector((state) => state.todo.sortCriteria);
  const [showModal, setShowModal] = useState(false);
  const [currentToDo, setCurrentToDo] = useState(null);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (todoList.length > 0) {
      localStorage.setItem('todoList', JSON.stringify(todoList));
    }
  }, [todoList]);

  useEffect(() => {
    const localTodoList = JSON.parse(localStorage.getItem('todoList'));
    if (localTodoList) {
      dispatch(setTodolist(localTodoList));
    }
  }, [dispatch]);

  const handleAddToDo = (task) => {
    if (task.trim().length === 0) {
      alert('Please enter a task');
    } else {
      dispatch(
        addTodo({
          task: task,
          id: Date.now(),
        })
      );
      setNewTask('');
      setShowModal(true);
    }
  };

  const handleUpdatetoDoList = (id, task) => {
    if (task.trim().length === 0) {
      alert('Please enter a task');
    } else {
      dispatch(
        updateTodo({
          task: task,
          id: id,
        })
      );
      setCurrentToDo(null);
      setNewTask('');
      setShowModal(false);
    }
  };
  const handleDeleteToDo = (id) => {
    const updatedToDoList = todoList.filter(todo => todo.id != id );
    dispatch(setTodolist(updatedToDoList));
    localStorage.setItem("todoList", JSON.stringify(updatedToDoList));
  };

  const handleSort = (sortCriteria) => {
    dispatch(sortTodo(sortCriteria));
  };

  const sortedToDoList = todoList.filter((todo) => {
    if (sortCriteria === 'All') return true;
    if (sortCriteria === 'completed' && todo.completed) return true;
    if (sortCriteria === 'Not completed' && !todo.completed) return true;
    return false;
  });

  const handleToggleCompletd = (id) => {
    dispatch(toggleCompleted({id }))
  }

  return (
    <div>
      {showModal && (
        <div className="fixed w-full left-0 top-0 h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md">
            <input
              type="text"
              className="border p-2 rounded-md outline-none mb-8 w-full"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder={currentToDo ? 'Update your task here' : 'Enter your task here'}
            />
            <div className="flex justify-between">
              {currentToDo ? (
                <>
                   <button
                    onClick={() => handleUpdatetoDoList(currentToDo.id, newTask)}
                  >
                    Save
                  </button>
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="bg-Tangaroa rounded-md text-white py-3 px-10" onClick={() => setShowModal(false)}>Cancel</button>
                  <button
                    className="bg-sunsetOrange rounded-md text-white py-3 px-10"
                    onClick={() => handleAddToDo(newTask)}
                  >
                    Add
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center flex-col">
        {todoList.length === 0 ? (
          <div className="mb-8">
            <div className="sm:w-[450px] sm:h-[450px] min-w-[225px]">
              <img src={empty} alt="empty" className="" />
            </div>
            <p className="text-center text-Gray">You have no todo's, please add one</p>
          </div>
        ) : (
         <div className='container mx-auto mt-6'>
              <div className='flex justify-center mb-6'>
                <select onChange={e => handleSort(e.target.value)} className='p-1 outline-none text-sm'>
                <option value="All" className='text-sm'>All</option>
                <option value="completed" className='text-sm'>Completed</option>
                <option value="Not completed" className='text-sm'>Not Completed</option>
                </select>
            </div>
             <div>
            {sortedToDoList.map((todo) => (
              <div key={todo.id} className='flex items-center justify-between mb-6 bg-Tangaroa mx-auto w-full md:w-[75%] rounded-md p-4'>

                <div className={`${
                    todo.completed ? "line-through text-greenTeal" : 
                    "text-sunsetOrange"}`}
                 onClick={() => {handleToggleCompletd(todo.id)
                }}>{todo.task}
                </div>

                <div>
                    <button className='bg-blue-500 text-white p-1 rounded-md ml-2' onClick={()=> {
                        setShowModal(true); setCurrentToDo(todo); setNewTask(todo.task);
                    }}>
                        <TiPencil />
                    </button>

                    <button className='bg-sunsetOrange text-white p-1 rounded-md ml-2' onClick={()=> handleDeleteToDo(todo.id)}>
                    <BsTrash />
                    </button>
                </div>
              </div>
            ))}
          </div>
         </div>
        )}
      </div>
      <div className="flex justify-center">
        <button
          className="bg-sunsetOrange text-white py-3 px-10 rounded-md"
          onClick={() => setShowModal(true)}
        >
          Add Task
        </button>
      </div>
    </div>
  );
}

export default ToDoList;
