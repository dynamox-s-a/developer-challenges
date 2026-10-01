/**
 * One run through the application the way an operator uses it, from login to logout,
 * every screen connected to the real API and database: register a machine, its
 * monitoring points and a sensor, feed it readings by CSV, read the chart, the metrics
 * and the forecast, sort the list, and sign out. This is the happy path; breaking the
 * application on purpose is in `adversarial.cy.ts`.
 *
 * Lists reload after a change, so the test waits for those requests rather than racing
 * the re-render: a link found mid-reload would detach before the click lands.
 */

/** A small CSV for the pump sensor: a few hours of velocity and temperature. */
function sampleCsv(serialNumber: string): string {
  const base = Date.UTC(2026, 8, 1, 0, 0, 0);
  const lines = ['serial_number,timestamp,quantity,axis,value'];
  for (let i = 0; i < 48; i += 1) {
    const at = new Date(base + i * 600_000).toISOString();
    const vibration = (2 + 0.3 * Math.sin(i / 4)).toFixed(3);
    lines.push(`${serialNumber},${at},velocity_rms,H,${vibration}`);
    lines.push(`${serialNumber},${at},temperature,,${(45 + i * 0.05).toFixed(1)}`);
  }
  return lines.join('\n');
}

describe('the full user flow', () => {
  const SERIAL = 'DX-000001';

  beforeEach(() => {
    cy.intercept('GET', '**/api/machines?*').as('machinesList');
    cy.intercept('GET', '**/api/monitoring-points?*').as('pointsList');
    cy.intercept({ method: 'GET', url: /\/api\/machines\/[0-9a-f-]{36}$/ }).as('machine');
  });

  it('registers a machine, feeds it readings and reads them back', () => {
    // Log in through the form, as a person would.
    cy.visit('/login');
    cy.findByLabelText(/Email/).type(Cypress.env('user1Email'));
    cy.findByLabelText(/Password/).type(Cypress.env('user1Password'), { log: false });
    cy.findByRole('button', { name: 'Sign in' }).click();
    cy.location('pathname').should('eq', '/');
    cy.findByRole('heading', { name: 'Overview' }).should('be.visible');

    // Create a pump in the seeded DRY sector.
    cy.findByRole('link', { name: 'Machines' }).click();
    cy.wait('@machinesList');
    cy.findByRole('button', { name: 'New machine' }).click();
    cy.findByRole('dialog').within(() => {
      cy.findByLabelText('Name').type('Condensate pump');
      cy.findByRole('combobox', { name: 'Type' }).click();
    });
    cy.findByRole('option', { name: 'Pump' }).click();
    cy.findByRole('dialog').within(() => {
      cy.findByLabelText('Number').clear();
      cy.findByLabelText('Number').type('1');
      cy.contains('DRY-PUMP-01').should('be.visible');
      cy.findByRole('button', { name: 'Create' }).click();
    });
    cy.findByRole('dialog').should('not.exist');
    cy.wait('@machinesList');
    cy.findByRole('link', { name: 'DRY-PUMP-01' }).should('be.visible').click();
    cy.wait('@machine');

    // Two monitoring points.
    cy.findByRole('button', { name: 'Add positions' }).click();
    cy.findByRole('dialog').within(() => {
      cy.findByRole('checkbox', { name: 'Motor, drive end bearing' }).check();
      cy.findByRole('checkbox', { name: 'Pump, impeller side bearing' }).check();
      cy.findByRole('button', { name: 'Add 2' }).click();
    });
    cy.findByRole('dialog').should('not.exist');
    cy.wait('@machine');
    // The name and the position read the same, so the text appears in two cells.
    cy.findByRole('table', { name: 'Monitoring points of the machine' })
      .findAllByText('Motor, drive end bearing')
      .first()
      .should('be.visible');

    // A pump accepts only HF+: the dialog offers nothing else, and the API refuses the rest.
    cy.findByRole('button', { name: 'Install sensor at Motor, drive end bearing' }).click();
    cy.findByRole('dialog').within(() => {
      cy.findByRole('combobox', { name: 'Model' }).click();
    });
    cy.findAllByRole('option').should('have.length', 1).and('have.text', 'HF+');
    cy.findByRole('option', { name: 'HF+' }).click();
    cy.findByRole('dialog').within(() => {
      cy.findByLabelText(/Serial number/).type(SERIAL.toLowerCase());
      cy.findByRole('button', { name: 'Install' }).click();
    });
    cy.findByRole('dialog').should('not.exist');
    cy.wait('@machine');
    // The serial is text and the model is a chip beside it, so they are two nodes.
    cy.findByRole('table', { name: 'Monitoring points of the machine' })
      .findByText(SERIAL)
      .should('be.visible');

    // The pump rule, straight at the API: a thermocouple model is refused for a pump.
    // The session cookie from the login above is sent with cy.request too.
    cy.request(`${Cypress.env('apiUrl')}/sensors?serialNumber=${SERIAL}`).then((response) => {
      const pointId = response.body[0].monitoringPointId;
      cy.api('PUT', `/monitoring-points/${pointId}/sensor`, {
        serialNumber: 'DX-000099',
        model: 'TcAg',
      })
        .its('status')
        .should('eq', 422);
    });

    // Import readings for that sensor by CSV.
    cy.findByRole('link', { name: 'CSV import' }).click();
    cy.findByRole('link', { name: 'Download an example file' }).should(
      'have.attr',
      'href',
      '/samples/readings-example.csv',
    );
    cy.get('input[type=file]').selectFile(
      {
        contents: Cypress.Buffer.from(sampleCsv(SERIAL)),
        fileName: 'readings.csv',
        mimeType: 'text/csv',
      },
      { force: true },
    );
    cy.findByRole('button', { name: 'Import' }).click();
    cy.findByText(/96 readings stored/).should('be.visible');

    // The point is in the list; sorting a column keeps it there.
    cy.findByRole('link', { name: 'Monitoring points' }).click();
    cy.wait('@pointsList');
    cy.findByRole('button', { name: 'Monitoring Point Name' }).click();
    cy.wait('@pointsList');
    cy.findByRole('table', { name: 'Monitoring points' })
      .findAllByText('Condensate pump')
      .should('have.length.at.least', 1);

    // Open the point: its chart, its metrics, its forecast. The name and the position
    // read the same, so the row holds two matching cells; either opens the point.
    cy.findAllByRole('cell', { name: 'Motor, drive end bearing' })
      .first()
      .should('be.visible')
      .click();
    cy.location('pathname').should('contain', '/monitoring-points/');
    cy.findByRole('heading', { name: 'Motor, drive end bearing' }).should('be.visible');
    cy.findByRole('img', { name: 'Velocity RMS chart, in mm/s' }).should('be.visible');
    cy.findByRole('table', { name: 'Velocity RMS metrics' })
      .findByText('Velocity RMS, horizontal')
      .should('be.visible');

    // The forecast is honest about short history: a day of readings is not a week.
    cy.findByRole('checkbox', { name: 'Forecast the next 24 h' }).check();
    // Every series without a week of data shows the same note, so there are several.
    cy.findAllByText(/a forecast needs 168/)
      .first()
      .should('be.visible');

    // Sign out.
    cy.findByRole('button', { name: 'Log out' }).click();
    cy.location('pathname').should('eq', '/login');
    cy.findByRole('button', { name: 'Sign in' }).should('be.visible');
  });
});
