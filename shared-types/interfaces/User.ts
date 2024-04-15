import type { EntityResponse } from './defaults';

type Rights = {
  view?: string;
  edit?: string;
  add?: string;
  delete?: string;
  export?: string;
};

export interface UserApi extends EntityResponse {
  id: number;
  name: string;
  email: string;
  lang: string;
  rights: {
    leads: Rights;
    contacts: Rights;
    companies: Rights;
    tasks: Rights;
    mail_access: boolean;
    catalog_access: boolean;
    files_access: boolean;
    status_rights: {
      entity_type: string;
      pipeline_id: number;
      status_id: number;
      rights: Rights;
    }[];
    catalog_rights: any;
    custom_fields_rights: any;
    oper_day_reports_view_access: boolean;
    oper_day_user_tracking: boolean;
    is_admin: boolean;
    is_free: boolean;
    is_active: boolean;
    group_id: any;
    role_id: any;
  };
}

export interface UsersApiResponse extends EntityResponse {
  page: number;
  _links: {
    self: {
      href: string;
    };
  };
  _embedded: {
    users: UserApi[];
  };
}
