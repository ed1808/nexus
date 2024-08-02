import { Component, Inject, inject, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CalendarEvent } from '../../../../models/event.model';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CalendarEventsService } from '../../../../services/calendar-events.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [DatePipe, ButtonComponent, ReactiveFormsModule],
  templateUrl: './event-detail.component.html'
})
export class EventDetailComponent {
  private eventsService = inject(CalendarEventsService);
  
  @ViewChild('descriptionText') descriptionText!: ElementRef<HTMLParagraphElement>;
  @ViewChild('updateDescription') updateDescription!: ElementRef<HTMLFormElement>;

  updateDescriptionFormGroup = new FormGroup({
    description: new FormControl('')
  });

  updateStartDatetimeFormGroup = new FormGroup({
    startDate: new FormControl(''),
    startHour: new FormControl(''),
  });

  updateEndDatetimeFormGroup = new FormGroup({
    endDate: new FormControl(''),
    endHour: new FormControl(''),
  });

  eventDatesInfo: { [key: string]: string } = {
    eventStartDate: '',
    eventStartHour: '',
    eventEndDate: '',
    eventEndHour: '',
  }

  constructor(
    private dialogRef: DialogRef, 
    private renderer: Renderer2, 
    @Inject(DIALOG_DATA) public data: CalendarEvent
  ) {
    const [startDate, startHour] = this.data.start_datetime!.split('T');
    const [endDate, endHour] = this.data.end_datetime!.split('T');

    this.eventDatesInfo['eventStartDate'] = startDate;
    this.eventDatesInfo['eventStartHour'] = startHour.substring(0, 5);
    this.eventDatesInfo['eventEndDate'] = endDate;
    this.eventDatesInfo['eventEndHour'] = endHour.substring(0, 5);

    this.updateDescriptionFormGroup.patchValue({
      description: this.data.description
    });

    this.updateStartDatetimeFormGroup.patchValue({
      startDate,
      startHour,
    });

    this.updateEndDatetimeFormGroup.patchValue({
      endDate,
      endHour,
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  showUpdateDesc(): void {
    this.renderer.addClass(this.descriptionText.nativeElement, 'hidden');
    this.renderer.removeClass(this.updateDescription.nativeElement, 'hidden');
  }

  hideUpdateDesc(): void {
    this.renderer.addClass(this.updateDescription.nativeElement, 'hidden');
    this.renderer.removeClass(this.descriptionText.nativeElement, 'hidden');
  }

  handleSubmit(): void {
    const [startDate, startHour] = this.data.start_datetime!.split('T');
    const [endDate, endHour] = this.data.end_datetime!.split('T');

    const startDatetime = `${startDate}T${startHour}.000Z`;
    const endDatetime = `${endDate}T${endHour}.000Z`;

    const updatedEvent: CalendarEvent = {
      description: this.updateDescriptionFormGroup.value.description?.trim(),
      start_datetime: new Date(startDatetime).getTime().toString(),
      end_datetime: new Date(endDatetime).getTime().toString(),
    }

    this.descriptionText.nativeElement.textContent = this.updateDescriptionFormGroup.value.description!.trim();
    this.eventsService.updateEvent(this.data.id!, updatedEvent);
    this.hideUpdateDesc();
  }

  updateData(event: Event): void {
    const elem = event.target as HTMLInputElement;
    const currentDate = new Date();

    this.eventDatesInfo[`${elem.id}`] = elem.value;

    const startDatetime = new Date(`${this.eventDatesInfo['eventStartDate']}T${this.eventDatesInfo['eventStartHour']}`);
    const endDatetime = new Date(`${this.eventDatesInfo['eventEndDate']}T${this.eventDatesInfo['eventEndHour']}`);

    if (startDatetime < currentDate) {
      alert('Start datetime must be equal or greater than current datetime');
      return;
    }

    if (endDatetime < startDatetime) {

      const newEndDatetime = new Date(startDatetime.getTime() + 3600000);
      
      const year = newEndDatetime.getFullYear();
      const month = newEndDatetime.getMonth() + 1 < 10 ? `0${newEndDatetime.getMonth() + 1}` : newEndDatetime.getMonth() + 1;
      const day = newEndDatetime.getDate() < 10 ? `0${newEndDatetime.getDate()}` : newEndDatetime.getDate();
      const hours = newEndDatetime.getHours() < 10 ? `0${newEndDatetime.getHours()}` : newEndDatetime.getHours();
      const minutes = newEndDatetime.getMinutes() < 10 ? `0${newEndDatetime.getMinutes()}` : newEndDatetime.getMinutes();

      const endDate = `${year}-${month}-${day}`;
      const endHour = `${hours}:${minutes}`;

      this.updateEndDatetimeFormGroup.patchValue({
        endDate,
        endHour,
      });

      this.eventDatesInfo['eventEndDate'] = endDate;
      this.eventDatesInfo['eventEndHour'] = endHour;
    }

    const eventNewStartDatetime = new Date(`${this.eventDatesInfo['eventStartDate']}T${this.eventDatesInfo['eventStartHour']}:00.000Z`);
    const eventNewEndDatetime = new Date(`${this.eventDatesInfo['eventEndDate']}T${this.eventDatesInfo['eventEndHour']}:00.000Z`);

    const updatedEvent: CalendarEvent = {
      start_datetime: eventNewStartDatetime.getTime().toString(),
      end_datetime: eventNewEndDatetime.getTime().toString()
    }

    this.eventsService.updateEvent(this.data.id!, updatedEvent);
  }
}
