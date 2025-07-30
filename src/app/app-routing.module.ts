import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './shared/services/authentication.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./onboarding/pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./onboarding/pages/forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordPageModule)
  },

  {
    path: 'changepassword',
    loadChildren: () => import('./onboarding/pages/changepassword/changepassword.module').then(m => m.ChangepasswordPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./rakinspector/pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AuthenticationGuard],
    data: {
      title: 'Dashboard',
    }
  },
  {
    path: 'transactionslist',
    loadChildren: () => import('./rakinspector/pages/transactionslist/transactionslist.module').then(m => m.TransactionslistPageModule),
    canActivate: [AuthenticationGuard],
    data: {
      title: 'Transactions List',
    }

  },
  {
    path: 'createviolation',
    loadChildren: () => import('./rakinspector/pages/createviolation/createviolation.module').then(m => m.CreateviolationPageModule),
    // canActivate: [AuthenticationGuard],
    data: {
      title: 'Create Violation',
    }
  },
  {
    path: 'search',
    loadChildren: () => import('./rakinspector/pages/search/search.module').then(m => m.SearchPageModule),
    canActivate: [AuthenticationGuard],
    data: {
      title: 'Search',
    }
  },
  {
    path: 'profile',
    loadChildren: () => import('./rakinspector/pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthenticationGuard],
    data: {
      title: 'Profile',
    }
  },
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },
  {
    path: 'violationdetails/:id',
    loadChildren: () => import('./rakinspector/pages/violationdetails/violationdetails.module').then(m => m.ViolationdetailsPageModule)
  },
  {
    path: 'editviolation/:id',
    loadChildren: () => import('./rakinspector/pages/editviolation/editviolation.module').then( m => m.EditviolationPageModule)
  },
  {
    path: 'edittransactionlist/:id',
    // eslint-disable-next-line max-len
    loadChildren: () => import('./rakinspector/pages/edittransactionlist/edittransactionlist.module').then( m => m.EdittransactionlistPageModule)
  },
  {
    path: 'raisecomplaint',
    loadChildren: () => import('./rakinspector/pages/raisecomplaint/raisecomplaint.module').then( m => m.RaisecomplaintPageModule)
  },
  {
    path: 'viewcomplaints',
    loadChildren: () => import('./rakinspector/pages/viewcomplaints/viewcomplaints.module').then( m => m.ViewcomplaintsPageModule)
  },
  {
    path: 'createwarning',
    loadChildren: () => import('./rakinspector/pages/createwarning/createwarning.module').then( m => m.CreatewarningPageModule)
  },
  {
    path: 'warningdetails/:id',
    loadChildren: () => import('./rakinspector/pages/warningdetails/warningdetails.module').then( m => m.WarningdetailsPageModule)
  },
  {
    path: 'warninglist',
    loadChildren: () => import('./rakinspector/pages/warninglist/warninglist.module').then( m => m.WarninglistPageModule)
  },
  {
    path: 'creategeneral',
    loadChildren: () => import('./rakinspector/pages/creategeneral/creategeneral.module').then( m => m.CreategeneralPageModule)
  },
  {
    path: 'viewgeneral',
    loadChildren: () => import('./rakinspector/pages/viewgeneral/viewgeneral.module').then( m => m.ViewgeneralPageModule)
  },
  {
    path: 'incidentdetail',
    loadChildren: () => import('./rakinspector/pages/incidentdetail/incidentdetail.module').then( m => m.IncidentdetailPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./rakinspector/pages/test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'add-report',
    loadChildren: () => import('./rakinspector/pages/reports/add-report/add-report.module').then( m => m.AddReportPageModule)
  },
  {
    path: 'view-report/:id',
    loadChildren: () => import('./rakinspector/pages/reports/view-report/view-report.module').then( m => m.ViewReportPageModule)
  },
  {
    path: 'report-list',
    loadChildren: () => import('./rakinspector/pages/reports/report-list/report-list.module').then( m => m.ReportListPageModule)
  },
  {
    path: 'permitlist',
    loadChildren: () => import('./rakinspector/pages/permits/permitlist/permitlist.module').then( m => m.PermitlistPageModule)
  },
  {
    path: 'permitdetail/:id',
    loadChildren: () => import('./rakinspector/pages/permits/permitdetail/permitdetail.module').then( m => m.PermitdetailPageModule)
  },
  {
    path: 'rejected-report-list',
    loadChildren: () => import('./rakinspector/pages/reports/rejected-report-list/rejected-report-list.module').then( m => m.RejectedReportListPageModule)
  },
  {
    path: 'createpermit',
    loadChildren: () => import('./rakinspector/pages/permits/createpermit/createpermit.module').then( m => m.CreatepermitPageModule)
  },
  {
    path: 'warningtoviolations',
    loadChildren: () => import('./rakinspector/pages/warningtoviolations/warningtoviolations.module').then( m => m.WarningtoviolationsPageModule)
  },
  {
    path: 'complaintdetails/:id',
    loadChildren: () => import('./rakinspector/pages/complaintdetails/complaintdetails.module').then( m => m.ComplaintdetailsPageModule)
  },
  {
    path: 'followup-request',
    loadChildren: () => import('./rakinspector/pages/followuo_requests/followup-request/followup-request.module').then( m => m.FollowupRequestPageModule)
  },
  {
    path: 'followup-list',
    loadChildren: () => import('./rakinspector/pages/followuo_requests/followup-list/followup-list.module').then( m => m.FollowupListPageModule)
  },
  {
    path: 'view-followup',
    loadChildren: () => import('./rakinspector/pages/followuo_requests/view-followup/view-followup.module').then( m => m.ViewFollowupPageModule)
  },
  {
    path: 'legalnoticelist',
    loadChildren: () => import('./rakinspector/pages/legalnotices/legalnoticelist/legalnoticelist.module').then( m => m.LegalnoticelistPageModule)
  },
  {
    path: 'noticedetail',
    loadChildren: () => import('./rakinspector/pages/legalnotices/noticedetail/noticedetail.module').then( m => m.NoticedetailPageModule)
  },
  {
    path:'uaepassverification',
    loadChildren: () => import('./onboarding/pages/uaepassverification/uaepassverification.module').then(m => m.UaepassverificationPageModule)
  },
  {
    path: 'legal-notice-invoice-list',
    loadChildren: () => import('./rakinspector/pages/legalnoticeinvoices/legal-notice-invoice-list/legal-notice-invoice-list.module').then( m => m.LegalNoticeInvoiceListPageModule)
  },  {
    path: 'legal-notice-invoice-details',
    loadChildren: () => import('./rakinspector/pages/legalnoticeinvoices/legal-notice-invoice-details/legal-notice-invoice-details.module').then( m => m.LegalNoticeInvoiceDetailsPageModule)
  }












];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
