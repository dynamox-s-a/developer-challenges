import { test as base, expect } from '@playwright/test';

export type MetadataResponse = {
  machine: string;
  spot: string;
  rpm: string;
  dynamicRange: string;
  interval: number | string | null;
};

export type DataSeries = {
  name: string;
  data: { datetime: string; max: number | string | null }[];
};

export type DataResponse = {
  data: DataSeries[];
};

type Fixtures = {
  /** Aguarda e captura as duas chamadas de API feitas no load da página. */
  apiCalls: { metadata: MetadataResponse; data: DataResponse };
};

export const test = base.extend<Fixtures>({
  apiCalls: async ({ page }, use) => {
    const [metadataResp, dataResp] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith('/metadata.json') && r.status() === 200),
      page.waitForResponse((r) => r.url().endsWith('/data.json') && r.status() === 200),
      page.goto('/'),
    ]);
    const metadata = (await metadataResp.json()) as MetadataResponse;
    const data = (await dataResp.json()) as DataResponse;
    await use({ metadata, data });
  },
});

export { expect };
