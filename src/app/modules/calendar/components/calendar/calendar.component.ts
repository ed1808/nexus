import { Component, Input, WritableSignal, signal } from '@angular/core';
import { CalendarDay, daysInitials } from '../../../../utils/calendar.utils';
import { DatePipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { CalendarEvent } from '../../../../models/event.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent {
  @Input({ required: true }) refDate!: Date;

  currentDate: WritableSignal<Date> = signal(new Date);
  daysInMonth: CalendarDay[] = [];
  weekDays = daysInitials;
  calendarRef: number | undefined;

  @Input({ required: true }) events!: CalendarEvent[];

  ngOnInit(): void {
    this._generateCalendar(this.currentDate());
  }

  ngOnDestroy(): void {
    window.clearInterval(this.calendarRef);
  }

  nextMonth(): void {
    this.currentDate.update(() => new Date(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1, 1));
    this._generateCalendar(this.currentDate());
  }

  prevMonth(): void {
    this.currentDate.update(() => new Date(this.currentDate().getFullYear(), this.currentDate().getMonth() - 1, 1));
    this._generateCalendar(this.currentDate());
  }

  private _generateCalendar(date: Date): void {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const startDate = new Date(startOfMonth);
    startDate.setDate(startOfMonth.getDate() - startOfMonth.getDay());

    const endDate = new Date(endOfMonth);
    endDate.setDate(endOfMonth.getDate() + (6 - endOfMonth.getDay()));

    this.daysInMonth = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      if (endOfMonth >= currentDate && startOfMonth <= currentDate) {
        this.daysInMonth.push({
          date: new Date(currentDate),
          today: currentDate.toDateString() === this.refDate.toDateString(),
          currentMonth: true,
          events: [],
        });
      } else {
        this.daysInMonth.push({
          date: new Date(currentDate),
          today: currentDate.toDateString() === this.refDate.toDateString(),
          currentMonth: false,
          events: [],
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    for (let i = 0; i < this.events.length; i++) {
      const startDate = new Date(this.events[i]['start_datetime']!);

      for (let j = 0; j < this.daysInMonth.length; j++) {
        const day = this.daysInMonth[j]['date'];

        if (startDate.toDateString() === day.toDateString()) {
          this.daysInMonth[j]['events'].push(this.events[i]);
          break;
        }
      }
    }
  }
}
