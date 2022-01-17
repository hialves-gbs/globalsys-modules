import { PrismaHandler } from '../orm/prisma';
import { TypeormHandler } from '../orm/typeorm';

export const integrationOrms = {
  typeorm: TypeormHandler,
  prisma: PrismaHandler,
};

export const tenantsConfig = {
  branches: {
    tableName: 'branches',
  },
  clients: {
    tableName: 'clients',
  },
  clientPhones: {
    tableName: 'client_phones',
  },
  products: {
    tableName: 'products',
  },
  orders: {
    tableName: 'orders',
  },
  sellers: {
    tableName: 'sellers',
  },
  griffe: {
    tableName: 'grife',
  },
  saleDetail: {
    tableName: 'sale_detail',
  },
  customersMetrics: {
    tableName: 'customers_metrics',
  },
  segmentation: {
    tableName: 'segmentation',
  },
  segmentationConfigs: {
    tableName: 'segmentation_configs',
  },
  groupProductsClients: {
    tableName: 'group_products_clients',
  },
  appointmentsMenu: {
    tableName: 'appointments_menu',
  },
};
