import { Component, WritableSignal, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotesService } from '../../../../services/notes.service';
import { NoteComponent } from '../../../notes/components/note/note.component';
import { Note } from '../../../../models/note.model';
import { CalendarEventsService } from '../../../../services/calendar-events.service';
import { CalendarEvent } from '../../../../models/event.model';
import { TasksTableComponent } from '../../components/tasks-table/tasks-table.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [DatePipe, NoteComponent, TasksTableComponent],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
  private notesService = inject(NotesService);
  private calendarEventsService = inject(CalendarEventsService);

  clock: WritableSignal<Date> = signal(new Date);
  clockRef: number | undefined;
  note: Note | undefined;
  calendarEvent: CalendarEvent | undefined;

  ngOnInit() {
    this.clockRef = window.setInterval(() => {
      this.clock.update(() => new Date());
    }, 1000);

    this._getLastNote();
    this._getLastCalendarEvent();
  }

  private _getLastCalendarEvent(): void {
    this.calendarEventsService.getLastEvent()
      .then(result => {
        this.calendarEvent = result;
      })
      .catch(err => console.error(err));
  }

  private _getLastNote(): void {
    this.notesService.getLastNote()
      .then(result => {
        this.note = result;
      })
      .catch(err => console.error(err));
  }

  ngOnDestroy() {
    window.clearInterval(this.clockRef);
  }
}
