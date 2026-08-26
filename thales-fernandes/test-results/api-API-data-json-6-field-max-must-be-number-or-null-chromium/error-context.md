# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> API /data.json >> 6. field "max" must be number or null
- Location: tests/api.spec.ts:56:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 6

- Array []
+ Array [
+   "accelerationRms/x@2023-11-07T19:59:08.000Z (recebido: \"null\")",
+   "accelerationRms/x@2023-11-08T03:59:08.000Z (recebido: \"null\")",
+   "accelerationRms/x@2023-11-09T11:55:42.000Z (recebido: \"null\")",
+   "accelerationRms/x@2023-11-09T14:24:23.000Z (recebido: \"null\")",
+ ]
```

# Page snapshot

```yaml
- paragraph [ref=e3]: Loading...
```

# Test source

```ts
  1  | import { test, expect } from './support/api-fixtures';
  2  | 
  3  | /**
  4  |  * Contrato das APIs consumidas pela página.
  5  |  *
  6  |  * Nota de escopo: o desafio descreve os endpoints como GET /data e GET /metadata,
  7  |  * mas a implementação real serve GET /data.json e GET /metadata.json
  8  |  * (confirmado via DevTools). Ver docs/questions-to-designer.md, reportado como divergência
  9  |  * entre spec e implementação, não é bug, mas time de produto deveria saber.
  10 |  */
  11 | test.describe('API /metadata.json', () => {
  12 |   test('1. returns all fields expected by the header', async ({ apiCalls }) => {
  13 |     const { metadata } = apiCalls;
  14 |     expect(metadata).toHaveProperty('machine');
  15 |     expect(metadata).toHaveProperty('spot');
  16 |     expect(metadata).toHaveProperty('rpm');
  17 |     expect(metadata).toHaveProperty('dynamicRange');
  18 |     expect(metadata).toHaveProperty('interval');
  19 |   });
  20 | 
  21 |   test('2. fields "machine" and "spot" must be non-empty string', async ({ apiCalls }) => {
  22 |     const { metadata } = apiCalls;
  23 |     expect(metadata.machine).toMatch(/\S/);
  24 |     expect(metadata.spot).toMatch(/\S/);
  25 |   });
  26 | 
  27 |   test('3. field "interval" must be number', async ({ apiCalls }) => {
  28 |     const { metadata } = apiCalls;
  29 |     expect(typeof metadata.interval).toBe('number');
  30 |   });
  31 | });
  32 | 
  33 | test.describe('API /data.json', () => {
  34 |   test('4. returns the 7 expected series (3 axes x2 metrics + temperature)', async ({ apiCalls }) => {
  35 |     const { data } = apiCalls;
  36 |     const names = data.data.map((s) => s.name).sort();
  37 |     expect(names).toEqual(
  38 |       [
  39 |         'accelerationRms/x',
  40 |         'accelerationRms/y',
  41 |         'accelerationRms/z',
  42 |         'velocityRms/x',
  43 |         'velocityRms/y',
  44 |         'velocityRms/z',
  45 |         'temperature',
  46 |       ].sort()
  47 |     );
  48 |   });
  49 | 
  50 |   test('5. all series have the same number of points (time-aligned series)', async ({ apiCalls }) => {
  51 |     const { data } = apiCalls;
  52 |     const lengths = new Set(data.data.map((s) => s.data.length));
  53 |     expect(lengths.size).toBe(1);
  54 |   });
  55 | 
  56 |   test('6. field "max" must be number or null', async ({ apiCalls }) => {
  57 |     const { data } = apiCalls;
  58 |     const offenders = data.data.flatMap((s) =>
  59 |       s.data
  60 |         .filter((p) => typeof p.max !== 'number' && p.max !== null)
  61 |         .map((p) => `${s.name}@${p.datetime} (recebido: ${JSON.stringify(p.max)})`)
  62 |     );
> 63 |     expect(offenders).toEqual([]);
     |                       ^ Error: expect(received).toEqual(expected) // deep equality
  64 |   });
  65 | });
  66 | 
```