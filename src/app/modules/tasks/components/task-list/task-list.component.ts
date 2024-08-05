import { 
  Component, 
  EventEmitter, 
  Input, 
  Output, 
  Renderer2, 
  ViewChild, 
  ElementRef, 
  inject
} from '@angular/core';
import { NgClass } from '@angular/common';
import { TaskList } from '../../../../models/taskList.model';
import { Task, TaskModalConfig } from '../../../../models/task.model';
import { TaskComponent } from '../task/task.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { 
  ReactiveFormsModule, 
  FormControl, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { TasksService } from '../../../../services/tasks.service';
import { 
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { DialogModule, Dialog } from '@angular/cdk/dialog';
import { modalConfig } from '../../../../utils/modal.utils';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TaskComponent, 
    ButtonComponent, 
    OverlayModule, 
    ReactiveFormsModule,
    DragDropModule,
    DialogModule,
    NgClass
  ],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent {
  private tasksService = inject(TasksService);

  @Input({ required: true }) list!: TaskList;

  @Output() deleteListEvent = new EventEmitter<string>();

  @Output() editListEvent = new EventEmitter<TaskList>();
  @Output() editTaskEvent = new EventEmitter<boolean>();

  @ViewChild('taskListName') taskListName!: ElementRef;
  @ViewChild('editTaskListName') editTaskListName!: ElementRef;
  @ViewChild('newTaskForm') newTaskForm!: ElementRef;
  @ViewChild('newTaskButton') newTaskButton!: ElementRef;

  isOpen: boolean = false;

  updateTaskListNameFormGroup = new FormGroup({
    updateTaskListName: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    })
  });

  newTaskFormGroup = new FormGroup({
    newTaskTitle: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    })
  })

  constructor(private renderer: Renderer2, private dialog: Dialog) {}

  ngOnInit(): void {
    this.updateTaskListNameFormGroup.patchValue({
      updateTaskListName: this.list.title
    });
  }

  deleteList(): void {
    this.deleteListEvent.emit(this.list.id);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data, 
        event.previousIndex, 
        event.currentIndex
      );

      const data = event.container.data;

      Object.keys(data).forEach(key => {
        const numKey = Number(key);
        const updatedTaskPosition: Task = {
          position: numKey + 1
        };

        this._updateTask(data[numKey].id!, updatedTaskPosition);
      });
    } else {
      transferArrayItem(
        event.previousContainer.data, 
        event.container.data, 
        event.previousIndex, 
        event.currentIndex
      );

      const newListId = event.container.id.split('_')[1];
      const newData = event.container.data;
      const prevData = event.previousContainer.data;

      Object.keys(newData).forEach(key => {
        const numKey = Number(key);
        const updatedTaskPosition: Task = {
          position: numKey + 1,
          list_id: newListId
        };

        this._updateTask(newData[numKey].id!, updatedTaskPosition);
      });

      if (prevData.length > 0) {
        Object.keys(prevData).forEach(key => {
          const numKey = Number(key);
          const updatedTaskPosition: Task = {
            position: numKey + 1
          };

          this._updateTask(prevData[numKey].id!, updatedTaskPosition);
        })
      }
    }
  }

  handleUpdateTaskListName(): void {
    if (
      !this.updateTaskListNameFormGroup.valid || 
      this.updateTaskListNameFormGroup.value.updateTaskListName?.trim() === ''
    ) return;

    const newListName = this.updateTaskListNameFormGroup.value.updateTaskListName?.trim();

    if (newListName !== this.list.title) {
      const modifiedList: TaskList = {
        id: this.list.id,
        title: newListName!
      }

      this.editListEvent.emit(modifiedList);
      this.list.title = newListName!;
    }
    this._hideUpdateListNameForm();
  }

  async handleCreateNewTask(): Promise<void> {
    if (!this.newTaskFormGroup.valid || this.newTaskFormGroup.value.newTaskTitle?.trim() === '') return;

    const newTask: Task = {
      title: this.newTaskFormGroup.value.newTaskTitle?.trim(),
      position: this.list.tasks?.length! + 1,
      list_id: this.list.id!
    }
    
    const createdTask = await this._createTask(newTask);
    console.log(createdTask);

    this.hideCreateNewTaskForm();

    this.newTaskFormGroup.patchValue({
      newTaskTitle: ''
    })

    this.list.tasks?.push(createdTask);
  }

  handleDeleteTaskEvent(taskId: string): void {
    const taskModalConfig: TaskModalConfig = {
      entityType: 'task',
      mode: 'delete',
      title: 'Delete task',
      entity: { content: '' }
    }

    const dialogRef = this.dialog.open<string>(ModalComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: taskModalConfig
    });

    dialogRef.closed.subscribe(result => {
      if (result !== undefined) {
        this._deleteTask(taskId);
        this.list.tasks = this.list.tasks?.filter(task => task.id !== taskId);
      }
    })
  }

  hideCreateNewTaskForm(): void {
    this.renderer.removeClass(this.newTaskButton.nativeElement, 'hidden');
    this.renderer.addClass(this.newTaskButton.nativeElement, 'flex');
    this.renderer.removeClass(this.newTaskForm.nativeElement, 'flex');
    this.renderer.addClass(this.newTaskForm.nativeElement, 'hidden');
  }

  showUpdateListNameForm(): void {
    this.renderer.addClass(this.taskListName.nativeElement, 'hidden');
    this.renderer.removeClass(this.editTaskListName.nativeElement, 'hidden');
  }

  showCreateNewTaskForm(): void {
    this.renderer.removeClass(this.newTaskButton.nativeElement, 'flex');
    this.renderer.addClass(this.newTaskButton.nativeElement, 'hidden');
    this.renderer.removeClass(this.newTaskForm.nativeElement, 'hidden');
    this.renderer.addClass(this.newTaskForm.nativeElement, 'flex');
  }

  showTaskDetail(task: Task): void {
    const taskData = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      position: task.position,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      listTitle: this.list.title
    };

    const dialogRef = this.dialog.open(TaskDetailComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: taskData
    });

    dialogRef.closed.subscribe(result => {
      this.editTaskEvent.emit(true);
    })
  }

  private async _createTask(task: Task): Promise<Task> {
    return await this.tasksService.createTask(task);
  }

  private _hideUpdateListNameForm(): void {
    this.renderer.addClass(this.editTaskListName.nativeElement, 'hidden');
    this.renderer.removeClass(this.taskListName.nativeElement, 'hidden');
  }

  private _updateTask(id: string, task: Task): void {
    this.tasksService.updateTask(id, task);
  }

  private _deleteTask(id: string): void {
    this.tasksService.deleteTask(id);
  }
}
