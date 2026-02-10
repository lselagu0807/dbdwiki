import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Survivor } from './survivor';

describe('Survivor', () => {
  let component: Survivor;
  let fixture: ComponentFixture<Survivor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Survivor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Survivor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
