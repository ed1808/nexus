import { Component, inject } from '@angular/core';
import { TasksService } from '../../../../services/tasks.service';
import { DatePipe } from '@angular/common';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './tasks-table.component.html'
})
export class TasksTableComponent {
  private tasksService = inject(TasksService);

  tasks: Task[] = [];
  hasTasks: boolean = false;

  ngOnInit(): void {
    this._getTasks();
  }

  private _getTasks(): void {
    this.tasksService.getTasks()
      .then(result => {
        this.hasTasks = result.length > 0;
        this.tasks = result;
      })
      .catch(err => console.error(err));
  }
}
