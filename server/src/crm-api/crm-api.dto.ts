export type LeadsDto = {
  id: number;
  name: string;
  price: number;
  createdAt: number;

  embedded: {
    status?: {
      id: number;
      name: string;
      sort: number;
      is_default: boolean;
      color: string;
      type: number;
    };
    responsibleUser: {
      id: number;
      name: string;
      email: string;
      lang: string;
    };
    contacts: {
      id: number;
      name: string;
      first_name: string;
      last_name: string;
      custom_fields_values: any[] | null;
    }[];
  };
}[];
