import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffHomeComponent } from './staff-home.component';

describe('StaffHomeComponent', () => {
  let component: StaffHomeComponent;
  let fixture: ComponentFixture<StaffHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
