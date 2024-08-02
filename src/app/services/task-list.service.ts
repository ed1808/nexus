import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { TaskList } from '../models/taskList.model';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  constructor() { }

  async getLists(): Promise<TaskList[]> {
    return await invoke<TaskList[]>('get_lists');
  }

  createList(title: string): void {
    const newListData: TaskList = { title };
    invoke('create_list', { listData: newListData });
  }

  async updateList(id: string, title: string): Promise<number> {
    const updatedListData = { title };
    return await invoke<number>('update_list', { id, list: updatedListData });
  }

  async deleteList(id: string): Promise<number> {
    return await invoke<number>('delete_list', { id });
  }
}
