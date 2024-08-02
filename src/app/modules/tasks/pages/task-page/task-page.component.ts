import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TaskListService } from '../../../../services/task-list.service';
import { TaskList, TaskListModalConfig } from '../../../../models/taskList.model';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { modalConfig } from '../../../../utils/modal.utils';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [ButtonComponent, TaskListComponent, DialogModule, CdkDropListGroup],
  templateUrl: './task-page.component.html'
})
export class TaskPageComponent {
  private taskListService = inject(TaskListService);

  taskLists: TaskList[] = [];

  constructor(private dialog: Dialog) {}

  ngOnInit(): void {
    this._getLists();
  }

  openNewListModal(): void {
    const taskListModalConfig: TaskListModalConfig = {
      entityType: 'taskList',
      mode: 'create',
      title: 'Add new list',
      entity: { content: '' }
    }

    const dialogRef = this.dialog.open<TaskListModalConfig>(ModalComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: taskListModalConfig
    });

    dialogRef.closed.subscribe(result => {
      if (result !== undefined) {
        this._createList(result.entity['content']);
        this._getLists();
      }
    })
  }

  handleDeleteListEvent(listId: string): void {
    const taskListModalConfig: TaskListModalConfig = {
      entityType: 'taskList',
      mode: 'delete',
      title: 'Delete list',
      entity: { content: '' }
    }

    const dialogRef = this.dialog.open<string>(ModalComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: taskListModalConfig
    });

    dialogRef.closed.subscribe(result => {
      if (result !== undefined) {
        this._deleteList(listId);
        this.taskLists = this.taskLists.filter(list => list.id !== listId)
      }
    });
  }

  handleEditListEvent(listData: TaskList): void {
    this._updateList(listData.id!, listData.title);
  }

  handleEditTaskEvent(data: boolean): void {
    if (data) {
      this._getLists();
    }
  }

  private _getLists(): void {
    this.taskListService.getLists()
      .then(results => {
        this.taskLists = results;
      })
      .catch(error => alert(error));
  }

  private _createList(title: string): void {
    this.taskListService.createList(title);
  }

  private _deleteList(listId: string): void {
    this.taskListService.deleteList(listId);
  }

  private _updateList(listId: string, newTitle: string): void {
    this.taskListService.updateList(listId, newTitle);
  }
}
