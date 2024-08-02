import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListEvent } from '../../../../models/event.model';
import { NgClass } from '@angular/common';
import { DatePipe } from '@angular/common';
import { StopPropagationDirective } from '../../../shared/directives/stop-propagation.directive';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [DatePipe, NgClass, StopPropagationDirective],
  templateUrl: './event.component.html'
})
export class EventComponent {
  @Input({ required: true }) event!: ListEvent;

  @Output() deleteEvent = new EventEmitter<string>();

  deleteListEvent(): void {
    this.deleteEvent.emit(this.event.id);
  }
}
