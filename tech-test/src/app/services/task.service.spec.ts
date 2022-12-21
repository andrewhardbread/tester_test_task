import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {ITask, TTaskCategory} from '../interfaces/task.interface';
import {TaskService} from './task.service';

const EXPECTED_CATEGORIES = [
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

const TASKS: ITask[] = [
  {
    id: 1,
    label: 'Kitchen Cleanup',
    description: 'Clean my dirty kitchen',
    category: TTaskCategory.House,
    done: false
  },
  {
    id: 2,
    label: 'Taxes',
    description: 'Start doing my taxes and contact my accountant jhon for advice',
    category: TTaskCategory.Bureaucracy,
    done: '2022-12-21T16:40:08.549Z'
  },
  {
    id: 1671640124125,
    done: '2022-12-21T16:28:48.280Z',
    label: 'Do test task',
    description: 'Successfully implement all required functionality',
    category: TTaskCategory.Other
  }
];

describe('TaskService', () => {

  let httpClient: HttpClient;
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TaskService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should have category types with correct options', () => {
    expect(service.categoryTypes)
      .withContext('category types are correct')
      .toEqual(EXPECTED_CATEGORIES);
  });

  // it('should have empty tasks list', (done: DoneFn) => {
  //   service.tasks$.subscribe({
  //     next: (tasks) => expect(tasks).withContext('tasks are empty').toEqual([]),
  //     error: done.fail
  //   });
  // });
  //
  // it('should not be in loading state', (done: DoneFn) => {
  //   service.isLoading$.subscribe({
  //     next: (isLoading) => expect(isLoading).withContext('isLoading is false').toBeFalse(),
  //     error: done.fail
  //   });
  // });

  it('should return correct icon for each task category', () => {
    const houseIcon = service.getTaskIcon(TTaskCategory.House);
    expect(houseIcon)
      .withContext('house icon is correct')
      .toEqual('home');

    const bureaucracyIcon = service.getTaskIcon(TTaskCategory.Bureaucracy);
    expect(bureaucracyIcon)
      .withContext('bureaucracy icon is correct')
      .toEqual('work');

    const otherIcon = service.getTaskIcon(TTaskCategory.Other);
    expect(otherIcon)
      .withContext('other icon is correct')
      .toEqual('bookmark');
  });

  it('should filter tasks correctly', () => {
    let filteredTasks = service.filterTasks(TASKS, '');
    expect(filteredTasks)
      .withContext('showing all tasks for empty filter term')
      .toEqual(TASKS);

    filteredTasks = service.filterTasks(TASKS, 'kitchen');
    expect(filteredTasks)
      .withContext('showing the task, which contains term "kitchen"')
      .toEqual([{
        id: 1,
        label: 'Kitchen Cleanup',
        description: 'Clean my dirty kitchen',
        category: TTaskCategory.House,
        done: false
      }]);

    filteredTasks = service.filterTasks(TASKS, 'stub value');
    expect(filteredTasks)
      .withContext('showing no tasks for non-existing search term')
      .toEqual([]);
  });
});
