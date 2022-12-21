export enum TTaskCategory {
  Bureaucracy = 'bureaucracy',
  House = 'house',
  Other = 'other'
}

export interface ITask {
  id: number;
  label: string;
  description: string;
  category: TTaskCategory;
  done: string | boolean; // string means it's done and contains completion date in ISO format
}
