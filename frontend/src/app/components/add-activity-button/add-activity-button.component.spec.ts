import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityButtonComponent } from './add-activity-button.component';

describe('AddActivityButtonComponent', () => {
  let component: AddActivityButtonComponent;
  let fixture: ComponentFixture<AddActivityButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddActivityButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddActivityButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
