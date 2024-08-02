import { Component, inject } from '@angular/core';
import { TasksService } from '../../../../services/tasks.service';
import { DataSourceTask } from './data-source';
import { CdkTableModule } from '@angular/cdk/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [CdkTableModule, DatePipe],
  templateUrl: './tasks-table.component.html'
})
export class TasksTableComponent {
  private tasksService = inject(TasksService);

  dataSource = new DataSourceTask();
  cols: string[] = ['title', 'description', 'priority', 'status', 'createdAt'];
  hasTasks: boolean = false;

  ngOnInit(): void {
    this._getTasks();
  }

  private _getTasks(): void {
    this.tasksService.getTasks()
      .then(result => {
        this.hasTasks = result.length > 0;
        this.dataSource.init(result);
      })
      .catch(err => console.error(err));
  }
}
