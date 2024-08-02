import { 
  Component, 
  HostBinding, 
  WritableSignal, 
  inject, 
  signal 
} from '@angular/core';
import { 
  trigger, 
  state, 
  style, 
  animate, 
  transition 
} from '@angular/animations';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { CalendarEventsService } from '../../../../services/calendar-events.service';
import { CalendarEvent, CalendarEventModalConfig } from '../../../../models/event.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { modalConfig } from '../../../../utils/modal.utils';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { DialogModule, Dialog } from '@angular/cdk/dialog';
import { EventsListComponent } from '../../components/events-list/events-list.component';
import { DayViewComponent } from '../../components/day-view/day-view.component';


@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CalendarComponent, DayViewComponent, EventsListComponent, ButtonComponent, DialogModule],
  templateUrl: './calendar-page.component.html',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          right: '0px',
        }),
      ),
      state(
        'closed',
        style({
          right: '-288px',
        }),
      ),
      transition('open => closed', [animate('0.2s ease-in-out')]),
      transition('closed => open', [animate('0.2s ease-in-out')]),
    ]),
    trigger('rotateArrow', [
      state(
        'show',
        style({
          transform: 'rotate(0deg)',
          transition: 'rotate'
        }),
      ),
      state(
        'hide',
        style({
          transform: 'rotate(180deg)',
          transition: 'rotate'
        }),
      ),
      transition('hide => show', [animate('0.2s ease-in-out')]),
      transition('show => hide', [animate('0.2s ease-in-out')]),
    ])
  ]
})
export class CalendarPageComponent {
  private eventsService = inject(CalendarEventsService);

  calendarEvents: CalendarEvent[] = [];
  todayEvents: CalendarEvent[] = [];
  currentDate: WritableSignal<Date> = signal(new Date);
  calendarRef: number | undefined;
  showCalendarInfo: WritableSignal<boolean> = signal(false);

  constructor(private dialog: Dialog) {}

  ngOnInit(): void {
    this._getEvents();

    this.calendarRef = window.setInterval(() => {
      this.currentDate.update(() => new Date());

      if (this.currentDate().getHours() === 0 && this.currentDate().getMinutes() === 0) {
        this._getEvents();
      }
    }, 60000);
  }

  deleteListEventHandler(eventId: string): void {
    const calendarEventModalConfig: CalendarEventModalConfig = {
      entityType: 'calendarEvent',
      mode: 'delete',
      title: 'Delete event',
      entity: { content: '' }
    }

    const dialogRef = this.dialog.open<string>(ModalComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: calendarEventModalConfig
    });

    dialogRef.closed.subscribe(result => {
      if (result !== undefined) {
        this._deleteCalendarEvent(eventId);
        this.calendarEvents = this.calendarEvents.filter(calendarEvent => calendarEvent.id !== eventId);
        this.todayEvents = this.todayEvents.filter(todayEvent => todayEvent.id !== eventId);
      }
    })
  }

  openNewEventModal(): void {
    const calendarEventModalConfig: CalendarEventModalConfig = {
      entityType: 'calendarEvent',
      mode: 'create',
      title: 'Add new event',
      entity: { 
        eventTitle: '',
        eventDesc: '',
        startDate: '',
        startHour: '',
        endDate: '',
        endHour: ''
      }
    }

    const dialogRef = this.dialog.open<CalendarEventModalConfig>(ModalComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: calendarEventModalConfig
    });

    dialogRef.closed.subscribe(async result => {
      if (result !== undefined) {
        const startDatetimeString = `${result.entity['startDate']}T${result.entity['startHour']}:00.000Z`;
        const endDatetimeString = `${result.entity['endDate']}T${result.entity['endHour']}:00.000Z`;

        const startDatetimeTmstmp = new Date(startDatetimeString).getTime();
        const endDatetimeTmstmp = new Date(endDatetimeString).getTime();

        const newEvent: CalendarEvent = {
          title: result.entity['eventTitle'],
          description: result.entity['eventDesc'],
          start_datetime: startDatetimeTmstmp.toString(), 
          end_datetime: endDatetimeTmstmp.toString()
        }

        await this._createEvent(newEvent);

        this._getEvents();
      }
    });
  }

  handleRefreshEvents(data: boolean): void {
    if (data) {
      this._getEvents();
    }
  }

  toggleCalendar(): void {
    this.showCalendarInfo.update(prev => !prev);
  }

  private _getEvents(): void {
    this.eventsService.getEvents()
      .then(result => {
        this.calendarEvents = result;
        this.todayEvents = result.filter(calendarEvent => {
          const eventDate = new Date(calendarEvent.start_datetime!);

          return eventDate.toDateString() === this.currentDate().toDateString();
        });
      })
      .catch(error => alert(error));
  }

  private async _createEvent(newEvent: CalendarEvent): Promise<CalendarEvent> {
    return await this.eventsService.createEvent(newEvent);
  }

  private _deleteCalendarEvent(eventId: string): void {
    this.eventsService.deleteEvent(eventId);
  }

  ngOnDestroy(): void {
    window.clearInterval(this.calendarRef);
  }
}
