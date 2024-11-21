import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyLayoutComponent } from './buy-layout.component';

describe('BuyLayoutComponent', () => {
  let component: BuyLayoutComponent;
  let fixture: ComponentFixture<BuyLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
