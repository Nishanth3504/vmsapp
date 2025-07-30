import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LegalNoticeInvoiceDetailsPage } from './legal-notice-invoice-details.page';

describe('LegalNoticeInvoiceDetailsPage', () => {
  let component: LegalNoticeInvoiceDetailsPage;
  let fixture: ComponentFixture<LegalNoticeInvoiceDetailsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalNoticeInvoiceDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LegalNoticeInvoiceDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
