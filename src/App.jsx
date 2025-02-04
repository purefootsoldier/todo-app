import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

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
        <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">To-Do List</h1>
            <div className="flex justify-between items-center mb-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all" onClick={() => setIsModalOpen(true)}>Add Task</button>
                <select className="p-2 border rounded-lg" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <ul className="space-y-3">
                {filteredTasks.map(task => (
                    <li key={task.id} className={`p-4 border rounded-lg flex justify-between items-center transition-all ${task.completed ? 'bg-green-200 line-through' : 'bg-gray-100'}`}>
                        <div>
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <p className="text-gray-600 text-sm">{task.note}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all" onClick={() => toggleTaskStatus(task.id)}>
                                {task.completed ? "Undo" : "Complete"}
                            </button>
                            <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all" onClick={() => openEditModal(task)}>Edit</button>
                            <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all" onClick={() => deleteTask(task.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            {isModalOpen && createPortal(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80">
                        <h2 className="text-xl font-bold mb-4">{editTask ? "Edit Task" : "Add Task"}</h2>
                        <input className="w-full p-2 border rounded-lg mb-2" name="title" placeholder="Title" value={taskInput.title} onChange={handleInputChange} />
                        <textarea className="w-full p-2 border rounded-lg mb-2" name="note" placeholder="Note" value={taskInput.note} onChange={handleInputChange}></textarea>
                        <div className="flex justify-end space-x-2">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all" onClick={addOrUpdateTask}>{editTask ? "Update" : "Add"} Task</button>
                            <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-all" onClick={() => { setIsModalOpen(false); setEditTask(null); }}>Cancel</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ToDoList;
