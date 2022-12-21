import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {combineLatest, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ITask} from '../../interfaces/task.interface';
import {TaskService} from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<ITask[]>;
  isLoading$ = this.taskService.isLoading$;
  errorMessage$ = this.taskService.error$
    .pipe(map(error => error?.message));

  filterForm: FormGroup<{ filter: FormControl<string> }>;
  constructor(private taskService: TaskService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.taskService.getAllTasks();
    this.filterForm = this.fb.group({filter: [null]});
    this.tasks$ = combineLatest([
      this.taskService.tasks$,
      this.filterForm.controls.filter.valueChanges.pipe(startWith(null as string)),
    ]).pipe(map(([tasks, filterText]) => this.taskService.filterTasks(tasks, filterText)));
  }

  markTask(task: ITask): void {
    this.taskService.markTask(task);
  }

  deleteTask(task: ITask): void {
    this.taskService.deleteTask(task.id);
  }

}
