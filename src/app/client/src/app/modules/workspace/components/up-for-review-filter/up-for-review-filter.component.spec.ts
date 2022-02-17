import { UpforReviewFilterComponent } from './up-for-review-filter.component';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, PaginationService, ToasterService, ResourceService, ConfigService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from '@sunbird/test-util';

describe('UpforReviewFilterComponent', () => {
  let component: UpforReviewFilterComponent;
  let fixture: ComponentFixture<UpforReviewFilterComponent>;
  let inputEl: DebugElement;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
    'queryParams': observableOf({ subject: ['english', 'odia'] })
  };
  configureTestSuite();
  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpforReviewFilterComponent ],
      imports: [HttpClientTestingModule, SharedModule.forRoot()],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpforReviewFilterComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input[class="upForReviewSearchBox"]'));
    fixture.detectChanges();
  });
  it('should call removeFilterSelection method ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = { subject: ['english'] };
      const queryParams = {subject: [ ]};
     component.removeFilterSelection('subject', 'english');
     fixture.detectChanges();
     expect(route.navigate).toHaveBeenCalledWith(['workspace/content/upForReview', 1], {queryParams: queryParams});
  }));
  it('should call applySorting method ', inject([ConfigService, Router],
    (configService, route) => {
      const sortByOption = 'Created On';
      const queryParams = {subject: [ 'english', 'odia' ], sortType: 'asc', sort_by: 'Created On'};
     component.applySorting(sortByOption);
     fixture.detectChanges();
     expect(route.navigate).toHaveBeenCalledWith(['workspace/content/upForReview', 1], {queryParams: queryParams});
  }));
  it('should call handleSearch method and naviagate with search query after 1s', fakeAsync(() => {
      const route = TestBed.inject(Router);
      component.query = 'text';
      spyOn(component, 'handleSearch').and.callThrough();
      component.handleSearch();
      const queryParams = {subject: [ 'english', 'odia' ], query: 'text'};
      tick(1000);
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/upForReview', 1], {queryParams: queryParams});
      fixture.detectChanges();
  }));
  it('should call handleSearch method when key is empty and remove key from queryparam', fakeAsync(() => {
      const route = TestBed.inject(Router);
      spyOn(component, 'handleSearch').and.callThrough();
      component.query = '';
      component.handleSearch();
      const queryParams = {subject: [ 'english', 'odia' ]};
      tick(1000);
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/upForReview', 1], {queryParams: queryParams});
  }));
  it('should call keyup method sets the modelChanged value', () => {
    const route = TestBed.inject(Router);
    inputEl.triggerEventHandler('keydown', {});
    spyOn(component, 'keyup').and.callThrough();
    component.keyup('text');
    expect(component.query).toBe('text');
  });
});
