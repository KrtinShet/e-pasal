import { vi } from 'vitest';

vi.mock('../../order.model.js', () => ({
  Order: {
    create: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../../../product/product.model.js', () => ({
  Product: {
    find: vi.fn(),
  },
}));

vi.mock('../../../inventory/inventory.service.js', () => ({
  inventoryService: {
    reserveStock: vi.fn(),
    releaseStock: vi.fn(),
    confirmStock: vi.fn(),
  },
}));

export { Order } from '../../order.model.js';
export { Product } from '../../../product/product.model.js';
export { inventoryService } from '../../../inventory/inventory.service.js';
export { orderService } from '../../order.service.js';
