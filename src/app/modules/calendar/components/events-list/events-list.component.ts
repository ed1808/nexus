import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CalendarEvent, ListEvent } from '../../../../models/event.model';
import { DatePipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgClass } from '@angular/common';
import { EventComponent } from '../event/event.component';
import { DialogModule, Dialog } from '@angular/cdk/dialog';
import { EventDetailComponent } from '../event-detail/event-detail.component';
import { modalConfig } from '../../../../utils/modal.utils';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    DatePipe, 
    ScrollingModule, 
    NgClass, 
    EventComponent, 
    DialogModule
  ],
  templateUrl: './events-list.component.html'
})
export class EventsListComponent {
  @Input({ required: true }) events!: CalendarEvent[];
  @Input({ required: true }) refDate!: Date;

  @Output() deleteListEvent = new EventEmitter<string>();
  @Output() refreshEvents = new EventEmitter<boolean>();

  eventsList: ListEvent[] = [];

  constructor(private dialog: Dialog) {}

  ngOnInit(): void {
    this._updateEventsList(this.events);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('events' in changes) {
      const events = changes['events'].currentValue;
      this._updateEventsList(events);
    }
  }

  deleteEventHandler(eventId: string): void {
    this.deleteListEvent.emit(eventId);
  }

  showEventDetail(eventData: ListEvent) {
    const dialogRef = this.dialog.open(EventDetailComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: eventData
    });

    dialogRef.closed.subscribe(result => {
      this.refreshEvents.emit(true);
    });
  }

  private _updateEventsList(events: CalendarEvent[]): void {
    const currentHour = new Date().getHours();

    if (this.eventsList.length > 0) {
      this.eventsList = [];
    }

    for (let i = 0; i < events.length; i++) {
      const eventStartHour = new Date(events[i].start_datetime!);
      const eventEndHour = new Date(events[i].end_datetime!);
      let time = '';

      if (eventStartHour.getTime() >= this.refDate.getTime()) {
        time = 'current';
      } else {
        time = 'past';
      }

      this.eventsList.push({
        id: events[i].id!,
        title: events[i].title!,
        description: events[i].description,
        start_datetime: events[i].start_datetime!,
        end_datetime: events[i].end_datetime!,
        created_at: events[i].created_at!,
        time
      });
    }
  }
}
