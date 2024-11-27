import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMethodComponent } from './list-method.component';

describe('ListMethodComponent', () => {
  let component: ListMethodComponent;
  let fixture: ComponentFixture<ListMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMethodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
