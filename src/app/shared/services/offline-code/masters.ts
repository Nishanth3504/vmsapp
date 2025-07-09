import { AppRoutingModule } from "src/app/app-routing.module";

export class TblSideTypes {

    side_type_id?: number;
    side_type_code?: number;
    name_eng?: string;
    name_ar?: string;
    source_id?: number;
    side_type_short_desc?: string;
    status?: string;
    created_by?: number;
    updated_by?: number;
    created_on?: string;
    updated_on?: string;
}


export class TblDocumentTypes {

    id?: number;
    code?: number;
    name_eng?: string;
    name_ar?: string;
    status?: string;
    created_by?: number;
    updated_by?: number;
    created_on?: string;
    updated_on?: string;
}

export class TblFineCategories {
    fine_category_id?: number;
    description?: string;
    description_eng?: string;
    source_id?: number;
    side_type?: number;
    repeating_type?: string;
    status?: string;
    is_deleted?: string;
    created_by?: number;
    updated_by?: number;
    created_on?: string;
    updated_on?: string;
}

export class TblFineCategoryCodes {
    fine_code_id?: number;
    fine_code_reffer_no?: number;
    fine_category_id?: number;
    description?: string;
    description_eng?: string;
    fine_amount?: number;
    repeating?: number;
    serial?: number;
    violate_title?: string;
    manual_ref_no?: string;
    field_need_count?: number;
    bnd?: number;
    ord?: number;
    old?: number;
    agency_id?: number;
    dept_id?: number;
    road_fees?: number;
    per_day?: number;
    other_arb_info?: string;
    other_eng_info?: string;
    basic_amount?: number;
    created_by?: number;
    updated_by?: number;
    created_on?: string;
    updated_on?: string;
}


export class TblAreas {
    area_id?: number;
    area_code?: number;
    name_eng?: string;
    name_ar?: string;
    status?: string;
    created_by?: number;
    updated_by?: number;
    created_on?: string;
    updated_on?: string;
    latitude?: number;
    longtitude?: number;
}

export class TblPlateCodes {
    id?: number;
    source_code?: string;
    raqab_code?: string;
    aber_code?: string;
    adp_code?: string;
    raqab_desc_eng?: string;
    raqab_desc_arb?: string;
    aber_desc_eng?: string;
    aber_desc_arb?: string;
    federal_desc_eng?: string;
    federal_desc_arb?: string;
    status?: string;
    created_by?: number;
    updated_by?: number;
    created_on?: string;
    updated_on?: string;
    plate_code_desc?: string;
    source_id ?: number;
    plate_category_id ?: string;
}

export class TblPlateSources {
    car_sid?: number;
    source_id?: number;
    raqab_code?: number;
    aber_code?: string;
    adp_code?: string;
    name_eng?: string;
    name_ar?: string;
    status?: string;
    created_by?: number;
    updated_by?: number;
    created_on?: string;
    updated_on?: string;
}

export class TblPlateCategory {
    id?: string;
    source_id?: string;
    aber_code?: string;
    raqab_code?: string;
    plate_source_id?: string;
    adp_code?: string;
    name_eng?: string;
    name_ar?: string; 
}

export class TblReserved {
    reserved_id?: number;
    reserved_code?: number;
    name_eng?: string;
    name_arb?: string;
    status?: string;
    source_id?: string;
    // created_by?: number;
    // updated_by?: number;
    // created_on?: string;
    // updated_on?: string;
}

export class TblViolation {

    source_id?: string;
    violation_id?: number;
    voilationType?: number;
    voilationTitle?: string;
    sideCode?: string;
    sideCodeID?: string;
    documentType?: number;
    documentNo?: string;
    sideCodeDescription?: string;
    licenseNo?: string;
    plateNo?: string;
    plateSource?: string;
    plateCode?: string;
    plateColor?: string;  
    plateCategory?: string;
    oldCode?: string;
    violationCategory?: string;
    fineCode?: string;
    finePlace?: string;
    area?: number;
    fineNotes?: string;
    recipientPerson?: string;
    phone?: string;
    recipientMobile?: string;
    email?: string;
    reservedCode?: string;
    reservedIdNumber?: string;
    ownername?: string;
    ownerphone?: string;
    ownerdescription?: string;
    identityDoc?: string;
    identityDoc_file?: string;
    address?: string;
    description?: string;
    dailyFines?: string;
    violationDocument?: string;
    fineAmount?: number;
    animalhitCount?: string;
    mulltifiles?: string;
    videofile?: string;
    video?: string;
    created_by?: string;
    created_on?: string;
    documentTypeName?: string;
    docpath?: string;
    videospath?: string;
    is_delete?:string;
    is_delete_approved_status?: string;
    deletion_for_reason?: string;
    status?: string;
    consider_as_aber?: string;
    violator_signature?: string;
    amendrequest?: any;
    other_plate_source?:any;
    amend_request_raised?:any;
}

export class TblViolationDocs {
    violationdocs?: string;
    violationSyncStatus?: number;
}

export class TblViolatorSignature {
    violator_signature?: string;
    violationSyncStatus?: number;
}

export class TblViolationVideos {
    violationvideos?: string;
    violationSyncStatus?: number;
}

export class TblViolationsAmendRequests {
    id?: number;
    violation_id?: number;
    amend_message?: string;
    user_id?: number;
    images?: string;
    status?: string;
    created_on?: string;
}

export class ListViolations {
    violation_video?: string;
    identity_doc?: string;
    phone?: string;
    side_code?: string;
    document_type?: string;
    side_type?: string;
    license_no?: string;
    license_plate_no?: string;
    plate_source?: string;
    plate_code?: string;
    plate_category?: string;
    plate_color?: string;
    violationCategory?: string;
    fineCode?: string;
    document_no?: string;
    sideCodeDescription?: string;
    voilationTitle?: string;
    description_side_code?: string;
    fine_place?: string;
    area?: string;
    notes?: string;
    fine_no?: string;
    recipient_person?: string;
    recipient_mobile?: string;
    email?: string;
    reserved_code?: string;
    reserved_number?: string;
    r_name_eng?: string;
    r_name_arb?: string;
    address?: string;
    description?: string;
    dailyFines?: string;
    violation_docs?: string;
    fine_amount?: string;
    reference_number?: string;
    status?: string;
    owner_name?: string;
    owner_number?: string;
    owner_identity_description?: string;
    docpath?: string;
    videospath?: string;
    consider_as_aber?: string;
    violator_signature?: string;
    signaturepath?: string;
    document_proof_status?:string;
    other_plate_source?:string;
    abstract ?: string;
}


export class violationsTransactionsList {

    status?: number;
    id?: number;
    description_eng?: string;
    description?: string;
    violationCategory?: number;
    document_no?: string;
    license_no?: string;
    reference_number?: string;
    license_plate_no?: string;
    fine_amount?: string;
    created_on?: string;
    fine_place?: string;
    payment_status?: string;
    side_type?: string;
}

export class TblUsers {
    user_id?: string;
    employee_id?: string;
    first_name?: string;
    last_name?: string;
    first_name_arb?: string;
    last_name_arb?: string;
    serial_number?: string;
    email_id?: string;
    mobile_no?: string;
    profile_pic?: string;
    password?: string;
    status?: string;
    source_id?: string;
    created_on?: string;
    created_by?: string;
    updated_on?: string;
    updated_by?: string;
    last_logged_on?: string;
    password_token?: string;
    side_type?: string;
    user_type?: string;
    pwd_token_created_on?: string;
    sf_userid?: string;
    language?: string;
    chc_department_id?: string;
    sector?: string;
    is_chc_access?: string;
    user_token?: string;
    agency_id?: string;

}
