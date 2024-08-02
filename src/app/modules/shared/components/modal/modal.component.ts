import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { NoteModalConfig } from '../../../../models/note.model';
import { TaskListModalConfig } from '../../../../models/taskList.model';
import { TaskModalConfig } from '../../../../models/task.model';
import { CalendarEventModalConfig } from '../../../../models/event.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  

  constructor(
    private dialogRef: DialogRef<NoteModalConfig | TaskListModalConfig | TaskModalConfig | CalendarEventModalConfig | any>,
    @Inject(DIALOG_DATA) public data: NoteModalConfig | TaskListModalConfig | TaskModalConfig | CalendarEventModalConfig
  ) {}

  closeModal() {
    this.dialogRef.close();
  }

  handleSubmit() {
    this.dialogRef.close(this.data);
  }

  handleDelete() {
    this.dialogRef.close('delete');
  }
}
