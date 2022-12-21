import {FormControl} from '@angular/forms';
import {TTaskCategory} from './task.interface';

export interface ITaskForm {
  label: FormControl<string>;
  description: FormControl<string>;
  category: FormControl<TTaskCategory>;
}

export interface ITaskCategoryOption {
  label: string;
  value: TTaskCategory;
}
