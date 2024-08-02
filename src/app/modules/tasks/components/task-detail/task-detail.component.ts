import { 
  Component, 
  Inject, 
  inject, 
  Renderer2, 
  ElementRef, 
  ViewChild 
} from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TasksService } from '../../../../services/tasks.service';
import { Task } from '../../../../models/task.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './task-detail.component.html'
})
export class TaskDetailComponent {
  private tasksService = inject(TasksService);

  @ViewChild('updateDescription') updateDescription!: ElementRef<HTMLFormElement>;
  @ViewChild('descriptionText') descriptionText!: ElementRef<HTMLParagraphElement>;

  updatePriorityFormGroup = new FormGroup({
    priority: new FormControl('')
  });

  updateStatusFormGroup = new FormGroup({
    status: new FormControl('')
  });

  updateDescriptionFormGroup = new FormGroup({
    description: new FormControl('')
  });
  
  constructor(
    private dialogRef: DialogRef,
    private renderer: Renderer2,
    @Inject(DIALOG_DATA) public data: any,
  ) {
    this.updatePriorityFormGroup.patchValue({
      priority: this.data.priority
    });

    this.updateStatusFormGroup.patchValue({
      status: this.data.status
    });

    this.updateDescriptionFormGroup.patchValue({
      description: this.data.description
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  handleSubmit(): void {
    const updatedTask: Task = {
      description: this.updateDescriptionFormGroup.value.description?.trim()
    }

    this.descriptionText.nativeElement.textContent = this.updateDescriptionFormGroup.value.description!.trim();
    this.tasksService.updateTask(this.data.id, updatedTask);
    this.hideUpdateDesc();
  }

  hideUpdateDesc(): void {
    this.renderer.addClass(this.updateDescription.nativeElement, 'hidden');
    this.renderer.removeClass(this.descriptionText.nativeElement, 'hidden');
  }

  updateData(event: Event): void {
    const elem = event.target as HTMLInputElement;
    let updatedTask: Task = {};

    if (elem.id === 'priority') {
      updatedTask.priority = elem.value;
    } else {
      updatedTask.status = elem.value;
    }
    
    this.tasksService.updateTask(this.data.id, updatedTask);
  }

  showUpdateDesc(): void {
    this.renderer.addClass(this.descriptionText.nativeElement, 'hidden');
    this.renderer.removeClass(this.updateDescription.nativeElement, 'hidden');
  }
}
