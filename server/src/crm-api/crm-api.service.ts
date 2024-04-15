import * as _ from 'lodash';
import { Injectable, OnModuleInit } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  UserApi,
  UsersApiResponse,
  PipelineApi,
  PipelinesApiResponse,
  LeadApi,
  LeadDto,
  LeadsApiResponse,
  LeadsDto,
  ContactApi,
  ContactsApiResponse,
} from '@shared-types/index';

@Injectable()
export class CrmApiService implements OnModuleInit {
  client: AxiosInstance;
  token: string;
  refreshToken: string;
  refreshRequest: Promise<AxiosResponse<any, any>> | null = null;

  async onModuleInit(): Promise<void> {
    this.client = axios.create({
      baseURL: 'https://warckut.amocrm.ru/api/v4/',
    });
    this.client.interceptors.request.use(
      (config) => {
        if (!this.token) {
          return config;
        }

        const newConfig = {
          ...config,
        };

        newConfig.headers.Authorization = `Bearer ${this.token}`;
        return newConfig;
      },
      (e) => Promise.reject(e),
    );
    this.client.interceptors.response.use(
      (r) => r,
      async (error) => {
        if (
          !this.refreshToken ||
          error.response.status !== 401 ||
          error.config.retry
        ) {
          throw error;
        }
        if (!this.refreshRequest) {
          const data = {
            client_id: process.env.AUTH_CLIENT_ID,
            client_secret: process.env.AUTH_CLIENT_SECRET,
            grant_type: 'authorization_code',
            refresh_token: this.refreshToken,
            redirect_uri: 'https://warckut.github.io/retrowave/',
          };
          this.refreshRequest = this.client.post(
            'https://warckut.amocrm.ru/oauth2/access_token',
            data,
          );
        }
        const { data } = await this.refreshRequest;
        this.token = data.access_token;
        this.refreshToken = data.refresh_token;
        const newRequest = {
          ...error.config,
          retry: true,
        };
        return this.client(newRequest);
      },
    );
    await this.fetchTokens();
  }

  async getLeads(query: any): Promise<LeadsDto | undefined> {
    try {
      const pipelinesPromise = this.getPipelines();
      const usersPromise = this.getUsers();

      const result = await this.client<LeadsApiResponse>({
        method: 'get',
        url: '/leads',
        params: new URLSearchParams({ ...query, with: 'contacts' }),
      });
      const contactsPromise = this.getContactsByLeads(
        result.data._embedded.leads,
      );
      const res = this.attach(
        result.data._embedded.leads,
        await pipelinesPromise,
        await usersPromise,
        await contactsPromise,
      );
      return { ...result.data, _embedded: { leads: res } };
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  }

  attach(
    leads: LeadApi[],
    pipelines: PipelineApi[],
    users: UserApi[],
    contacts: ContactApi[],
  ): LeadDto[] {
    const usersById = _.keyBy(users, 'id');
    const contactsById = _.keyBy(contacts, 'id');
    const pipelinesById = _.keyBy(pipelines, 'id');
    return leads.map((lead) => {
      const leadPipline = pipelinesById[lead.pipeline_id];
      const status = leadPipline._embedded.statuses.find(
        (v) => v.id === lead.status_id,
      );
      const leadContacts = lead._embedded.contacts.map(
        (v) => contactsById[v.id],
      );

      return {
        ...lead,
        _embedded: {
          status,
          responsibleUser: usersById[lead.responsible_user_id],
          contacts: leadContacts,
        },
      };
    });
  }

  async getUsers(): Promise<UserApi[]> {
    const result = await this.client<UsersApiResponse>({
      method: 'get',
      url: '/users',
    });
    return result.data._embedded.users;
  }

  async getPipelines(): Promise<PipelineApi[]> {
    const result = await this.client<PipelinesApiResponse>({
      method: 'get',
      url: `/leads/pipelines`,
    });

    return result.data._embedded.pipelines;
  }

  async getContactsByLeads(leads: LeadApi[]): Promise<ContactApi[]> {
    const ids = leads.reduce((acc, curr) => {
      const contactsIds = curr._embedded.contacts.map(
        (v, i) => `filter[id][${acc.length + i}]=${v.id}`,
      );
      return [...acc, ...contactsIds];
    }, []);

    const url = `/contacts?${ids.join('&')}`;
    const result = await this.client<ContactsApiResponse>({
      method: 'get',
      url,
    });
    return result.data._embedded.contacts;
  }

  async fetchTokens() {
    console.log('tokens');
    const data = {
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: process.env.AUTH_CODE,
      redirect_uri: 'https://warckut.github.io/retrowave/',
    };

    try {
      const res = await this.client({
        method: 'post',
        url: `https://warckut.amocrm.ru/oauth2/access_token`,
        data,
      });
      console.log(res.data);
      this.token = res.data.access_token;
      this.refreshToken = res.data.refresh_token;
    } catch (e) {
      console.error(e.response.data);
    }
  }
}
