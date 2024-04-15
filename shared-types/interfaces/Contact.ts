import type { EntityResponse } from './defaults';

export interface ContactInfo extends EntityResponse {}

export interface ContactApi extends EntityResponse {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  responsible_user_id: number;
  group_id: number;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  closest_task_at: null;
  is_deleted: boolean;
  is_unsorted: boolean;
  custom_fields_values: {
    field_id: number;
    field_name: string;
    field_code: string;
    field_type: string;
    values: {
      value: string;
      enum_id: number;
      enum_code: string;
    }[];
  }[] | null;
  account_id: number;
}

export interface ContactsApiResponse {
  _page: number;
  _links: {
    self: {
      href: string;
    };
  };
  _embedded: {
    contacts: ContactApi[];
  };
}
