import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { invoke } from '@tauri-apps/api';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor() { }

  async createTask(task: Task): Promise<Task> {
    const newTask = {
      title: task.title,
      description: '',
      priority: '',
      status: 'pending',
      position: task.position,
      updatedAt: '',
      list_id: task.list_id
    };

    return await invoke<Task>('create_task', { taskData: newTask });
  }

  async getTask(id: string): Promise<Task> {
    return await invoke<Task>('get_task', { id });
  }

  async getTasks(): Promise<Task[]> {
    return await invoke<Task[]>('get_tasks');
  }

  async updateTask(id: string, task: Task): Promise<number> {
    return await invoke<number>('update_task', { id, task });
  }

  async deleteTask(id: string): Promise<number> {
    return await invoke<number>('delete_task', { id });
  }
}
