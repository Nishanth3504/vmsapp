import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-legal-notice-invoice-list',
  templateUrl: './legal-notice-invoice-list.page.html',
  styleUrls: ['./legal-notice-invoice-list.page.scss'],
})
export class LegalNoticeInvoiceListPage implements OnInit {
  search_keyword: any;
  setLanguage: any;
  Opacity: any = 1;
  user_type: string;
  pageLength: number = 0;
  isInfiniteScrollDisabled: boolean = false;
  isSearching: boolean = false;
  legalNoticeInvoiceList: any = [];
  SearchReportsTimeout: any;
  filteredNoticeList: any = [];
  userId: string;

  constructor(
    private moduleService: ModuleService,
    private loaderService: LoaderService,
    private router: Router,
    public atrCtrl: AlertController,
    public toastService: ToastService,
    private translateService: TranslateService
  ) {
    this.setLanguage = window.localStorage.getItem('language');
    this.translateService.use(this.setLanguage);
  }

  ngOnInit() {
    this.userId = localStorage.getItem('user_id');
  }

  ionViewDidEnter() {
    this.pageLength = 0;
    this.legalNoticeInvoiceList = [];
    this.isInfiniteScrollDisabled = false;
    this.getLegalNoticesInvoiceList('');
    this.filteredNoticeList = [];
  }

  getLegalNoticesInvoiceList(searchText: any, event?: any) {
    if (this.isSearching && event) {
      event.target.complete();
      return;
    }

    let body = {
      reference_number: searchText,
      user_id: this.userId,
      pageLength: this.pageLength,
    };
    if (!event) {
      this.loaderService.loadingPresent();
    }
    console.log('payload', body);
    this.moduleService.getLegalNoticeInvoicesList(body).subscribe(
      (res: any) => {
        console.log(res);

        if (res.statusCode == 200) {
          console.log('legal notce list', res.data);

          if (this.pageLength === 0) {
            this.legalNoticeInvoiceList = res.data;
          } else {
            this.legalNoticeInvoiceList = [...this.legalNoticeInvoiceList, ...res.data];
          }

          this.filteredNoticeList = [...this.legalNoticeInvoiceList];
          this.isInfiniteScrollDisabled = res.data.length === 0;
        } else {
          if (this.pageLength === 0) {
            this.legalNoticeInvoiceList = [];
            this.filteredNoticeList = [];
          }
          this.isInfiniteScrollDisabled = true;
        }
        if (event) {
          event.target.complete();
        } else {
          this.loaderService.loadingDismiss();
        }
        this.isSearching = false;
      },
      (error) => {
        console.error(error);
        if (event) {
          event.target.complete();
        } else {
          this.loaderService.loadingDismiss();
        }
        this.isSearching = false;
      }
    );
  }

  getStatusColor(status: any): any {
    switch (status) {
      case 'In-progress':
        return 'orange';
      case 'Accepted':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'inherit';
    }
  }

  toView(id: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        data: id,
        type: 'noticedetail',
      },
    };
    this.router.navigate(['/noticedetail'], navigationExtras);
  }

  toUpdate(id: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        data: id,
        type: 'update_noticedetail',
      },
    };
    this.router.navigate(['/legal-notice-invoice-details'], navigationExtras);
  }

  SearchNotices(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('searchTerm', searchTerm);
    clearTimeout(this.SearchReportsTimeout);
    this.SearchReportsTimeout = setTimeout(() => {
      this.isSearching = true;
      this.pageLength = 0;
      this.legalNoticeInvoiceList = [];
      this.filteredNoticeList = [];
      this.isInfiniteScrollDisabled = false;
      this.search_keyword = searchTerm;
      this.getLegalNoticesInvoiceList(searchTerm);
    }, 3000);
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.pageLength = 0;
      this.legalNoticeInvoiceList = [];
      this.filteredNoticeList = [];
      this.isInfiniteScrollDisabled = false;
      this.getLegalNoticesInvoiceList('');
      event.target.complete();
    }, 2000);
  }

  loadMoreNotices(event: any) {
    if (!this.isInfiniteScrollDisabled && !this.isSearching) {
      this.pageLength++;
      this.getLegalNoticesInvoiceList(this.search_keyword, event);
    } else {
      event.target.complete();
    }
  }

  async viewMapModal(latlong: any) {
    let destination = latlong.split(',')[0] + ',' + latlong.split(',')[1];
    window.open('geo:0,0?q=' + destination + '', '_system');
  }
}
