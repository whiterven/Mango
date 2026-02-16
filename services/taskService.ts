
import { getSupabaseClient } from '../lib/supabase';
import { Task } from "../types";

export const taskService = {
  getTasks: async (userId: string): Promise<Task[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Failed to fetch tasks", error);
      return [];
    }

    return data.map((t: any) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      priority: t.priority,
      completed: t.completed,
      dueDate: t.due_date,
      createdAt: new Date(t.created_at).getTime()
    }));
  },

  saveTask: async (task: Omit<Task, 'id' | 'createdAt' | 'completed'>, userId: string): Promise<Task | null> => {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const newTask = {
      user_id: userId,
      title: task.title,
      category: task.category,
      priority: task.priority,
      due_date: task.dueDate,
      completed: false
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();

    if (error) {
      console.error("Failed to save task", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      category: data.category,
      priority: data.priority,
      completed: data.completed,
      dueDate: data.due_date,
      createdAt: new Date(data.created_at).getTime()
    };
  },

  toggleComplete: async (id: string, currentStatus: boolean): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase
      .from('tasks')
      .update({ completed: !currentStatus })
      .eq('id', id);
  },

  deleteTask: async (id: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.from('tasks').delete().eq('id', id);
  }
};
