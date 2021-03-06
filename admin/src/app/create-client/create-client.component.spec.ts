import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CreateClientComponent} from "./create-client.component";
import {FormsModule} from "@angular/forms";
import {ClientService} from "../client.service";

describe('CreateClientComponent', () => {
  let component: CreateClientComponent;
  let fixture: ComponentFixture<CreateClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CreateClientComponent],
      providers: [ClientService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
