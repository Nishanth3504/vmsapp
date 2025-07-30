import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LegalNoticeInvoiceListPage } from './legal-notice-invoice-list.page';

describe('LegalNoticeInvoiceListPage', () => {
  let component: LegalNoticeInvoiceListPage;
  let fixture: ComponentFixture<LegalNoticeInvoiceListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalNoticeInvoiceListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LegalNoticeInvoiceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
