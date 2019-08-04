import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineGraphComponent3Component } from './line-graph-component3.component';

describe('LineGraphComponent3Component', () => {
  let component: LineGraphComponent3Component;
  let fixture: ComponentFixture<LineGraphComponent3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineGraphComponent3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineGraphComponent3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
