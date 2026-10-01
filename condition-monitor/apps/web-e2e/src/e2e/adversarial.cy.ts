/**
 * The adversarial profile: it tries to break the application on purpose, through the real
 * stack. Each test asserts the behaviour the application should have; a failure here is a
 * defect found, not a test to loosen. Many attacks have no screen, so they go straight at
 * the API with `cy.request`; the ones about the browser (a hostile name rendered, a file
 * refused before it leaves the page, a stale link) go through the interface.
 *
 * The API address is the web origin's proxy, so the session cookie is the one the browser
 * holds: `cy.request`, `window.fetch` and the app all share it.
 */

const api = () => Cypress.env('apiUrl') as string;

/** The DRY sector seeded for the first user, fetched fresh each test. */
function withSector(use: (sectorId: string) => void): void {
  cy.request(`${api()}/sectors`).then((response) => use(response.body[0].id as string));
}

/** A fan with one monitoring point and an installed sensor; yields the point id. */
function installedFan(serialNumber: string, use: (pointId: string) => void): void {
  withSector((sectorId) => {
    cy.request('POST', `${api()}/machines`, { sectorId, type: 'Fan', number: 1, name: 'Fan' }).then(
      (machine) => {
        cy.request('POST', `${api()}/machines/${machine.body.id}/monitoring-points`, {
          positions: [{ location: 'FAN_MOTOR_DE' }],
        }).then((points) => {
          const pointId = points.body.items[0].id as string;
          cy.request('PUT', `${api()}/monitoring-points/${pointId}/sensor`, {
            serialNumber,
            model: 'TcAs',
          }).then(() => use(pointId));
        });
      },
    );
  });
}

function reading(serialNumber: string, minute: number) {
  return {
    serialNumber,
    timestamp: new Date(Date.UTC(2027, 0, 1) + minute * 600_000).toISOString(),
    quantity: 'velocity_rms',
    axis: 'H',
    value: 1,
  };
}

describe('the application under attack', () => {
  context('hostile input is stored as data, never executed', () => {
    it('renders a machine name full of markup as text, and runs none of it', () => {
      const name = '<img src=x onerror="window.__xss = true"><script>window.__xss = true</script>';
      cy.loginAs(1);
      withSector((sectorId) => {
        cy.request('POST', `${api()}/machines`, { sectorId, type: 'Fan', number: 1, name });
      });
      cy.visit('/machines');
      cy.findByText(name).should('be.visible');
      cy.window().should((win) => expect((win as { __xss?: boolean }).__xss).to.be.undefined);
    });

    it('keeps a SQL statement in a name as a name, with the table intact', () => {
      const name = "Robert'); DROP TABLE machines;--";
      cy.loginAs(1);
      withSector((sectorId) => {
        cy.request('POST', `${api()}/machines`, { sectorId, type: 'Pump', number: 7, name }).then(
          (created) => {
            expect(created.body.name).to.eq(name);
            // The table still answers, and still holds the machine.
            cy.request('POST', `${api()}/machines`, {
              sectorId,
              type: 'Fan',
              number: 7,
              name: 'Still here',
            })
              .its('status')
              .should('eq', 201);
            cy.request(`${api()}/machines/${created.body.id}`).its('body.name').should('eq', name);
          },
        );
      });
    });
  });

  context('the API refuses what is out of bounds, with a clear reason', () => {
    beforeEach(() => cy.loginAs(1));

    it('refuses sector codes and names outside their limits', () => {
      withSector(() => undefined);
      const bad = [
        { code: 'A', name: 'x' },
        { code: 'TOOLONGCODE1', name: 'x' },
        { code: 'OK', name: '' },
        { code: 'OK', name: 'n'.repeat(101) },
        { code: 'spaces here', name: 'x' },
      ];
      for (const body of bad) {
        cy.api('POST', '/sectors', body).then((r) => {
          expect(r.status, JSON.stringify(body)).to.eq(422);
          expect(r.body.errors.length).to.be.greaterThan(0);
        });
      }
    });

    it('accepts a 100-character machine name and refuses 101', () => {
      withSector((sectorId) => {
        cy.api('POST', '/machines', { sectorId, type: 'Fan', number: 1, name: 'n'.repeat(100) })
          .its('status')
          .should('eq', 201);
        cy.api('POST', '/machines', { sectorId, type: 'Fan', number: 2, name: 'n'.repeat(101) })
          .its('status')
          .should('eq', 422);
      });
    });

    it('refuses machine numbers and types outside the list', () => {
      withSector((sectorId) => {
        for (const bad of [{ number: 0 }, { number: 1000 }, { number: 1.5 }, { type: 'Rocket' }]) {
          cy.api('POST', '/machines', { sectorId, type: 'Fan', number: 1, name: 'x', ...bad })
            .its('status')
            .should('eq', 422);
        }
      });
    });

    it('refuses pagination and sorting it does not know', () => {
      for (const query of ['page=0', 'pageSize=101', 'sort=; DROP TABLE', 'order=sideways']) {
        cy.api('GET', `/monitoring-points?${query}`).its('status').should('eq', 422);
      }
    });

    it('treats a serial number as one sensor whatever its case (B4)', () => {
      installedFan('dx-9001', () => {
        withSector((sectorId) => {
          cy.request('POST', `${api()}/machines`, {
            sectorId,
            type: 'Fan',
            number: 2,
            name: 'Second',
          }).then((machine) => {
            cy.request('POST', `${api()}/machines/${machine.body.id}/monitoring-points`, {
              positions: [{ location: 'FAN_MOTOR_DE' }],
            }).then((points) => {
              // The same serial in upper case is the same sensor, already installed.
              cy.api('PUT', `/monitoring-points/${points.body.items[0].id}/sensor`, {
                serialNumber: 'DX-9001',
                model: 'TcAs',
              })
                .its('status')
                .should('eq', 409);
            });
          });
        });
      });
    });
  });

  context('malformed files and requests do not crash the server', () => {
    beforeEach(() => cy.loginAs(1));

    it('answers a truncated JSON body with 400, not 500', () => {
      cy.request({
        method: 'POST',
        url: `${api()}/readings`,
        body: '{"readings": [',
        headers: { 'content-type': 'application/json' },
        failOnStatusCode: false,
      })
        .its('status')
        .should('eq', 400);
    });

    it('refuses a file that is not UTF-8 text, and stores nothing', () => {
      installedFan('DX-7001', () => {
        cy.visit('/import');
        // Bytes of a PNG header: not text, so not a CSV.
        const png = Cypress.Buffer.from([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0xff, 0xd8,
        ]);
        cy.get('input[type=file]').selectFile(
          { contents: png, fileName: 'photo.png', mimeType: 'image/png' },
          { force: true },
        );
        cy.findByRole('button', { name: 'Import' }).click();
        // The message shows once as the headline and once as the field reason.
        cy.findAllByText(/not UTF-8/)
          .first()
          .should('be.visible');
      });
    });

    it('refuses a CSV with semicolons and a decimal comma, naming the reason', () => {
      cy.visit('/import');
      const csv =
        'serial_number;timestamp;quantity;axis;value\nDX-1;2027-01-01T00:00:00Z;velocity_rms;H;2,31';
      cy.get('input[type=file]').selectFile(
        { contents: Cypress.Buffer.from(csv), fileName: 'semicolons.csv', mimeType: 'text/csv' },
        { force: true },
      );
      cy.findByRole('button', { name: 'Import' }).click();
      cy.findAllByText(/separated by semicolons/)
        .first()
        .should('be.visible');
    });
  });

  context('size limits hold, over the real network', () => {
    beforeEach(() => cy.loginAs(1));

    it('blocks a file larger than 2 MB in the browser, before it is sent', () => {
      cy.visit('/import');
      const big = Cypress.Buffer.alloc(2 * 1024 * 1024 + 1, 0x20);
      cy.get('input[type=file]').selectFile(
        { contents: big, fileName: 'big.csv', mimeType: 'text/csv' },
        { force: true },
      );
      cy.findByText(/at most 2.0 MB are accepted/).should('be.visible');
      cy.findByRole('button', { name: 'Import' }).should('be.disabled');
    });

    it('accepts a submission of 2,000 readings and refuses 2,001 (C8)', () => {
      installedFan('DX-8001', () => {
        const make = (n: number) =>
          Array.from({ length: n }, (_, minute) => reading('DX-8001', minute));
        cy.api('POST', '/readings', { readings: make(2000) })
          .its('status')
          .should('eq', 200);
        cy.api('POST', '/readings', { readings: make(2001) }).then((r) => {
          expect(r.status).to.eq(422);
          expect(r.body.errors[0].message).to.match(/At most 2,000/);
        });
      });
    });

    it('answers a JSON body over 2 MB with 413', () => {
      cy.request({
        method: 'POST',
        url: `${api()}/readings`,
        body: { padding: 'x'.repeat(2_200_000) },
        failOnStatusCode: false,
      })
        .its('status')
        .should('eq', 413);
    });
  });

  context('concurrent requests do not corrupt the data', () => {
    beforeEach(() => cy.loginAs(1));

    it('lets only one of two identical machine creations win', () => {
      cy.visit('/');
      withSector((sectorId) => {
        const body = { sectorId, type: 'Fan', number: 1, name: 'Race' };
        cy.window()
          .then((win) => {
            const post = () =>
              win
                .fetch('/api/machines', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'same-origin',
                  body: JSON.stringify(body),
                })
                .then((r) => r.status);
            return Cypress.Promise.all([post(), post()]);
          })
          .then((statuses: number[]) => {
            expect([...statuses].sort()).to.deep.eq([201, 409]);
          });
      });
    });

    it('lets a serial number be installed on only one point when two requests race', () => {
      cy.visit('/');
      withSector((sectorId) => {
        cy.request('POST', `${api()}/machines`, {
          sectorId,
          type: 'Fan',
          number: 1,
          name: 'Fan',
        }).then((machine) => {
          cy.request('POST', `${api()}/machines/${machine.body.id}/monitoring-points`, {
            positions: [{ location: 'FAN_MOTOR_DE' }, { location: 'FAN_SHAFT_DE' }],
          }).then((points) => {
            const [a, b] = points.body.items.map((item: { id: string }) => item.id);
            cy.window()
              .then((win) => {
                const install = (pointId: string) =>
                  win
                    .fetch(`/api/monitoring-points/${pointId}/sensor`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'same-origin',
                      body: JSON.stringify({ serialNumber: 'DX-5000', model: 'TcAs' }),
                    })
                    .then((r) => r.status);
                return Cypress.Promise.all([install(a), install(b)]);
              })
              .then((statuses: number[]) => {
                expect(statuses).to.include(200);
                expect(statuses).to.include(409);
              });
          });
        });
      });
    });

    it('counts the same readings sent twice, storing them once (C5)', () => {
      installedFan('DX-6001', () => {
        const readings = Array.from({ length: 10 }, (_, minute) => reading('DX-6001', minute));
        cy.request('POST', `${api()}/readings`, { readings })
          .its('body.totals.readingsInserted')
          .should('eq', 10);
        cy.request('POST', `${api()}/readings`, { readings }).then((r) => {
          expect(r.body.totals.readingsInserted).to.eq(0);
          expect(r.body.totals.readingsRepeated).to.eq(10);
        });
      });
    });
  });

  context('the session and one user cannot be bypassed', () => {
    it('answers a private route with 401 without a session', () => {
      cy.clearCookies();
      cy.api('GET', '/machines?page=1&pageSize=10').its('status').should('eq', 401);
    });

    it('answers 401 for a forged session cookie', () => {
      cy.setCookie('session', 'not.a.real.token', { path: '/api' });
      cy.api('GET', '/overview').its('status').should('eq', 401);
    });

    it("hides one user's machine from another, by API and by screen (A4)", () => {
      cy.loginAs(1);
      withSector((sectorId) => {
        cy.request('POST', `${api()}/machines`, {
          sectorId,
          type: 'Fan',
          number: 1,
          name: 'Private',
        }).then((machine) => {
          const id = machine.body.id as string;
          cy.loginAs(2);
          cy.api('GET', `/machines/${id}`).its('status').should('eq', 404);
          cy.visit(`/machines/${id}`);
          cy.findByRole('button', { name: 'Retry' }).should('be.visible');
          cy.findByRole('navigation', { name: 'Main navigation' }).should('be.visible');
        });
      });
    });
  });

  context('deleted things and empty screens do not break the app', () => {
    it('shows a usable error when opening a machine that was just deleted', () => {
      cy.loginAs(1);
      withSector((sectorId) => {
        cy.request('POST', `${api()}/machines`, {
          sectorId,
          type: 'Fan',
          number: 1,
          name: 'Doomed',
        }).then((machine) => {
          const id = machine.body.id as string;
          cy.request('DELETE', `${api()}/machines/${id}`);
          cy.visit(`/machines/${id}`);
          cy.findByRole('button', { name: 'Retry' }).should('be.visible');
          // The app still works: the navigation takes us somewhere real.
          cy.findByRole('link', { name: 'Machines' }).click();
          cy.findByRole('heading', { name: 'Machines' }).should('be.visible');
        });
      });
    });

    it('forecasts nothing for a series id that does not exist, with 404', () => {
      cy.loginAs(1);
      cy.api('GET', '/time-series/00000000-0000-4000-8000-000000000000/forecast')
        .its('status')
        .should('eq', 404);
      cy.api('GET', '/time-series/not-a-uuid/forecast').its('status').should('eq', 404);
    });
  });
});
