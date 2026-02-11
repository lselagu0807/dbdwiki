import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Perk } from './perk';

describe('Perk', () => {
  let component: Perk;
  let fixture: ComponentFixture<Perk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Perk);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
