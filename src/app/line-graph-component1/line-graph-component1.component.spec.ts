import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineGraphComponent1Component } from './line-graph-component1.component';

describe('LineGraphComponent1Component', () => {
  let component: LineGraphComponent1Component;
  let fixture: ComponentFixture<LineGraphComponent1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineGraphComponent1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineGraphComponent1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
