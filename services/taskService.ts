
import { Task } from "../types";

const KEY = 'mango_tasks';

export const taskService = {
  getTasks: (): Task[] => {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const tasks = taskService.getTasks();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now()
    };
    const updated = [newTask, ...tasks];
    localStorage.setItem(KEY, JSON.stringify(updated));
    return newTask;
  },

  toggleComplete: (id: string) => {
    const tasks = taskService.getTasks();
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  },

  deleteTask: (id: string) => {
    const tasks = taskService.getTasks().filter(t => t.id !== id);
    localStorage.setItem(KEY, JSON.stringify(tasks));
    return tasks;
  }
};
