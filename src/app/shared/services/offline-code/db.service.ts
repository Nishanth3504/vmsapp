import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ListViolations, TblAreas, TblDocumentTypes, TblFineCategories, TblFineCategoryCodes, TblPlateCodes, TblPlateSources, TblReserved, TblSideTypes, TblUsers, TblViolation, TblViolationDocs, TblViolatorSignature, TblViolationsAmendRequests, TblViolationVideos, violationsTransactionsList, TblPlateCategory } from './masters';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { resolve } from 'dns';
import { promise } from 'protractor';
import { apiWithoutHeader } from '../http-interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private storage: SQLiteObject;
  sideTypesList = new BehaviorSubject([]);
  documentTypeList = new BehaviorSubject([]);
  fineCategoriesList = new BehaviorSubject([]);
  fineCategoryCodeList = new BehaviorSubject([]);
  areaList = new BehaviorSubject([]);
  plateSourceList = new BehaviorSubject([]);
  plateCategoryData = new BehaviorSubject([]);
  plateCodeList = new BehaviorSubject([]);
  reservedCodesList = new BehaviorSubject([]);
  violationList = new BehaviorSubject([]);
  violationDocList = new BehaviorSubject([]);
  violationVideoList = new BehaviorSubject([]);
  violationAmendRequestList = new BehaviorSubject([]);
  violationViewList = new BehaviorSubject([]);
  violationTransactionList = new BehaviorSubject([]);

  userList = new BehaviorSubject([]);

  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  readonly db_name: string = "rpalhamara_vms";
  readonly db_tbl_side_types: string = "tbl_side_types";
  readonly db_tbl_document_type: string = "tbl_document_type";
  readonly db_tbl_fine_categories: string = "tbl_fine_categories";
  readonly db_tbl_fine_category_codes = "tbl_fine_category_codes";
  readonly db_tbl_areas = "tbl_areas";
  readonly db_tbl_plate_sources = "tbl_plate_sources";
  readonly db_tbl_plate_category = "tbl_plate_category";
  readonly db_tbl_plate_codes = "tbl_plate_codes";
  readonly db_tbl_reserved = "tbl_reserved";
  readonly db_tbl_violationdata = "tbl_violationdata";
  readonly db_tbl_violationdocs = "tbl_violationdocs";
  readonly db_tbl_violator_signature = "tbl_ViolatorSignature";
  readonly db_tbl_violationvideos = "tbl_violationvideos";
  readonly db_tbl_violations_amend_requests = "tbl_violations_amend_requests";
  readonly db_tbl_user = "tbl_user";
  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient
  ) {

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: this.db_name,
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          db.executeSql(`
                  CREATE TABLE IF NOT EXISTS ${this.db_tbl_side_types} (
                    side_type_id INTEGER PRIMARY KEY, 
                    side_type_code INTEGER,
                    name_eng TEXT,
                    name_ar TEXT,
                    source_id INTEGER,
                    side_type_short_desc TEXT,
                    status CHAR(1),
                    created_by INTEGER,
                    updated_by INTEGER,
                    created_on TEXT,
                    updated_on TEXT
                  )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
              console.log("Table Created");
            })
            .catch((error) => alert(JSON.stringify(error)));
            // .catch(e => console.log('Error opening in the database', e));

          db.executeSql(`
                  CREATE TABLE IF NOT EXISTS ${this.db_tbl_document_type} (
                    id INTEGER PRIMARY KEY,
                    code INTEGER,
                    name_eng TEXT,
                    name_ar TEXT
                  )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));


          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_fine_categories} (
              fine_category_id INTEGER PRIMARY KEY, 
              description TEXT,
              description_eng TEXT
            )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));

          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_fine_category_codes} (
              fine_code_id INTEGER PRIMARY KEY, 
              fine_code_reffer_no INTEGER,
              fine_category_id INTEGER,
              description TEXT,
              description_eng TEXT,
              fine_amount NUMERIC,
              per_day INTEGER,
              field_need_count INTEGER,
              ord INTEGER            
            )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));


          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_areas} (
              area_id INTEGER PRIMARY KEY, 
              area_code INTEGER,
              name_eng TEXT,
              name_ar TEXT,
              latitude INTEGER,
              longtitude INTEGER
            )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));

          /* tbl_plate_sources */
          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_plate_sources} (
              car_sid NUMERIC, 
              raqab_code TEXT,
              adp_code TEXT,
              name_eng TEXT,
              name_ar TEXT
            )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));

          /* tbl_plate_sources */

          /* tbl_plate_category */
          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_plate_category} (
              id TEXT,
              source_id TEXT,
              aber_code TEXT,
              raqab_code TEXT,
              plate_source_id TEXT,
              adp_code TEXT,
              name_eng TEXT,
              name_ar TEXT
            )`, [])
            .then((res) => {
              console.log(res);
            })
            .catch((error) => alert(JSON.stringify(error)));
          /* tbl_plate_category */

          /* tbl_plate_codes */
          db.executeSql(`
           CREATE TABLE IF NOT EXISTS ${this.db_tbl_plate_codes} (
             id NUMERIC, 
             source_code TEXT,
             raqab_code TEXT,
             raqab_desc_eng TEXT,
             raqab_desc_arb TEXT,
             aber_code NUMERIC,
             aber_desc_arb TEXT,
             aber_desc_eng TEXT,
             source_id NUMERIC,
             plate_category_id TEXT
           )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
              console.log(res);
            })
            .catch((error) => alert(JSON.stringify(error)));

          /* tbl_plate_codes */


          /* tbl_reserved */

          db.executeSql(`
           CREATE TABLE IF NOT EXISTS ${this.db_tbl_reserved} (
            reserved_id NUMERIC,
            source_id TEXT, 
            reserved_code NUMERIC,
            name_eng TEXT,
            name_arb TEXT,
            status NUMERIC
           )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
              console.log(res,"reserved code table is created");
              
            })
            .catch((error) => alert(JSON.stringify(error)));

          /* tbl_reserved */


          // db.executeSql(`
          // CREATE TABLE IF NOT EXISTS ${this.db_tbl_violationdata} (
          //   violation TEXT, 
          //   violationdocs TEXT,
          //   violationvideos TEXT,
          //   violationSyncStatus NUMERIC
          // )`, [])
          // .then((res) => {
          //   // alert(JSON.stringify(res));
          // })
          // .catch((error) => alert(JSON.stringify(error)));


          /* Violations  */

          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_violationdata} (
              ID INTEGER PRIMARY KEY AUTOINCREMENT,
              voilationType,
              voilationTitle,
              sideCode,
              sideCodeID,
              documentType,
              documentNo,
              sideCodeDescription,
              licenseNo,
              plateNo,
              plateSource,
              plateCode,
              plateCategory,
              plateColor,
              oldCode,
              violationCategory,
              fineCode,
              finePlace,
              area,
              fineNotes,
              recipientPerson,
              phone,
              recipientMobile,
              email,
              reservedCode,
              reservedIdNumber,
              ownername,
              ownerphone,
              ownerdescription,
              identityDoc,
              identityDoc_file,
              address,
              description,
              dailyFines,
              violationDocument,
              fineAmount,
              animalhitCount,
              mulltifiles,
              videofile,
              video,
              created_by,
              created_on,
              documentTypeName,
              docpath,
              videospath,
              is_delete,
              is_delete_approved_status,
              deletion_for_reason,
              status,
              consider_as_aber,
              violator_signature,
              signaturepath,
              document_proof_status,
              other_plate_source,
              amend_request_raised
            )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));

          /* Violations*/


          /* Violation Documents */

          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_violationdocs} (
              violationdocs TEXT,
              violationSyncStatus NUMERIC
            )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));

          /* Violation Documents */

          /* Violation Documents */

          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_violator_signature} (
              violator_signature TEXT,
              violationSyncStatus NUMERIC
            )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));

          /* Violation Documents */

          /* Violation Videos */

          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_violationvideos} (
              violationvideos TEXT,
              violationSyncStatus NUMERIC
            )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));

          /* Violation Videos */


          /* Violation Amend Requests*/

          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_violations_amend_requests} (
              ID INTEGER PRIMARY KEY AUTOINCREMENT,
              violation_id INTEGER,
              amend_message TEXT,
              user_id INTEGER,
              images TEXT,
              status TEXT,
              created_on TEXT
            )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));

          /* violation Amend Requests*/


          /* User Table Creation */
          db.executeSql(`
            CREATE TABLE IF NOT EXISTS ${this.db_tbl_user} (
              user_id INTEGER,
              employee_id TEXT,
              first_name TEXT,
              last_name TEXT,
              first_name_arb TEXT,
              last_name_arb TEXT,
              serial_number TEXT,
              email_id TEXT,
              mobile_no TEXT,
              profile_pic TEXT,
              password TEXT,
              status TEXT,
              source_id INTEGER,
              created_on TEXT,
              created_by INTEGER,
              updated_on TEXT,
              updated_by INTEGER,
              last_logged_on TEXT,
              password_token TEXT,
              side_type INTEGER,
              user_type INTEGER,
              pwd_token_created_on TEXT,
              sf_userid TEXT,
              language TEXT,
              chc_department_id TEXT,
              sector TEXT,
              is_chc_access TEXT,
              user_token TEXT,
              agency_id TEXT
            )`, [])
            .then((res) => {
              // alert(JSON.stringify(res));
              console.log(res,"userssssss");
            })
            .catch((error) => alert(JSON.stringify(error)));

          /* End User Table Creation */

        });
    });

  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchsideTypesList(sourceId): Observable<TblSideTypes[]> {
    console.log(sourceId);
    this.getSideTypes(sourceId);
    this.isDbReady.next(true);
    return this.sideTypesList.asObservable();
  }

  // Get SideType list
  getSideTypes(sourceId : any) {
    console.log(sourceId);
    return this.storage.executeSql("SELECT * FROM `tbl_side_types` where source_id='"+sourceId+"' ", []).then(res => {
      console.log(res,"violation type");
      let items: TblSideTypes[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          items.push({
            side_type_id: res.rows.item(i).side_type_id,
            side_type_code: res.rows.item(i).side_type_code,
            name_eng: res.rows.item(i).name_eng,
            name_ar: res.rows.item(i).name_ar,
            source_id: res.rows.item(i).source_id,
            side_type_short_desc: res.rows.item(i).side_type_short_desc,
            status: res.rows.item(i).status,
            created_by: res.rows.item(i).created_by,
            updated_by: res.rows.item(i).updated_by,
            created_on: res.rows.item(i).created_on,
            updated_on: res.rows.item(i).updated_on,
          });
        }
        console.log("itemssss",items);
        
      }
      this.sideTypesList.next(items);
    });
  }


  /* Start  Get Side Types By SideType ID*/


  getSideTypesByID(id: any): Promise<any> {
    return this.storage.executeSql("SELECT * FROM `tbl_side_types` where side_type_id='" + id + "' limit 1", []).then(res => {
      let items: TblSideTypes[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            side_type_id: res.rows.item(i).side_type_id,
            side_type_code: res.rows.item(i).side_type_code,
            name_eng: res.rows.item(i).name_eng,
            name_ar: res.rows.item(i).name_ar,
            source_id: res.rows.item(i).source_id,
            side_type_short_desc: res.rows.item(i).side_type_short_desc,
            status: res.rows.item(i).status,
            created_by: res.rows.item(i).created_by,
            updated_by: res.rows.item(i).updated_by,
            created_on: res.rows.item(i).created_on,
            updated_on: res.rows.item(i).updated_on,
          });
        }
      }
      return items;
    });
  }



  /* */

  bulkInsertViolationTypes(items: any) {
    this.removeAll(this.db_tbl_side_types);
    let insertRows = [];
    items.forEach(item => {
      console.log(item);
      insertRows.push([
        "INSERT INTO " + this.db_tbl_side_types + " (side_type_id," +
        "side_type_code," +
        "name_eng," +
        "name_ar," +
        "source_id," +
        "side_type_short_desc," +
        "status," +
        "created_by," +
        "updated_by," +
        "created_on," +
        "updated_on) VALUES (?, ?, ?, ?,?,?,?,?,?,?,?)",
        [item.side_type_id, item.side_type_code, item.name_eng, item.name_ar, item.source_id, item.side_type_short_desc, item.status, item.created_by, item.updated_by, item.created_on, item.updated_on]
      ]);
    });

    this.storage.sqlBatch(insertRows).then((result) => {
      console.log("result",result);
      console.info("Inserted items");
    }).catch(e => console.log(e));
    // this.storage.sqlBatch(insertRows).then((result) => {
    //   console.log('Batch operation successful');
    //   console.log(result); // The result object may contain additional information
    
    //   // If you want to check individual results, you might need to inspect each statement separately
    //   insertRows.forEach((insertRow, index) => {
    //     console.log(`Statement ${index + 1}:`, insertRow[0]);
    //   });
    // }).catch(e => {
    //   console.error('Error in batch operation:', e);
    // });

  }

  // bulkInsertViolationTypes(items: any){
  //   this.removeAll(this.db_tbl_side_types);
  //     let insertRows = [];
  //     items.forEach(item => {
  //       insertRows.push([
  //         "INSERT INTO " + this.db_tbl_side_types + " (side_type_code," +
  //         "name_eng," +
  //         " ) VALUES (?, ?, ?)",
  //         [ item.side_type_code, item.name_eng, item.name_ar]
  //       ]);
  //     });
  //     this.storage.sqlBatch(insertRows).then((result) => {
  //       console.log(insertRows);
  //       console.info("Inserted items", result);
  //     }).catch(e => console.log(e));
  // }

  fetchDocumentTypesList(): Observable<TblDocumentTypes[]> {
    this.getDocumentTypes();
    this.isDbReady.next(true);
    return this.documentTypeList.asObservable();
  }



  // Get SideType list
  getDocumentTypes() {
    return this.storage.executeSql("SELECT * FROM `tbl_document_type`", []).then(res => {
      let items: TblDocumentTypes[] = [];
      console.log(res,"getDocumentTypes");
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            code: res.rows.item(i).code,
            name_eng: res.rows.item(i).name_eng,
            name_ar: res.rows.item(i).name_ar
          });
        }
      }
      this.documentTypeList.next(items);
    });
  }

  /* Get Document Types By ID */

  getDocumentTypesByType(id: any): Promise<any> {
    return this.storage.executeSql("SELECT * FROM `tbl_document_type` where code='" + id + "' limit 1", []).then(res => {
      let items: TblDocumentTypes[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            code: res.rows.item(i).code,
            name_eng: res.rows.item(i).name_eng,
            name_ar: res.rows.item(i).name_ar
          });
        }
      }
      return items;
    });
  }

  /* Get Document Types By ID*/



    bulkInsertDocumentTypes(items: any) {
      console.log(items);
    this.removeAll(this.db_tbl_document_type);
    let insertRows = [];
    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_document_type + " (id, code," +
        "name_eng," +
        "name_ar) VALUES (?, ?, ?,?)",
        [item.id, item.code, item.name_eng, item.name_ar]
      ]);
    });

    this.storage.sqlBatch(insertRows).then((result) => {
      console.log(result);
      console.info("Inserted items");
    }).catch(e => console.log(e));

  }



  fetchFineCategoriesList(): Observable<TblFineCategories[]> {
    this.getFineCategories();
    this.isDbReady.next(true);
    return this.fineCategoriesList.asObservable();
  }



  // Get SideType list
  getFineCategories() {
    return this.storage.executeSql("SELECT * FROM `tbl_fine_categories`", []).then(res => {
      let items: TblFineCategories[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            fine_category_id: res.rows.item(i).fine_category_id,
            description: res.rows.item(i).description,
            description_eng: res.rows.item(i).description_eng
          });
        }
      }
      this.fineCategoriesList.next(items);
    });
  }


  getFineCategoriesByID(id: any): Promise<any> {
    return this.storage.executeSql("SELECT * FROM `tbl_fine_categories` where fine_category_id='" + id + "' limit 1", []).then(res => {
      let items: TblFineCategories[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            fine_category_id: res.rows.item(i).fine_category_id,
            description: res.rows.item(i).description,
            description_eng: res.rows.item(i).description_eng
          });
        }
      }
      return items;
    });
  }




  bulkInsertFineCategories(items: any) {
    this.removeAll(this.db_tbl_fine_categories);
    let insertRows = [];
    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_fine_categories + " (fine_category_id," +
        "description," +
        "description_eng) VALUES (?, ?, ?)",
        [item.fine_category_id, item.description, item.description_eng]
      ]);
    });

    this.storage.sqlBatch(insertRows).then((result) => {
      console.info("Inserted items");
    }).catch(e => console.log(e));

  }


  fetchFineCategoryCodeList(): Observable<TblFineCategoryCodes[]> {
    this.getFineCategoryCodes();
    this.isDbReady.next(true);
    return this.fineCategoryCodeList.asObservable();
  }



  // Get SideType list
  getFineCategoryCodes() {
    return this.storage.executeSql("SELECT * FROM `tbl_fine_category_codes` order by ord asc", []).then(res => {
      let items: TblFineCategoryCodes[] = [];
      if (res.rows.length > 0) {
        console.log(res.rows);
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            fine_code_id: res.rows.item(i).fine_code_id,
            fine_code_reffer_no: res.rows.item(i).fine_code_reffer_no,
            fine_category_id: res.rows.item(i).fine_category_id,
            description: res.rows.item(i).description,
            description_eng: res.rows.item(i).description_eng,
            fine_amount: res.rows.item(i).fine_amount,
            per_day: res.rows.item(i).per_day,
            field_need_count: res.rows.item(i).field_need_count
          });
        }
      }
      this.fineCategoryCodeList.next(items);
    });
  }

  getFineCategoryCodesByID(id: any): Promise<any> {
    return this.storage.executeSql("SELECT * FROM `tbl_fine_category_codes` where fine_code_id='" + id + "'  order by ord asc limit 1", []).then(res => {
      let items: TblFineCategoryCodes[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            fine_code_id: res.rows.item(i).fine_code_id,
            fine_code_reffer_no: res.rows.item(i).fine_code_reffer_no,
            fine_category_id: res.rows.item(i).fine_category_id,
            description: res.rows.item(i).description,
            description_eng: res.rows.item(i).description_eng,
            fine_amount: res.rows.item(i).fine_amount,
            per_day: res.rows.item(i).per_day
          });
        }
      }
      return items;
    });
  }




  bulkInsertFineCategoryCodes(items: any) {
    this.removeAll(this.db_tbl_fine_category_codes);
    let insertRows = [];
    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_fine_category_codes + " (fine_code_id," +
        "fine_code_reffer_no," +
        "fine_category_id," +
        "description," +
        "description_eng," +
        "fine_amount," +
        "per_day,field_need_count,ord) VALUES (?, ?, ?, ?,?,?,?,?,?)",
        [item.fine_code_id, item.fine_code_reffer_no, item.fine_category_id, item.description, item.description_eng, item.fine_amount, item.per_day, item.field_need_count,item.ord]
      ]);
    });

    this.storage.sqlBatch(insertRows).then((result) => {
      console.info("Inserted items");
    }).catch(e => console.log(e));

  }



  fetchAreasList(): Observable<TblAreas[]> {
    this.getAreas();
    this.isDbReady.next(true);
    return this.areaList.asObservable();
  }



  // Get SideType list
  getAreas() {
    return this.storage.executeSql("SELECT * FROM `tbl_areas`", []).then(res => {
      let items: TblAreas[] = [];
      if (res.rows.length > 0) {
        console.log(res.rows,"AREasa");
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            area_id: res.rows.item(i).area_id,
            area_code: res.rows.item(i).area_code,
            name_eng: res.rows.item(i).name_eng,
            name_ar: res.rows.item(i).name_ar,
            latitude:res.rows.item(i).latitude,
            longtitude:res.rows.item(i).longtitude
          });
        }
      }
      this.areaList.next(items);
    });
  }




  bulkInsertAreas(items: any) {
    this.removeAll(this.db_tbl_areas);
    let insertRows = [];
    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_areas + " (area_id," +
        "area_code," +
        "name_eng," +
        "name_ar,latitude,longtitude) VALUES (?, ?, ?, ?, ?, ?)",
        [item.area_id, item.area_code, item.name_eng, item.name_ar, item.latitude, item.longtitude]
      ]);
    });

    this.storage.sqlBatch(insertRows).then((result) => {
      console.info("Inserted items");
    }).catch(e => console.log(e));

  }


  /* Plate Sources */

  fetchPlateSources(): Observable<TblPlateSources[]> {
    this.getPlateSources();
    this.isDbReady.next(true);
    return this.plateSourceList.asObservable();
  }

  // Get SideType list
  getPlateSources() {
    return this.storage.executeSql("SELECT * FROM `tbl_plate_sources`", []).then(res => {
      let items: TblPlateSources[] = [];
      if (res.rows.length > 0) {
        console.log(res.rows,"offline plate source");
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            car_sid: res.rows.item(i).car_sid,
            raqab_code: res.rows.item(i).raqab_code,
            adp_code: res.rows.item(i).adp_code,
            name_eng: res.rows.item(i).name_eng,
            name_ar: res.rows.item(i).name_ar
          });
        }
      }
      this.plateSourceList.next(items);
    });
  }

  bulkInsertPlateSources(items: any) {
    this.removeAll(this.db_tbl_plate_sources);
    let insertRows = [];
    items.forEach(item => {
      console.log(item);
      insertRows.push([
        "INSERT INTO " + this.db_tbl_plate_sources + " (car_sid," +
        "raqab_code," +
        "adp_code," +
        "name_eng," +
        "name_ar) VALUES (?, ?, ?, ?,?)",
        [item.car_sid, item.raqab_code, item.adp_code, item.name_eng, item.name_ar]
      ]);
    });

    this.storage.sqlBatch(insertRows).then((result) => {
      console.info("Inserted items");
    }).catch(e => console.log(e));

  }
  /* Plate Sources */

  /* Plate Category */

  fetchPlateCategory(carsId: any): Observable<TblPlateCategory[]>{
    this.getPlateCategory(carsId);
    this.isDbReady.next(true);
    return this.plateCategoryData.asObservable();
  }

  // Get platecategory list

  getPlateCategory(plateSourceID: any){
    console.log(plateSourceID,"plateSourceId");
    return this.storage.executeSql("SELECT * FROM `tbl_plate_category` where plate_source_id='"+plateSourceID+"' ", []).then(res => {
      console.log(res);
      let items: TblPlateCategory[] = [];
      if (res.rows.length > 0){
        console.log(res.rows,"platecategoryyyyyyyyyy");
        for (var i = 0; i < res.rows.length; i++){
          items.push({
            id: res.rows.item(i).id,
            source_id: res.rows.item(i).source_id,
            aber_code: res.rows.item(i).aber_code,
            raqab_code: res.rows.item(i).raqab_code,  
            plate_source_id: res.rows.item(i).plate_source_id,
            adp_code: res.rows.item(i).abp_code,
            name_eng: res.rows.item(i).name_eng,
            name_ar: res.rows.item(i).name_ar
          });
        }
        console.log(items);
      }
      this.plateCategoryData.next(items);
    })
  }

  bulkInsertPlateCategory(items: any) {
    console.log("plate category offline list:",items);
    this.removeAll(this.db_tbl_plate_category);
    let insertRows = [];
    // console.log(items);
    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_plate_category + " (id," +
        "source_id," +
        "aber_code," + 
        "raqab_code," +
        "plate_source_id,"+
        "name_eng, " +
        "name_ar) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [item.id, item.source_id, item.aber_code, item.raqab_code, item.plate_source_id, item.name_eng, item.name_ar]
      ]);
    });

    this.storage.sqlBatch(insertRows).then((result: any) => {
      console.info("Inserted items");
      console.log("insertplatecategory", result);
    }).catch(e => console.log(e));

  }

  /* Plate Category */


  /* Plate Codes */

  fetchPlateCodes(plateCategoryid: any): Observable<TblPlateCodes[]> {
    this.getPlateCodes(plateCategoryid);
    this.isDbReady.next(true);
    return this.plateCodeList.asObservable();
  }



  // Get SideType list
  getPlateCodes(id: any) {
    console.log(id);
    return this.storage.executeSql("SELECT * FROM `tbl_plate_codes` where plate_category_id='"+id+"' ", []).then(res => {
      let items: TblPlateCodes[] = [];
      if (res.rows.length > 0) {
        console.log(res.rows,"platecodesssssssss");
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            source_code: res.rows.item(i).source_code,
            raqab_code: res.rows.item(i).raqab_code,
            raqab_desc_eng: res.rows.item(i).raqab_desc_eng,
            raqab_desc_arb: res.rows.item(i).raqab_desc_arb,
            aber_code: res.rows.item(i).aber_code,
            aber_desc_arb: res.rows.item(i).aber_desc_arb,
            aber_desc_eng: res.rows.item(i).aber_desc_eng,
            source_id: res.rows.item(i).source_id,
            plate_category_id: res.rows.item(i).plate_category_id
          });
        }
      }
      this.plateCodeList.next(items);
    });
  }




  bulkInsertPlateCodes(items: any) {
    console.log("platecodes offline list:", items);
    this.removeAll(this.db_tbl_plate_codes);
    let insertRows = [];
    items.forEach(item => {
      // console.log(item,"platecodes in offline");
      insertRows.push([
        "INSERT INTO " + this.db_tbl_plate_codes + " (id," +
        "source_code," +
        "raqab_code," +
        "raqab_desc_eng," +
        "raqab_desc_arb," +
        "aber_code,"+
        "aber_desc_arb,"+
        "aber_desc_eng,"+
        "source_id," +
        "plate_category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [item.id, item.source_code, item.raqab_code, item.raqab_desc_eng, item.raqab_desc_arb, item.aber_code, item.aber_desc_arb, item.aber_desc_eng, item.source_id, item.plate_category_id]
      ]);
    });

    this.storage.sqlBatch(insertRows).then((result) => {
      console.log(result);
      console.info("Inserted items");
    }).catch(e => console.log(e));

  }
  /* Plate Codes */


  /* Reserved */

  fetchReservedCodes(): Observable<TblReserved[]> {
    this.getReserved();
    this.isDbReady.next(true);
    return this.reservedCodesList.asObservable();
  }



  // Get SideType list
  getReserved() {
    console.log("reserved code entered");
    return this.storage.executeSql("SELECT * FROM `tbl_reserved`", []).then(res => {
      let items: TblReserved[] = [];
      if (res.rows.length > 0) {
        console.log("reserved_code",res.rows.length);
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            reserved_id: res.rows.item(i).reserved_id,
            source_id: res.rows.item(i).source_id,
            reserved_code: res.rows.item(i).reserved_code,
            name_eng: res.rows.item(i).name_eng,
            name_arb: res.rows.item(i).name_arb,
            status: res.rows.item(i).status
          });
        }
      }
      console.log(items);
      this.reservedCodesList.next(items);
    });
  }




  bulkInsertReserved(items: any) {
    this.removeAll(this.db_tbl_reserved);
    let insertRows = [];
    items.forEach(item => {
      console.log(item);
      insertRows.push([
        "INSERT INTO " + this.db_tbl_reserved + " (reserved_id," +
        "source_id, " +
        "reserved_code," +
        "name_eng," +
        "name_arb," +
        "status) VALUES (?, ?, ?, ?, ?, ?)",
        [item.reserved_id,item.source_id, item.reserved_code, item.name_eng, item.name_ar,item.status]
      ]);
    });

    this.storage.sqlBatch(insertRows).then((result) => {
      console.info("Inserted items");
    }).catch(e => console.log(e));

  }
  /* Reserved */


  /* OffLine Violation Creation */

  fetchViolationList(user_id: any): Observable<TblViolation[]> {
    this.getviolationListCount(user_id);
    this.isDbReady.next(true);
    return this.violationList.asObservable();
  }

  getviolationListCount(user_id: any): Promise<any> {
    return this.storage.executeSql("SELECT * FROM `tbl_violationdata` where status = 'Draft' and is_delete_approved_status IS NULL and created_by='" + user_id + "' ", []).then(res => {
      let items: TblViolation[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {

          items.push({
            source_id: '2',
            violation_id: res.rows.item(i).ID,
            voilationType: res.rows.item(i).voilationType,
            voilationTitle: res.rows.item(i).voilationTitle,
            sideCode: res.rows.item(i).sideCode,
            sideCodeID: res.rows.item(i).sideCodeID,
            documentType: res.rows.item(i).documentType,
            documentNo: res.rows.item(i).documentNo,
            sideCodeDescription: res.rows.item(i).sideCodeDescription,
            licenseNo: res.rows.item(i).licenseNo,
            plateNo: res.rows.item(i).plateNo,
            plateSource: res.rows.item(i).plateSource,
            plateCode: res.rows.item(i).plateCode,
            plateCategory:res.rows.item(i).plateCategory,
            plateColor: res.rows.item(i).plateColor,
            oldCode: res.rows.item(i).oldCode,
            violationCategory: res.rows.item(i).violationCategory,
            fineCode: res.rows.item(i).fineCode,
            finePlace: res.rows.item(i).finePlace,
            area: res.rows.item(i).area,
            fineNotes: res.rows.item(i).fineNotes,
            recipientPerson: res.rows.item(i).recipientPerson,
            phone: res.rows.item(i).phone,
            recipientMobile: res.rows.item(i).recipientMobile,
            email: res.rows.item(i).email,
            reservedCode: res.rows.item(i).reservedCode,
            reservedIdNumber: res.rows.item(i).reservedIdNumber,
            ownername: res.rows.item(i).ownername,
            ownerphone: res.rows.item(i).ownerphone,
            ownerdescription: res.rows.item(i).ownerdescription,
            identityDoc: res.rows.item(i).identityDoc,
            identityDoc_file: res.rows.item(i).identityDoc_file,
            address: res.rows.item(i).address,
            description: res.rows.item(i).description,
            dailyFines: res.rows.item(i).dailyFines,
            violationDocument: res.rows.item(i).violationDocument,
            fineAmount: res.rows.item(i).fineAmount,
            animalhitCount: res.rows.item(i).animalhitCount,
            mulltifiles: res.rows.item(i).mulltifiles,
            videofile: res.rows.item(i).videofile,
            video: res.rows.item(i).video,
            created_by: res.rows.item(i).created_by,
            created_on: res.rows.item(i).created_on,
            documentTypeName: res.rows.item(i).documentTypeName,
            other_plate_source : res.rows.item(i).other_plate_source
          });

        }
      }
      console.log('violations', items);
      this.violationList.next(items);
      //return items
    });
  }


  // Get SideType list
  getviolationList(sourceId): Promise<any> {
    return this.storage.executeSql("SELECT * FROM `tbl_violationdata`", []).then(async (res) => {
      debugger
      console.log(res);
      let items: TblViolation[] = [];
      //let amendres:any;
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          console.log(res.rows,"addofflineviolationdata");
          const amendres = await this.storage.executeSql("SELECT * FROM " + this.db_tbl_violations_amend_requests + " where violation_id=" + res.rows.item(i).ID + "", []).then(amendres => {

            console.log("amendrequests", amendres)
            // amendres=amendres;
            return amendres;
          })
          items.push({
            source_id: sourceId,
            violation_id: res.rows.item(i).ID,
            voilationType: res.rows.item(i).voilationType,
            voilationTitle: res.rows.item(i).voilationTitle,
            sideCode: res.rows.item(i).sideCode,
            sideCodeID: res.rows.item(i).sideCodeID,
            documentType: res.rows.item(i).documentType,
            documentNo: res.rows.item(i).documentNo,
            sideCodeDescription: res.rows.item(i).sideCodeDescription,
            licenseNo: res.rows.item(i).licenseNo,
            plateNo: res.rows.item(i).plateNo,
            plateSource: res.rows.item(i).plateSource,
            plateCode: res.rows.item(i).plateCode,
            plateCategory: res.rows.item(i).plateCategory,
            plateColor: res.rows.item(i).plateColor,
            oldCode: res.rows.item(i).oldCode,
            violationCategory: res.rows.item(i).violationCategory,
            fineCode: res.rows.item(i).fineCode,
            finePlace: res.rows.item(i).finePlace,
            area: res.rows.item(i).area,
            fineNotes: res.rows.item(i).fineNotes,
            recipientPerson: res.rows.item(i).recipientPerson,
            phone: res.rows.item(i).phone,
            recipientMobile: res.rows.item(i).recipientMobile,
            email: res.rows.item(i).email,
            reservedCode: res.rows.item(i).reservedCode,
            reservedIdNumber: res.rows.item(i).reservedIdNumber,
            ownername: res.rows.item(i).ownername,
            ownerphone: res.rows.item(i).ownerphone,
            ownerdescription: res.rows.item(i).ownerdescription,
            identityDoc: res.rows.item(i).identityDoc,
            identityDoc_file: res.rows.item(i).identityDoc_file,
            address: res.rows.item(i).address,
            description: res.rows.item(i).description,
            dailyFines: res.rows.item(i).dailyFines,
            violationDocument: res.rows.item(i).violationDocument,
            fineAmount: res.rows.item(i).fineAmount,
            animalhitCount: res.rows.item(i).animalhitCount,
            mulltifiles: res.rows.item(i).mulltifiles,
            videofile: res.rows.item(i).videofile,
            video: res.rows.item(i).video,
            created_by: res.rows.item(i).created_by,
            created_on: res.rows.item(i).created_on,
            documentTypeName: res.rows.item(i).documentTypeName,
            status: res.rows.item(i).status,
            is_delete_approved_status: res.rows.item(i).is_delete_approved_status,
            deletion_for_reason: res.rows.item(i).deletion_for_reason,
            consider_as_aber: res.rows.item(i).consider_as_aber,
            violator_signature: res.rows.item(i).violator_signature,
            other_plate_source: res.rows.item(i).other_plate_source,
            amend_request_raised:res.rows.item(i).amend_request_raised,
            amendrequest: amendres.rows.length > 0 ? {
              violation_id: amendres.rows.item(0).violation_id,
              amend_message: amendres.rows.item(0).amend_message,
              user_id: amendres.rows.item(0).user_id,
              images: amendres.rows.item(0).images.substring(amendres.rows.item(0).images.lastIndexOf('/') + 1),
              status: amendres.rows.item(0).status,
              created_on: amendres.rows.item(0).created_on
            } : ''
          });

        }
      }
      console.log('violations', items);
      // this.violationList.next(items);
      return items
    });
  }




  InsertViolation(items: any): Promise<any> {
    let insertRows = [];
    let violationDocs = [];
    let violationVideos = [];

    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_violationdata + " (voilationType," +
        "voilationTitle," +
        "sideCode," +
        "sideCodeID," +
        "documentType," +
        "documentNo," +
        "sideCodeDescription," +
        "licenseNo," +
        "plateNo," +
        "plateSource," +
        "plateCode," +
        "plateCategory,"+
        "plateColor," +
        "oldCode," +
        "violationCategory," +
        "fineCode," +
        "finePlace," +
        "area," +
        "fineNotes," +
        "recipientPerson," +
        "phone," +
        "recipientMobile," +
        "email," +
        "reservedCode," +
        "reservedIdNumber," +
        "ownername," +
        "ownerphone," +
        "ownerdescription," +
        "identityDoc," +
        "identityDoc_file," +
        "address," +
        "description," +
        "dailyFines," +
        "violationDocument," +
        "fineAmount," +
        "animalhitCount," +
        "mulltifiles," +
        "videofile," +
        "video," +
        "created_by," +
        "created_on," +
        "documentTypeName, docpath, videospath,is_delete_approved_status," +
        "deletion_for_reason,status,consider_as_aber,violator_signature,signaturepath,document_proof_status,other_plate_source) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        //[JSON.stringify(item.violation), item.violationdocs.join(), item.violationvideos,item.violationSyncStatus]
        [
          item.violation.voilationType,
          item.violation.voilationTitle,
          item.violation.sideCode,
          item.violation.sideCodeID,
          item.violation.documentType,
          item.violation.documentNo,
          item.violation.sideCodeDescription,
          item.violation.licenseNo,
          item.violation.plateNo,
          item.violation.plateSource,
          item.violation.plateCode,
          item.violation.plateCategory,
          item.violation.plateColor,
          item.violation.oldCode,
          item.violation.violationCategory,
          item.violation.fineCode,
          item.violation.finePlace,
          item.violation.area,
          item.violation.fineNotes,
          item.violation.recipientPerson,
          item.violation.phone,
          item.violation.recipientMobile,
          item.violation.email,
          item.violation.reservedCode,
          item.violation.reservedIdNumber,
          item.violation.ownername,
          item.violation.ownerphone,
          item.violation.ownerdescription,
          item.violation.identityDoc,
          item.violation.identityDoc_file,
          item.violation.address,
          item.violation.description,
          item.violation.dailyFines,
          item.violation.violationDocument,
          item.violation.fineAmount,
          item.violation.animalhitCount,
          item.violation.mulltifiles,
          item.violation.videofile,
          item.violation.video,
          item.violation.created_by,
          item.violation.created_on,
          item.violation.documentTypeName, item.violation.docpath, item.violation.videospath,
          item.violation.is_delete_approved_status,
          item.violation.deletion_for_reason, 'Draft', item.violation.consider_as_aber, item.violator_signature, item.violation.signaturepath,item.customerwithproof,item.other_plate_source]
      ]);

    });

    this.InsertViolationDocs(items);
    this.InsertViolationVideos(items);
    this.InsertViolatorSignatureDocs(items);
    return this.storage.sqlBatch(insertRows).then((res: any) => {
      console.log(res,"insertviolation");
    }).catch(e => console.log(e));
  }

  UpdateViolationSyncStatus(items: any): Promise<any> {
    return this.storage.executeSql("update " + this.db_tbl_violationdata + " set violationSyncStatus = ?", [1])
      .then(() => console.log('Update Table Success'))
      .catch(e => console.log(e));
  }

  UpdateViolationSyncStatus2(items: any): Promise<any> {
    return this.storage.executeSql("update " + this.db_tbl_violationdata + " set violationSyncStatus = ?", [0])
      .then(() => console.log('Update Table Success'))
      .catch(e => console.log(e));
  }

  DeleteViolationSyncStatus(id: any): Promise<any> {
    return this.storage.executeSql("delete from  " + this.db_tbl_violationdata + " where  id = ?", [id])
      .then(() => {
        //  this.storage.executeSql("delete from "+this.db_tbl_violations_amend_requests+" where violation_id=?",[id]).then(()=>{
        //    console.log("Violation Deleted");
        //  })
      })
      .catch(e => console.log(e));
  }


  DeleteAmendRequest(id: any): Promise<any> {
    return this.storage.executeSql("delete from  " + this.db_tbl_violations_amend_requests + " where  id = ?", [id])
      .then(() => {

      })
      .catch(e => console.log(e));
  }
  fetchViolationDocList(): Observable<TblViolationDocs[]> {
    this.getviolationDocList();
    this.isDbReady.next(true);
    return this.violationDocList.asObservable();
  }



  // Get SideType list tbl_violationdocs tbl_violationvideos
  getviolationDocList(): Promise<any> {
    return this.storage.executeSql("SELECT * FROM `tbl_violationdocs`", []).then(res => {
      let items: TblViolationDocs[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            violationdocs: res.rows.item(i).violationdocs,
            violationSyncStatus: res.rows.item(i).violationSyncStatus
          });
        }
      }
      console.log('violations', items);
      //this.violationDocList.next(items);
      return items;
    });
  }

  InsertViolationDocs(items: any): Promise<any> {
    let insertRows = [];
    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_violationdocs + " (violationdocs," +
        "violationSyncStatus) VALUES (?, ?)",
        //[JSON.stringify(item.violation), item.violationdocs.join(), item.violationvideos,item.violationSyncStatus]
        [item.violationdocs.join(), item.violationSyncStatus]
      ]);
    });

    return this.storage.sqlBatch(insertRows);
  }

  /* Start Violator Signature */
  fetchViolatorSignList(): Observable<TblViolatorSignature[]> {
    this.getviolatorSignature();
    this.isDbReady.next(true);
    return this.violationDocList.asObservable();
  }
  // Get SideType list tbl_violationdocs tbl_violationvideos
  getviolatorSignature(): Promise<any> {
    return this.storage.executeSql("SELECT * FROM `tbl_ViolatorSignature`", []).then(res => {
      let items: TblViolatorSignature[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            violator_signature: res.rows.item(i).violator_signature,
            violationSyncStatus: res.rows.item(i).violationSyncStatus
          });
        }
      }
      console.log('violations', items);
      //this.violationDocList.next(items);
      return items;
    });
  }
  InsertViolatorSignatureDocs(items: any): Promise<any> {
    let insertRows = [];
    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_violator_signature + " (violator_signature," +
        "violationSyncStatus) VALUES (?, ?)",
        //[JSON.stringify(item.violation), item.violationdocs.join(), item.violationvideos,item.violationSyncStatus]
        [item.violator_signature, item.violationSyncStatus]
      ]);
    });
    return this.storage.sqlBatch(insertRows);
  }
  /* End Violator Signature */


  fetchViolationVideosList(): Observable<TblViolationVideos[]> {
    this.getviolationVideosList();
    this.isDbReady.next(true);
    return this.violationVideoList.asObservable();
  }



  // Get SideType list
  getviolationVideosList(): Promise<any> {
    return this.storage.executeSql("SELECT * FROM `tbl_violationvideos`", []).then(res => {
      let items: TblViolationVideos[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            violationvideos: res.rows.item(i).violationvideos,
            violationSyncStatus: res.rows.item(i).violationSyncStatus
          });
        }
      }
      console.log('violations', items);
      //this.violationVideoList.next(items);
      return items;
    });
  }

  InsertViolationVideos(items: any): Promise<any> {
    let insertRows = [];
    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_violationvideos + " (violationvideos," +
        "violationSyncStatus) VALUES (?, ?)",
        //[JSON.stringify(item.violation), item.violationdocs.join(), item.violationvideos,item.violationSyncStatus]
        [item.violationvideos, item.violationSyncStatus]
      ]);
    });

    return this.storage.sqlBatch(insertRows);
  }

  /* offLine Violation Creation */


  /* offline Amend Request */

  fetchAmendRequestList(id: any): Observable<TblViolationsAmendRequests[]> {
    this.getviolationAmendRequests(id);
    this.isDbReady.next(true);
    return this.violationAmendRequestList.asObservable();
  }



  // Get SideType list
  getviolationAmendRequests(id: any): Promise<any> {
    return this.storage.executeSql("SELECT ar.* FROM " + this.db_tbl_violationdata + " v INNER JOIN tbl_violations_amend_requests ar " +
      "ON v.id=ar.violation_id " +
      "where v.id='" + id + "'", []).then(res => {
        let items: TblViolationsAmendRequests[] = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            items.push({
              violation_id: res.rows.item(i).violation_id,
              amend_message: res.rows.item(i).amend_message,
              user_id: res.rows.item(i).user_id,
              images: res.rows.item(i).images,
              status: res.rows.item(i).status,
              created_on: res.rows.item(i).created_on,
            });
          }
        }
        return items;
      });
  }

  getviolationAmenddocs(): Promise<any> {
    return this.storage.executeSql("SELECT ar.* FROM tbl_violations_amend_requests ar", []).then(res => {
      let items: TblViolationsAmendRequests[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            violation_id: res.rows.item(i).violation_id,
            amend_message: res.rows.item(i).amend_message,
            user_id: res.rows.item(i).user_id,
            images: res.rows.item(i).images,
            status: res.rows.item(i).status,
            created_on: res.rows.item(i).created_on,
          });
        }
      }
      return items;
    });
  }

  InsertViolationAmendRequest(items: any): Promise<any> {
    let insertRows = [];
    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_violations_amend_requests + " (violation_id," +
        "amend_message,user_id,images,status,created_on) VALUES (?, ?,?,?,?,?)",
        //[JSON.stringify(item.violation), item.violationdocs.join(), item.violationvideos,item.violationSyncStatus]
        [item.violation_id, item.amend_message, item.user_id, item.images, item.status, item.created_on]
      ]);
    });
    items.forEach(item => {
    this.storage.executeSql("update " + this.db_tbl_violationdata + " set amend_request_raised = 'Pending' where id='" + item.violation_id + "'", [])
      .then(() => console.log('Update Table Success'))
      .catch(e => console.log(e));
    })
    return this.storage.sqlBatch(insertRows);
  }

  /* offline Amend Request */


  /* List Violations */

  fetchviolationtransactionlist(id: any): Observable<violationsTransactionsList[]> {
    this.getviolationTransactions(id);
    this.isDbReady.next(true);
    return this.violationTransactionList.asObservable();
  }

  getviolationTransactions(id: any): Promise<any> {
    return this.storage.executeSql("SELECT vmr.status,v.ID as id,fine.description_eng,fine.description,v.violationCategory,v.documentNo AS document_no,v.licenseNo AS license_no, " +
      "'' AS reference_number, " +
      "v.PlateNo AS license_plate_no,v.fineAmount AS fine_amount,CAST(v.created_on AS CHAR) created_on,v.finePlace AS fine_place,'Pending' AS payment_status,v.voilationType AS side_type " +
      "FROM `tbl_violationdata` v " +
      "INNER JOIN tbl_fine_categories fine ON v.violationCategory = fine.fine_category_id " +
      "LEFT JOIN tbl_violations_amend_requests vmr ON v.id = vmr.violation_id " +
      "WHERE v.created_by='" + id + "' and v.status = 'Draft' and is_delete_approved_status IS NULL ORDER BY v.id DESC", []).then(res => {
        let items: violationsTransactionsList[] = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            items.push({
              status: res.rows.item(i).status,
              id: res.rows.item(i).id,
              description_eng: res.rows.item(i).description_eng,
              description: res.rows.item(i).description,
              violationCategory: res.rows.item(i).violationCategory,
              document_no: res.rows.item(i).document_no,
              license_no: res.rows.item(i).license_no,
              reference_number: res.rows.item(i).reference_number,
              license_plate_no: res.rows.item(i).license_plate_no,
              fine_amount: res.rows.item(i).fine_amount,
              created_on: res.rows.item(i).created_on,
              fine_place: res.rows.item(i).fine_place,
              payment_status: res.rows.item(i).payment_status,
              side_type: String(res.rows.item(i).side_type),
            });
          }
        }
        console.log('violations', items);
        this.violationTransactionList.next(items);
      });
  }

  /* List Violations */


  /* View Violation */

  // fetchviolationbyid(id:any): Observable<ListViolations[]> {
  //   let obj:any={};
  //   this.getviolationDetails(id).then((res)=>{
  //     console.log("violationView",res);
  //     obj.ViolatiionList=res;
  //   });
  //   this.isDbReady.next(true);
  //   return this.violationViewList.asObservable();
  // }

  async fetchviolationbyid(id: any): Promise<any> {
    let obj: any = {};
    let sideTypeID: any;
    let documentType: any;
    let fineCategoryID: any;
    let fineCode: any;
    await this.getviolationDetails(id).then((res) => {
      console.log("violationView", res);
      obj.ViolatiionList = res[0];
      obj.tbl_side_codesList = {
        description: res[0].sideCodeDescription === null ? '' : res[0].sideCodeDescription.replace(/^-/, ''),
        description_eng: res[0].sideCodeDescription === null ? '' : res[0].sideCodeDescription.replace(/^-/, '')
      }
      obj.violation_title_idlist = {
        violation_ar_title: res[0].voilationTitle,
        violation_eng_title: res[0].voilationTitle
      }
      sideTypeID = res[0].side_type;
      documentType = res[0].document_type;
      fineCategoryID = res[0].violationCategory;
      fineCode = res[0].fineCode;
    });

    await this.getSideTypesByID(sideTypeID).then((res) => {
      obj.tbl_side_types_list = res[0];
    })

    await this.getDocumentTypesByType(documentType).then((res) => {
      console.log(res,"offlineviolationdetails");
      obj.tbl_document_type_list = res[0];
      if(obj.tbl_document_type_list == undefined){
        obj.tbl_document_type_list = '';
      }
    })

    await this.getFineCategoriesByID(fineCategoryID).then((res) => {
      obj.tbl_fine_categories_list = res[0]
      fineCategoryID = res[0].fine_category_id;
    })

    await this.getFineCategoryCodesByID(fineCode).then((res) => {
      obj.tbl_fine_categories_code_list = res[0];
    })

    return obj;
  }

  async getviolationDetails(id: any): Promise<any> {
    return this.storage.executeSql("SELECT video AS violation_video,identityDoc AS identity_doc,phone,sideCodeID AS side_code,documentType AS document_type,voilationType AS side_type " +
      ",licenseNo AS license_no,PlateNo AS license_plate_no,ps.name_eng AS plate_source,pc.raqab_desc_eng AS plate_code,plateColor AS plate_color, pd.name_eng AS plate_category " +
      ",documentNo AS document_no,sideCodeDescription as description_side_code,voilationTitle, violationCategory,fineCode, " +
      "CASE " +
      "WHEN voilationType=1 THEN " +
      "sideCodeDescription ||'-'||documentTypeName||'-'||documentNo " +
      "WHEN voilationType=2 THEN " +
      "sideCodeDescription||'-'||licenseNo " +
      "WHEN voilationType=3 THEN " +
      "plateNo||'-'||ps.name_eng||'-'||pc.raqab_desc_eng||'-'||pd.name_eng " +
      "END AS sideCodeDescription, finePlace AS fine_place,a.name_eng  area,fineNotes AS notes,'' AS fine_no,recipientPerson AS recipient_person, " +
      "recipientMobile AS recipient_mobile,email,reservedCode AS reserved_code, r.name_eng as r_name_eng ,r.name_arb as r_name_arb,reservedIdNumber AS reserved_number,address,description,dailyFines,mulltifiles AS violation_docs, " +
      "fineAmount AS fine_amount,'' AS reference_number,'Draft' AS status,ownername AS owner_name,ownerphone AS owner_number,ownerdescription AS owner_identity_description, docpath, videospath,consider_as_aber,violator_signature,signaturepath,document_proof_status,other_plate_source " +
      "FROM tbl_violationdata v " +
      "LEFT JOIN tbl_areas a ON v.area=a.area_code " +
      "LEFT JOIN tbl_plate_sources ps ON v.plateSource = ps.car_sid " +
      "LEFT JOIN tbl_plate_codes pc ON v.plateCode = pc.raqab_code " +
      "LEFT JOIN tbl_plate_category pd ON v.plateCategory = pd.raqab_code " + 
      "LEFT JOIN tbl_reserved r on r.reserved_code = v.reservedCode " +
      "WHERE v.ID=" + id + "", []).then(res => {
        let items: ListViolations[] = [];
        if (res.rows.length > 0) {
          console.log(res.rows);
          for (var i = 0; i < res.rows.length; i++) {
            items.push({
              violation_video: res.rows.item(i).violation_video,
              identity_doc: res.rows.item(i).identity_doc,
              phone: res.rows.item(i).phone,
              side_code: res.rows.item(i).side_code,
              document_type: res.rows.item(i).document_type,
              side_type: String(res.rows.item(i).side_type),
              license_no: res.rows.item(i).license_no,
              license_plate_no: res.rows.item(i).license_plate_no,
              plate_source: res.rows.item(i).plate_source,
              plate_code: res.rows.item(i).plate_code,
              plate_category: res.rows.item(i).plate_category,
              plate_color: res.rows.item(i).plate_color,
              violationCategory: res.rows.item(i).violationCategory,
              fineCode: res.rows.item(i).fineCode,
              document_no: res.rows.item(i).document_no,
              sideCodeDescription: res.rows.item(i).sideCodeDescription,
              voilationTitle: res.rows.item(i).voilationTitle,
              description_side_code: res.rows.item(i).description_side_code,
              fine_place: res.rows.item(i).fine_place,
              area: res.rows.item(i).area,
              notes: res.rows.item(i).notes,
              fine_no: res.rows.item(i).fine_no,
              recipient_person: res.rows.item(i).recipient_person,
              recipient_mobile: res.rows.item(i).recipient_mobile,
              email: res.rows.item(i).email,
              reserved_code: res.rows.item(i).reserved_code,
              reserved_number: res.rows.item(i).reserved_number,
              r_name_eng: res.rows.item(i).r_name_eng,
              r_name_arb: res.rows.item(i).r_name_arb,
              address: res.rows.item(i).address,
              description: res.rows.item(i).description,
              dailyFines: res.rows.item(i).dailyFines,
              violation_docs: res.rows.item(i).violation_docs,
              fine_amount: res.rows.item(i).fine_amount,
              reference_number: res.rows.item(i).reference_number,
              status: res.rows.item(i).status,
              owner_name: res.rows.item(i).owner_name,
              owner_number: res.rows.item(i).owner_number,
              owner_identity_description: res.rows.item(i).owner_identity_description,
              docpath: res.rows.item(i).docpath,
              videospath: res.rows.item(i).videospath,
              consider_as_aber: res.rows.item(i).consider_as_aber,
              violator_signature: res.rows.item(i).violator_signature,
              signaturepath: res.rows.item(i).signaturepath,
              document_proof_status:res.rows.item(i).document_proof_status,
              other_plate_source : res.rows.item(i).other_plate_source,
            });
          }
        }
        console.log('violations', items);
        //this.violationViewList.next(items);
        return items;
      });
  }




  /* Get Notes  */
  getviolationNotes(id: any): Promise<any> {
    return this.storage.executeSql("SELECT fineNotes FROM `tbl_violationdata` WHERE `id`='" + id + "'", []).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {

          items.push({ notes: res.rows.item(i).fineNotes })
        }

      }
      return items;
    })
  }

  updateViolationNotes(id: any, notes: any) {
    return this.storage.executeSql("update " + this.db_tbl_violationdata + " set fineNotes = '" + notes + "' where id='" + id + "'", [])
      .then(() => console.log('Update Table Success'))
      .catch(e => console.log(e));
  }

  cancelViolationRequest(id: any, data: any) {
    return this.storage.executeSql("update " + this.db_tbl_violationdata + " set is_delete_approved_status = '" + data.status + "',deletion_for_reason='" + data.reason + "' where id='" + id + "'", [])
      .then(() => console.log('Update Table Success'))
      .catch(e => console.log(e));
  }

  /* Get Notes */

  /* Publish Violation */

  publishViolation(id: any) {
    return this.storage.executeSql("update " + this.db_tbl_violationdata + " set status = 'Open' where id='" + id + "'", [])
      .then(result => { return result.rows })
      .catch(e => console.log(e));
  }

  /* Publish Violation */


  /* Start  User Creation and Fetching */


  // Get SideType list
  validateUser(data) {
    //console.log(data);
    //console.log(this.db_tbl_user);
    //console.log("SELECT * FROM `tbl_user` WHERE email_id='" + data.email + "' and password= '"+ data.password + "' and  user_type='12' ");
    const sqlQuery = "SELECT * FROM `tbl_user` WHERE email_id='" + data.email + "'  and password= '"+ data.password + "' and  user_type='12' ";
    console.log(sqlQuery,"sqlQuery");
    return this.storage.executeSql(sqlQuery , []).then(res => {
      console.log(res,"tblusers");
      let items: TblUsers[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            user_id: res.rows.item(i).user_id,
            employee_id: res.rows.item(i).employee_id,
            first_name: res.rows.item(i).first_name,
            last_name: res.rows.item(i).last_name,
            first_name_arb: res.rows.item(i).first_name_arb,
            last_name_arb: res.rows.item(i).last_name_arb,
            serial_number: res.rows.item(i).serial_number,
            email_id: res.rows.item(i).email_id,
            mobile_no: res.rows.item(i).mobile_no,
            profile_pic: res.rows.item(i).profile_pic,
            password: res.rows.item(i).password,
            status: res.rows.item(i).status,
            source_id: res.rows.item(i).source_id,
            created_on: res.rows.item(i).created_on,
            created_by: res.rows.item(i).created_by,
            updated_on: res.rows.item(i).updated_on,
            updated_by: res.rows.item(i).updated_by,
            last_logged_on: res.rows.item(i).last_logged_on,
            password_token: res.rows.item(i).password_token,  
            side_type: res.rows.item(i).side_type,
            user_type: res.rows.item(i).user_type,
            pwd_token_created_on: res.rows.item(i).pwd_token_created_on,
            sf_userid: res.rows.item(i).sf_userid,
            language: res.rows.item(i).language,
            chc_department_id: res.rows.item(i).chc_department_id,
            sector: res.rows.item(i).sector ,
            is_chc_access:res.rows.item(i).is_chc_access,
            user_token: res.rows.item(i).user_token,
            agency_id: res.rows.item(i).agency_id,
          });
        }
      }
      console.log(items);
      return items;
   
      
    });
  }




  bulkInsertUsers(items: any): Promise<any>{
    return new Promise((resolve, reject)=>{

    this.removeAll(this.db_tbl_user);
    let insertRows = [];
    items.forEach(item => {
      insertRows.push([
        "INSERT INTO " + this.db_tbl_user + " (user_id,employee_id," +
        "first_name," +
        "last_name," +
        "first_name_arb," +
        "last_name_arb," +
        "serial_number," +
        "email_id," +
        "mobile_no," +
        "profile_pic," +
        "password," +
        "status," +
        "source_id," +
        "created_on," +
        "created_by," +
        "updated_on," +
        "updated_by," +
        "last_logged_on," +
        "password_token," +
        "side_type," +
        "user_type," +
        "pwd_token_created_on," +
        "sf_userid," +
        "language," +
        "chc_department_id," +
        "sector," +
        "is_chc_access," +
        "user_token,"+
        "agency_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [item.user_id, item.employee_id, item.first_name, item.last_name, item.first_name_arb, item.last_name_arb, item.serial_number, item.email_id,
        item.mobile_no, item.profile_pic, item.password, item.status, item.source_id, item.created_on, item.created_by, item.updated_on,
        item.updated_by, item.last_logged_on, item.password_token, item.side_type, item.user_type, item.pwd_token_created_on,
        item.sf_userid, item.language, item.chc_department_id, item.sector, item.is_chc_access, item.user_token, item.agency_id]
      ]);
    });
    console.log(items);
    
    console.log(insertRows); 
    
    this.storage.sqlBatch(insertRows).then((result: any) => {
      console.info("Inserted Users",result);
      console.log("offline_usersData", result);
      resolve(result)
    }).catch(e =>{
      console.log("error", e);
      reject(e);
    })  
  });
  }



  /* End */


  public remove(tableName, item) {
    let sqlText;
    let values;
    sqlText = `delete from ${tableName} where id = ? `;
    values = [item.id || null]
    return this.storage.executeSql(sqlText, values);
  }

  public removeAll(tableName) {
    let sqlText;
    sqlText = `delete from ${tableName}`;
    return this.storage.executeSql(sqlText);
  }

}

/* plateSource, platecategory, platecode BY ID */
