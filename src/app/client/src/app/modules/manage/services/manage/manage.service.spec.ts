import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ManageService } from './manage.service';
import { of } from 'rxjs';

describe('ManageService', () => {
  configureTestSuite();
  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [ManageService, HttpClient],
      imports: [HttpClientTestingModule, SharedModule.forRoot()]
    });
  });

  it('should be created', () => {
    const service: ManageService = TestBed.inject(ManageService);
    expect(service).toBeTruthy();
  });

  describe('getData method ', () => {
    it('should call the api', () => {
      const http = TestBed.inject(HttpClient, HttpHeaders as any);
      const manageService = TestBed.inject(ManageService);
      spyOn(http, 'get').and.returnValue(of({ test: 'ok' }));
      manageService.getData('sunbird', 'a.txt');
      expect(http.get).toHaveBeenCalled();
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.get).toHaveBeenCalledWith('/admin-reports/sunbird/a.txt', {headers: new HttpHeaders()});
    });

    it('should return data  if response do contain result key', () => {
      const http = TestBed.inject(HttpClient);
      const manageService = TestBed.inject(ManageService);
      spyOn(http, 'get').and.returnValue(of({ result: '123' }));
      const result = manageService.getData('sunbird', 'a.txt');
      expect(http.get).toHaveBeenCalled();
      result.subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toEqual({
          responseCode: 'OK',
          result: '123'
        });
      });
    });

    it('should return data as it is if response do not contain result key', () => {
      const http = TestBed.inject(HttpClient);
      const manageService = TestBed.inject(ManageService);
      spyOn(http, 'get').and.returnValue(of({ data: '123' }));
      const result = manageService.getData('sunbird', 'a.txt');
      expect(http.get).toHaveBeenCalled();
      result.subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toEqual({
          responseCode: 'OK',
          result: { data: '123' }
        });
      });
    });
  });


});
