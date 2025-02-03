import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import "./App.css"
const TASKS_STORAGE_KEY = "tasks";

const ToDoList = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const [taskInput, setTaskInput] = useState({ title: "", note: "" });
    const [filter, setFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);

    useEffect(() => {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const handleInputChange = (e) => {
        setTaskInput({ ...taskInput, [e.target.name]: e.target.value });
    };

    const addOrUpdateTask = () => {
        if (!taskInput.title.trim()) return;

        if (editTask) {
            setTasks(tasks.map(task => task.id === editTask.id ? { ...task, ...taskInput } : task));
            setEditTask(null);
        } else {
            setTasks([...tasks, { id: uuidv4(), ...taskInput, completed: false }]);
        }

        setTaskInput({ title: "", note: "" });
        setIsModalOpen(false);
    };

    const toggleTaskStatus = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const openEditModal = (task) => {
        setTaskInput({ title: task.title, note: task.note });
        setEditTask(task);
        setIsModalOpen(true);
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => setIsModalOpen(true)}>Add Task</button>
            <select className="mb-4 p-2 border rounded" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>
            <ul className="space-y-2">
                {filteredTasks.map(task => (
                    <li key={task.id} className={`p-3 border rounded ${task.completed ? 'bg-green-200 line-through' : ''}`}>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p>{task.note}</p>
                        <button className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded" onClick={() => toggleTaskStatus(task.id)}>
                            {task.completed ? "Undo" : "Complete"}
                        </button>
                        <button className="mr-2 px-3 py-1 bg-blue-500 text-white rounded" onClick={() => openEditModal(task)}>Edit</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {isModalOpen && createPortal(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">{editTask ? "Edit Task" : "Add Task"}</h2>
                        <input className="w-full p-2 border rounded mb-2" name="title" placeholder="Title" value={taskInput.title} onChange={handleInputChange} />
                        <textarea className="w-full p-2 border rounded mb-2" name="note" placeholder="Note" value={taskInput.note} onChange={handleInputChange}></textarea>
                        <div className="flex justify-end space-x-2">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={addOrUpdateTask}>{editTask ? "Update" : "Add"} Task</button>
                            <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => { setIsModalOpen(false); setEditTask(null); }}>Cancel</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ToDoList;
