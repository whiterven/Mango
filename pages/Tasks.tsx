
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { taskService } from '../services/taskService';
import { Task } from '../types';
import { useToast } from '../store/ToastContext';
import { useAuth } from '../hooks/useAuth';

export const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Advanced Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'newest'>('dueDate');

  const [newTask, setNewTask] = useState({ title: '', category: '', dueDate: '', priority: 'medium' as Task['priority'] });
  const { success, error } = useToast();

  const fetchTasks = async () => {
      if (!user) return;
      setLoading(true);
      const data = await taskService.getTasks(user.id);
      setTasks(data);
      setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleAddTask = async () => {
    if (!newTask.title || !user) return;
    
    const timestamp = newTask.dueDate ? new Date(newTask.dueDate).getTime() : undefined;
    const finalCategory = newTask.category.trim() || 'General';
    
    const task = await taskService.saveTask({
        title: newTask.title,
        priority: newTask.priority,
        category: finalCategory,
        dueDate: timestamp
    }, user.id);
    
    if (task) {
        setTasks([task, ...tasks]);
        setNewTask({ title: '', category: '', dueDate: '', priority: 'medium' });
        success("Task added to board");
    } else {
        error("Failed to add task");
    }
  };

  const toggleComplete = async (task: Task) => {
    // Optimistic update
    const updated = tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    
    await taskService.toggleComplete(task.id, task.completed);
    
    if (!task.completed) {
        success("Task completed! 🎉");
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    setTasks(tasks.filter(t => t.id !== id));
    await taskService.deleteTask(id);
  };

  // Derive unique categories
  const categories = useMemo(() => {
      const cats = new Set(tasks.map(t => t.category));
      return ['all', ...Array.from(cats)];
  }, [tasks]);

  const filteredTasks = tasks.filter(t => {
      // Status
      if (statusFilter === 'active' && t.completed) return false;
      if (statusFilter === 'completed' && !t.completed) return false;
      
      // Priority
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      
      // Category
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      
      return true;
  }).sort((a, b) => {
      // Always push completed to bottom if showing all
      if (statusFilter === 'all' && a.completed !== b.completed) return a.completed ? 1 : -1;

      if (sortBy === 'priority') {
          const pMap = { high: 3, medium: 2, low: 1 };
          if (pMap[a.priority] !== pMap[b.priority]) {
              return pMap[b.priority] - pMap[a.priority];
          }
      }
      
      if (sortBy === 'dueDate') {
          if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
      }

      // Fallback / Newest sort
      return b.createdAt - a.createdAt;
  });

  const getPriorityBadge = (p: string) => {
      const styles = {
          high: 'bg-red-500/10 text-red-400 border-red-500/20',
          medium: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          low: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      };
      return (
          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${styles[p as keyof typeof styles]}`}>
              {p}
          </span>
      );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-white">Task Management</h2>
                <p className="text-slate-500 text-sm">Track your creative workflow and deadlines.</p>
            </div>
        </div>

        {/* Input Area */}
        <Card className="border-brand-500/20 bg-slate-900/80">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <Input 
                        label="New Task" 
                        placeholder="e.g. Research competitor hooks" 
                        value={newTask.title} 
                        onChange={e => setNewTask({...newTask, title: e.target.value})}
                    />
                </div>
                <div className="w-full md:w-32">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                    <input 
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        placeholder="e.g. Strategy"
                        value={newTask.category}
                        onChange={e => setNewTask({...newTask, category: e.target.value})}
                        list="category-suggestions"
                    />
                    <datalist id="category-suggestions">
                        {categories.filter(c => c !== 'all').map(c => <option key={c} value={c} />)}
                    </datalist>
                </div>
                <div className="w-full md:w-28">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Priority</label>
                    <select 
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="w-full md:w-36">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Due Date</label>
                    <input 
                        type="date"
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500 [color-scheme:dark]"
                        value={newTask.dueDate}
                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                </div>
                <Button onClick={handleAddTask}>Add Task</Button>
            </div>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-4 items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            {/* Same toolbar code as before */}
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
                <div className="flex bg-slate-800 rounded p-0.5">
                    {['active', 'completed', 'all'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s as any)}
                            className={`px-3 py-1 text-[10px] rounded capitalize transition-colors ${
                                statusFilter === s 
                                ? 'bg-slate-700 text-white font-bold shadow-sm' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
            {/* ... remaining filters ... */}
        </div>

        {/* Task List */}
        <div className="space-y-3">
            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-16 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    <span className="text-sm">No tasks found matching your filters.</span>
                </div>
            ) : (
                filteredTasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`group flex items-center gap-4 p-4 bg-slate-900 border rounded-xl transition-all duration-300 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 ${
                            task.completed 
                            ? 'opacity-50 bg-slate-900/30 border-slate-800/50' 
                            : 'border-slate-800'
                        }`}
                    >
                        <button 
                            onClick={() => toggleComplete(task)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 ${
                                task.completed 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-slate-600 hover:border-brand-500 hover:bg-slate-800'
                            }`}
                        >
                            {task.completed && (
                                <svg className="w-3.5 h-3.5 text-white animate-in zoom-in duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className={`text-sm font-medium text-white transition-all ${task.completed ? 'line-through text-slate-500 decoration-slate-600' : ''}`}>
                                    {task.title}
                                </span>
                                {getPriorityBadge(task.priority)}
                                <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700/50 uppercase tracking-wide font-bold">
                                    {task.category}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                {task.dueDate ? (
                                    <span className={`flex items-center gap-1.5 ${!task.completed && task.dueDate < Date.now() ? 'text-red-400 font-medium' : ''}`}>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        {!task.completed && task.dueDate < Date.now() && <span className="text-[10px] bg-red-900/20 px-1 rounded ml-1">OVERDUE</span>}
                                    </span>
                                ) : (
                                    <span className="text-slate-600 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        No due date
                                    </span>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded hover:bg-slate-800"
                            title="Delete Task"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};
