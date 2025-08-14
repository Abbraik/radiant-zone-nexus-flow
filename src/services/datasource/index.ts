import { IDataProvider } from './types';
import { mockProvider } from './mock/adapters';
import { apiProvider } from './api/adapters';

const SOURCE = (import.meta.env.VITE_DATA_SOURCE ?? 'mock').toLowerCase();
export const ds: IDataProvider = SOURCE === 'api' ? apiProvider : mockProvider;
