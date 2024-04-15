<script setup lang="ts">
import type { ColumnsType } from "ant-design-vue/es/table/Table";
import type { LeadsDto, LeadDto } from "@shared-types/index";

const { data, pending } = await useAsyncData<
  LeadsDto,
  unknown,
  LeadDto[],
  any,
  undefined
>(
  "leads",
  () =>
    $fetch(`http://localhost:3001/api/leads`, {
      query: { page: 1, limit: 250 },
    }),
  {
    transform: (input) => input._embedded.leads,
  }
);

const columns: ColumnsType<LeadDto> = [
  {
    title: "Название",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Бюджет",
    dataIndex: "price",
    key: "price",
    customRender: ({ record }) => formatPrice(record.price),
    align: "right",
    ellipsis: true,
  },
  {
    title: "Статус",
    dataIndex: ["_embedded", "status", "name"],
    key: "status",
  },
  {
    title: "Ответственный",
    dataIndex: ["_embedded", "responsibleUser", "name"],
    key: "responsibleUser",
  },
  {
    title: "Дата создания",
    dataIndex: "created_at",
    key: "date",
    customRender: ({ record }) => formatDate(record.created_at),
  },
];
</script>

<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    :loading="pending"
  >
  </a-table>
</template>
