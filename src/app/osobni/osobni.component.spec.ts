import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsobniComponent } from './osobni.component';

describe('OsobniComponent', () => {
  let component: OsobniComponent;
  let fixture: ComponentFixture<OsobniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsobniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsobniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
