import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ITaskForm} from '../../interfaces/task-form.interface';
import {ITask, TTaskCategory} from '../../interfaces/task.interface';
import {TaskService} from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit {

  form: FormGroup<ITaskForm>;

  categories = this.taskService.categoryTypes;

  isLoading$ = this.taskService.isLoading$;

  constructor(private fb: FormBuilder,
              private taskService: TaskService) {
  }

  ngOnInit(): void {
    this._initForm();
  }

  addTask(): void {
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
    const taskObj: ITask = {
      id: new Date().getTime(),
      done: false,
      ...this.form.getRawValue()
    };
    this.taskService.addTask(taskObj);
  }

  getIcon(category: TTaskCategory): string {
    return this.taskService.getTaskIcon(category);
  }

  private _initForm(): void {
    this.form = this.fb.group({
      label: ['', Validators.required],
      description: [''],
      category: [TTaskCategory.Other, Validators.required]
    });
  }
}
