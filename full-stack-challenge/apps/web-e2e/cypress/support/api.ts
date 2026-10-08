// Setup and cleanup go straight to the API: they are not what a spec tests,
// and the UI path is several times slower.

interface Created {
  id: string;
}

const apiUrl = (path: string) => `${Cypress.env('API_URL')}${path}`;

/**
 * Signs in once per spec file and restores the cookie before each test. The
 * API and the web app share the `localhost` host, so the cookie the request
 * receives is the one the browser sends.
 */
export function signInViaApi() {
  cy.session(
    'admin',
    () => {
      cy.request('POST', apiUrl('/auth/login'), {
        email: Cypress.env('AUTH_EMAIL'),
        password: Cypress.env('AUTH_PASSWORD'),
      });
    },
    {
      validate: () => {
        cy.request(apiUrl('/auth/me'));
      },
      cacheAcrossSpecs: true,
    },
  );
}

export function createMachineViaApi(name: string, type: 'Pump' | 'Fan') {
  return cy
    .request<Created>('POST', apiUrl('/machines'), { name, type })
    .its('body.id');
}

export function createPointViaApi(machineId: string, name: string) {
  return cy
    .request<Created>(
      'POST',
      apiUrl(`/machines/${machineId}/monitoring-points`),
      { name },
    )
    .its('body.id');
}

export function attachSensorViaApi(
  pointId: string,
  serialNumber: string,
  model: 'TcAg' | 'TcAs' | 'HF+',
) {
  return cy.request({
    method: 'POST',
    url: apiUrl(`/monitoring-points/${pointId}/sensor`),
    body: { serialNumber, model },
    failOnStatusCode: false,
  });
}

/**
 * Deletes every machine whose name starts with `prefix` (the cascade takes
 * points, sensors and readings with it), so the dev database the stack runs
 * on keeps only its seed between runs.
 */
export function deleteMachinesNamed(prefix: string) {
  cy.request<{ data: { id: string; name: string }[] }>(
    apiUrl('/machines?pageSize=100&sortBy=createdAt&sortDir=desc'),
  ).then(({ body }) => {
    body.data
      .filter((machine) => machine.name.startsWith(prefix))
      .forEach((machine) => {
        cy.request({
          method: 'DELETE',
          url: apiUrl(`/machines/${machine.id}`),
          failOnStatusCode: false,
        });
      });
  });
}
