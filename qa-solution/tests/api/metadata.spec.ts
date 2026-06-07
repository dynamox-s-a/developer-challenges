import test, { expect } from "@playwright/test";


test('should return valid metadata from /metadata.json', async ({ request }) => {
  const response = await request.get('https://frontend-test-for-qa.vercel.app/metadata.json');
  
  expect(response.status()).toBe(200);
  
  const body = await response.json();
  
  for (const [key, value] of Object.entries(body)) {
  expect(value, `Campo "${key}" não deve ser null`).not.toBeNull();
}
});