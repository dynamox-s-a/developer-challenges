import {
  attachSensorViaApi,
  createMachineViaApi,
  createPointViaApi,
  deleteMachinesNamed,
  signInViaApi,
} from '../support/api';

// Every machine a run creates carries this prefix, so cleanup can't touch
// the seed or what someone created by hand on the same dev database.
const PREFIX = 'e2e-';
const unique = (label: string) =>
  `${PREFIX}${label}-${Date.now().toString(36)}`;

const dialog = (name: string) => cy.findByRole('dialog', { name });

describe('Machines', () => {
  beforeEach(() => {
    signInViaApi();
  });

  afterEach(() => {
    deleteMachinesNamed(PREFIX);
  });

  it('creates, edits and deletes a machine from the list', () => {
    const name = unique('pump');
    const renamed = `${name}-renamed`;
    cy.intercept('POST', '**/api/v1/machines').as('createMachine');
    cy.visit('/machines');

    cy.findByRole('button', { name: 'New machine' }).click();
    dialog('New machine').within(() => {
      // Invalid first: a blank name never reaches the API.
      cy.findByLabelText(/^name/i).type('   ');
      cy.findByRole('button', { name: 'Create' }).click();
      cy.findByText('Name is required').should('be.visible');

      cy.findByLabelText(/^type/i).should('have.value', 'Pump');
      cy.findByText("Pump machines can't have TcAg or TcAs sensors.").should(
        'be.visible',
      );
      cy.findByLabelText(/^name/i).clear();
      cy.findByLabelText(/^name/i).type(name);
      cy.findByRole('button', { name: 'Create' }).click();
    });
    cy.get('@createMachine.all').should('have.length', 1);
    cy.findByText(`Machine "${name}" created.`).should('be.visible');
    cy.findByRole('dialog').should('not.exist');
    // The newest machine heads the default sort (created, descending).
    cy.findByRole('link', { name }).should('be.visible');

    cy.findByRole('button', { name: `Edit ${name}` }).click();
    dialog('Edit machine').within(() => {
      cy.findByLabelText(/^name/i).should('have.value', name);
      cy.findByLabelText(/^name/i).clear();
      cy.findByLabelText(/^name/i).type(renamed);
      cy.findByLabelText(/^type/i).select('Fan');
      cy.findByRole('button', { name: 'Save' }).click();
    });
    cy.findByText(`Machine "${renamed}" updated.`).should('be.visible');
    cy.findByRole('link', { name: renamed })
      .closest('tr')
      .within(() => {
        cy.findByRole('cell', { name: 'Fan' }).should('be.visible');
      });

    cy.findByRole('button', { name: `Delete ${renamed}` }).click();
    dialog('Delete machine?').within(() => {
      cy.findByText(/It has no monitoring points/).should('be.visible');
      cy.findByRole('button', { name: 'Delete' }).click();
    });
    cy.findByText(`Machine "${renamed}" deleted.`).should('be.visible');
    cy.findByRole('link', { name: renamed }).should('not.exist');
  });

  it('adds monitoring points and attaches a sensor the machine allows', () => {
    const name = unique('pump');
    const serial = unique('SN').toUpperCase();
    createMachineViaApi(name, 'Pump').then((id) => {
      cy.visit(`/machines/${id}`);
    });

    cy.findByRole('heading', { level: 1, name }).should('be.visible');
    cy.findByText(/no monitoring points yet/i).should('be.visible');

    cy.findByRole('button', { name: 'Add point' }).click();
    dialog('New monitoring point').within(() => {
      cy.findByRole('button', { name: 'Create' }).click();
      cy.findByText('Name is required').should('be.visible');
      cy.findByLabelText(/^name/i).type('Bearing DE');
      cy.findByRole('button', { name: 'Create' }).click();
    });
    cy.findByText('Monitoring point "Bearing DE" created.').should(
      'be.visible',
    );
    cy.findByRole('heading', { level: 3, name: 'Bearing DE' }).should(
      'be.visible',
    );
    cy.findByText('No sensor attached').should('be.visible');

    cy.findByRole('button', { name: 'Add sensor to Bearing DE' }).click();
    dialog('Add sensor to Bearing DE').within(() => {
      // The models a Pump forbids are listed, but can't be picked.
      cy.findByRole('option', { name: 'TcAg (not allowed on Pump)' }).should(
        'be.disabled',
      );
      cy.findByRole('option', { name: 'TcAs (not allowed on Pump)' }).should(
        'be.disabled',
      );
      cy.findByLabelText(/^model/i).should('have.value', 'HF+');

      cy.findByLabelText(/^serial number/i).type('SN 001!');
      cy.findByRole('button', { name: 'Add sensor' }).click();
      cy.findByText(
        'Use only letters, digits, dot, dash and underscore',
      ).should('be.visible');

      cy.findByLabelText(/^serial number/i).clear();
      cy.findByLabelText(/^serial number/i).type(serial);
      cy.findByRole('button', { name: 'Add sensor' }).click();
    });
    cy.findByText(`Sensor ${serial} added to "Bearing DE".`).should(
      'be.visible',
    );
    cy.findByRole('heading', { level: 3, name: 'Bearing DE' })
      .closest('article')
      .within(() => {
        cy.findByText('HF+').should('be.visible');
        cy.findByText(serial).should('be.visible');
        cy.findByRole('link', { name: 'Series of Bearing DE' }).should(
          'be.visible',
        );
      });
  });

  it('shows the API error when a serial number is already in use', () => {
    const name = unique('fan');
    const serial = unique('SN').toUpperCase();
    createMachineViaApi(name, 'Fan').then((machineId) => {
      createPointViaApi(machineId, 'Motor NDE').then((pointId) => {
        attachSensorViaApi(pointId, serial, 'TcAg');
      });
      createPointViaApi(machineId, 'Motor DE');
      cy.visit(`/machines/${machineId}`);
    });

    cy.findByRole('button', { name: 'Add sensor to Motor DE' }).click();
    dialog('Add sensor to Motor DE').within(() => {
      cy.findByLabelText(/^serial number/i).type(serial);
      cy.findByRole('button', { name: 'Add sensor' }).click();
      cy.findByRole('alert').should(
        'contain.text',
        'Serial number already in use',
      );
      // The dialog stays open so the user can fix the serial.
      cy.findByLabelText(/^serial number/i).should('have.value', serial);
    });
  });

  it('refuses to turn a machine with TcAg sensors into a Pump', () => {
    const name = unique('fan');
    createMachineViaApi(name, 'Fan').then((machineId) => {
      createPointViaApi(machineId, 'Impeller').then((pointId) => {
        attachSensorViaApi(pointId, unique('SN').toUpperCase(), 'TcAg')
          .its('status')
          .should('eq', 201);
      });
      cy.visit(`/machines/${machineId}`);
    });

    cy.findByRole('button', { name: 'Edit machine' }).click();
    dialog('Edit machine').within(() => {
      cy.findByLabelText(/^type/i).select('Pump');
      cy.findByRole('button', { name: 'Save' }).click();
      cy.findByRole('alert').should(
        'contain.text',
        'A Pump machine cannot have TcAg or TcAs sensors',
      );
      cy.findByRole('button', { name: 'Cancel' }).click();
    });
    cy.findByText(/^Fan · created/).should('be.visible');
  });

  it('enforces the sensor rule in the API, not only in the form', () => {
    createMachineViaApi(unique('pump'), 'Pump').then((machineId) => {
      createPointViaApi(machineId, 'Casing').then((pointId) => {
        attachSensorViaApi(pointId, unique('SN').toUpperCase(), 'TcAs').then(
          ({ status, body }) => {
            expect(status).to.eq(422);
            expect(body.error.message).to.eq(
              'TcAs sensors cannot be used on Pump machines',
            );
          },
        );
      });
      cy.visit(`/machines/${machineId}`);
    });

    cy.findByRole('heading', { level: 3, name: 'Casing' })
      .closest('article')
      .findByText('No sensor attached')
      .should('be.visible');
  });

  it('removes a sensor and deletes a point, spelling out the cascade', () => {
    const serial = unique('SN').toUpperCase();
    createMachineViaApi(unique('fan'), 'Fan').then((machineId) => {
      createPointViaApi(machineId, 'Shaft').then((pointId) => {
        attachSensorViaApi(pointId, serial, 'TcAs');
      });
      cy.visit(`/machines/${machineId}`);
    });

    cy.findByRole('button', { name: 'Remove sensor from Shaft' }).click();
    dialog('Remove sensor?').within(() => {
      cy.findByText(/It has no readings stored/).should('be.visible');
      cy.findByRole('button', { name: 'Remove' }).click();
    });
    cy.findByText(`Sensor ${serial} removed.`).should('be.visible');
    cy.findByText('No sensor attached').should('be.visible');

    cy.findByRole('button', { name: 'Delete Shaft' }).click();
    dialog('Delete monitoring point?').within(() => {
      cy.findByText(/will be permanently deleted/).should('be.visible');
      cy.findByRole('button', { name: 'Delete' }).click();
    });
    cy.findByText('Monitoring point "Shaft" deleted.').should('be.visible');
    cy.findByText(/no monitoring points yet/i).should('be.visible');
  });
});
