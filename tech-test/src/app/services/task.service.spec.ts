import {HttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {TTaskCategory} from '../interfaces/task.interface';
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

describe('TaskService', () => {

  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService
      ]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
    service = TestBed.inject(TaskService);
  });

  it('should have proper task categories', () => {
    expect(service.categoryTypes).toEqual(EXPECTED_CATEGORIES);
  });

});
