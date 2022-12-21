import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ITask} from '../../interfaces/task.interface';
import {TaskService} from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskItemComponent {
  @Input() task!: ITask;
  @Output() mark = new EventEmitter<ITask>();
  @Output() delete = new EventEmitter<ITask>();

  constructor(private taskService: TaskService) {
  }

  get completionDate(): string {
    return typeof this.task.done === 'string'
      ? this.task.done
      : null;
  }

  get icon(): string {
    return this.taskService.getTaskIcon(this.task.category);
  }

  markTask(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.mark.emit(this.task);
  }

  deleteTask(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.delete.emit(this.task);
  }
}
