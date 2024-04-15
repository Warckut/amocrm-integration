import type { EntityResponse } from './defaults';

export interface StatusApi extends EntityResponse {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  pipeline_id: number;
  color: string;
  type: number;
  account_id: number;
}

export interface PipelineApi extends EntityResponse {
  id: number;
  name: string;
  sort: number;
  is_main: boolean;
  is_unsorted_on: boolean;
  is_archive: boolean;
  account_id: number;
  _links: {
    self: {
      href: string;
    };
  };
  _embedded: {
    statuses: StatusApi[];
  };
}

export interface PipelinesApiResponse {
  _page: number;
  _links: {
    self: {
      href: string;
    };
  };
  _embedded: {
    pipelines: PipelineApi[];
  };
}
