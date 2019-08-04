import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineGraphComponent2Component } from './line-graph-component2.component';

describe('LineGraphComponent2Component', () => {
  let component: LineGraphComponent2Component;
  let fixture: ComponentFixture<LineGraphComponent2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineGraphComponent2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineGraphComponent2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
