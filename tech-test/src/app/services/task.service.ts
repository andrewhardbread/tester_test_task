import {formatDate} from '@angular/common';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, take, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {ITaskCategoryOption} from '../interfaces/task-form.interface';
import {ITask, TTaskCategory} from '../interfaces/task.interface';

@Injectable({providedIn: 'root'})
export class TaskService {

  readonly categoryTypes: ITaskCategoryOption[] = [
    {
      label: 'House',
      value: TTaskCategory.House
    },
    {
      label: 'Bureaucracy',
      value: TTaskCategory.Bureaucracy
    },
    {
      label: 'Other',
      value: TTaskCategory.Other
    },
  ];

  private tasksSubject = new BehaviorSubject<ITask[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<HttpErrorResponse>(null);

  constructor(private http: HttpClient) {
  }

  get tasks$(): Observable<ITask[]> {
    return this.tasksSubject.asObservable();
  }

  get isLoading$(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  get error$(): Observable<HttpErrorResponse> {
    return this.errorSubject.asObservable();
  }

  getAllTasks(): void {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);
    this.http.get<ITask[]>(`${environment.apiUrl}/tasks`)
      .pipe(
        tap(tasks => {
          this.tasksSubject.next(tasks);
          this.isLoadingSubject.next(false);
        }),
        catchError(this._errorHandler),
        take(1)
      )
      .subscribe();
  }

  addTask(newTask: ITask): void {
    this.isLoadingSubject.next(true);
    this.http.post(`${environment.apiUrl}/tasks`, newTask)
      .pipe(
        tap(() => this.getAllTasks()),
        catchError(this._errorHandler),
        take(1)
      )
      .subscribe();
  }

  markTask(task: ITask): void {
    const patchedTask: ITask = typeof task.done === 'string' // toggling task's "done" prop
      ? { ...task, done: false }
      : { ...task, done: new Date().toISOString() };
    this.isLoadingSubject.next(true);
    this.http.patch(`${environment.apiUrl}/tasks/${task.id}`, patchedTask)
      .pipe(
        tap(() => this.getAllTasks()),
        catchError(this._errorHandler),
        take(1)
      )
      .subscribe();
  }

  deleteTask(taskId: number): void {
    this.isLoadingSubject.next(true);
    this.http.delete(`${environment.apiUrl}/tasks/${taskId}`)
      .pipe(
        tap(() => this.getAllTasks()),
        catchError(this._errorHandler),
        take(1)
      )
      .subscribe();
  }

  getTaskIcon(taskCategory: TTaskCategory): string {
    switch (taskCategory) {
      case TTaskCategory.House: {
        return 'home';
      }
      case TTaskCategory.Bureaucracy: {
        return 'work';
      }
      default: {
        return 'bookmark';
      }
    }
  }

  filterTasks(tasks: ITask[], filterText: string): ITask[] {
    if (!tasks) {
      return [];
    }
    if (!filterText) {
      return tasks;
    }
    return tasks.filter(task => {
      const {id, done, ...taskProps} = task;
      return Object.values(taskProps).some(prop => prop.toLowerCase().includes(filterText.toLowerCase()));
    });
  }

  private _errorHandler(error: HttpErrorResponse): Observable<never> {
    this.isLoadingSubject.next(false);
    this.errorSubject.next(error);
    return throwError(error);
  }
}
