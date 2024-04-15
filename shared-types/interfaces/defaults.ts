export interface EntityResponse {
  id: number;
  _links: {
    self: {
      href: string;
    };
  };
  _embedded?: Record<string, EntityResponse | EntityResponse[]>;
}
