import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffNavBarComponent } from './staff-nav-bar.component';

describe('StaffNavBarComponent', () => {
  let component: StaffNavBarComponent;
  let fixture: ComponentFixture<StaffNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
