import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { StopPropagationDirective } from '../../../shared/directives/stop-propagation.directive';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CdkDragPlaceholder, StopPropagationDirective, NgClass],
  templateUrl: './task.component.html'
})
export class TaskComponent {
  @Input({ required: true }) taskTitle!: string;
  @Input({ required: true }) taskId!: string;
  @Input() priority: string = 'none';

  @Output() deleteTaskEvent = new EventEmitter<string>();

  constructor() {}

  deleteTask(): void {
    this.deleteTaskEvent.emit(this.taskId);
  }

  get priorityIndicator(): string {
    const indicatorColor: { [key: string]: string; } = {
      none: 'border-l-transparent',
      low: 'border-l-blue-500',
      mid: 'border-l-yellow-300',
      high: 'border-l-orange-400',
      urgent: 'border-l-red-500'
    }

    return indicatorColor[this.priority];
  }
}
