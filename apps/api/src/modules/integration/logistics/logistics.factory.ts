import { ncmProvider } from './providers/ncm.provider.js';
import { dashProvider } from './providers/dash.provider.js';
import { pathaoProvider } from './providers/pathao.provider.js';
import type { LogisticsProviderName } from './shipment.model.js';
import type { LogisticsProvider } from './logistics.interface.js';

const providers: Record<string, LogisticsProvider> = {
  pathao: pathaoProvider,
  ncm: ncmProvider,
  dash: dashProvider,
};

export function registerLogisticsProvider(provider: LogisticsProvider) {
  providers[provider.name] = provider;
}

export function getLogisticsProvider(name: LogisticsProviderName): LogisticsProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unsupported logistics provider: ${name}`);
  }
  return provider;
}

export function getSupportedProviders(): string[] {
  return Object.keys(providers);
}
