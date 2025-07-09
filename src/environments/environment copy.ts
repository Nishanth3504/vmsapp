// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiUrl: 'http://rpalhamra.com:8087',
  //apiUrl: 'http://192.168.0.104:3002',
  //apiUrl: 'http://192.168.1.58:3002',
  vmsApiUrl: 'https://rpalhamra.com/clients/vms/webservice/v1/api/',
  vmsDedApiUrl:'https://raqib.rak.ae/webservice/v1/DEDAPIWeb/',
  uploadPath:'https://rpalhamra.com/clients/vms/uploads/amendment_documents/',
  ViolationDocumentsPath:'https://rpalhamra.com/clients/vms/uploads/violation_documents/',
  ViolationVidoesPath:'https://rpalhamra.com/clients/vms/uploads/violation_videos/',
  production: false,
  sms_host_url: "sms.rmlconnect.net",
  sms_port: 2345,
  sms_api_source: "PSD",
  sms_api_username: "GOVTRAKPWSD",
  sms_api_password: "GOVT1212",
  sms_api_msgtype:"2",
  sms_api_dlr:"1",
  authorizationURL:"rpalhamra.com:8087"
};


// export const environment1 = {
//   apiUrl: 'http://rpalhamra.com:8087',
//   //apiUrl: 'http://192.168.0.104:3002',
//   //apiUrl: 'http://192.168.1.58:3002',
//   vmsApiUrl: 'https://rpalhamra.com/clients/vms/webservice/v1/api/',
//   vmsComplaintApiUrl: 'https://rpalhamra.com/clients/vms-prod/webservice/v1/complaintsapi/',
//   uploadPath:'https://rpalhamra.com/clients/vms/uploads/amendment_documents/',
//   ViolationDocumentsPath:'https://rpalhamra.com/clients/vms/uploads/violation_documents/',
//   ViolationVidoesPath:'https://rpalhamra.com/clients/vms/uploads/violation_videos/',
//   signaturePath:'https://rpalhamra.com/clients/vms/uploads/violator_signatures/',
//   production: false,
//   sms_host_url: "sms.rmlconnect.net",
//   sms_port: 2345,
//   sms_api_source: "PSD",
//   sms_api_username: "GOVTRAKPWSD",
//   sms_api_password: "GOVT1212",
//   sms_api_msgtype:"2",
//   sms_api_dlr:"1",
//   authorizationURL:"rpalhamra.com:8087",
//   /* Below is the Ded Code*/
  
//   vmsDedApiUrl :"https://rakdedlicdstg.ega.lan/QSInternalTest/",
//   vmsDedUsername : "RAKDED_SeR_User",
//   vmsDedPassword : "LR@rakDeD2020",
//   vmsDedExternalEntityId : "9887E657-9D9B-4269-86E0-597CF853D59C"

// };


// /*Production Config */

// export const environment1 = {
//   apiUrl: 'https://raqib.rak.ae:3002',
//   vmsApiUrl: 'https://raqib.rak.ae/webservice/v1/api/',
//   uploadPath:'https://raqib.rak.ae/uploads/amendment_documents/',
//   ViolationDocumentsPath:'https://raqib.rak.ae/uploads/violation_documents/',
//   ViolationVidoesPath:'https://raqib.rak.ae/uploads/violation_videos/',
//   signaturePath:'https://raqib.rak.ae/uploads/violator_signatures/',
//   production: true,
//   sms_host_url: "sms.rmlconnect.net",
//   sms_port: 2345,
//   sms_api_source: "PSD",
//   sms_api_username: "GOVTRAKPWSD",
//   sms_api_password: "GOVT1212",
//   sms_api_msgtype:"2",
//   sms_api_dlr:"1",
//   authorizationURL:"raqib.rak.ae:3002"
//  };
 
//  window.console.log = function() {};
 