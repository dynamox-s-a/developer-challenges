/// <reference types="cypress" />

describe('Time Series Data Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  beforeEach(() => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    
    cy.get('[role="grid"]').should('be.visible');
  });

  it('should open time series drawer when clicking on a monitoring point row', () => {
    cy.get('[role="grid"]').then(($grid) => {
      if ($grid.find('[role="row"]').length > 0) {
        cy.get('[role="row"]').first().click();
      } else {
        cy.request('GET', 'http://localhost:3001/monitoring-points')
          .then((response) => {
            if (response.body && response.body.items && response.body.items.length > 0) {
              const firstMP = response.body.items[0];
              cy.get('[role="grid"]').should('contain', firstMP.monitoringPointName);
              cy.get('[role="row"]').first().click();
            } else {
              cy.log('No monitoring points found, skipping time series test');
              return;
            }
          });
      }
    });

    cy.get('.MuiDrawer-root').should('be.visible');
    cy.get('.MuiDrawer-root').should('contain', 'Time-series');
  });

  it('should load and display time series data', () => {
    cy.get('[role="grid"]').then(($grid) => {
      if ($grid.find('[role="row"]').length > 0) {
        cy.get('[role="row"]').first().click();
      } else {
        cy.request('GET', 'http://localhost:3001/monitoring-points')
          .then((response) => {
            if (response.body && response.body.items && response.body.items.length > 0) {
              const firstMP = response.body.items[0];
              cy.get('[role="grid"]').should('contain', firstMP.monitoringPointName);
              cy.get('[role="row"]').first().click();
            } else {
              cy.log('No monitoring points found, skipping time series test');
              return;
            }
          });
      }
    });

    cy.get('.MuiDrawer-root', { timeout: 10000 }).should('be.visible');
    
    cy.get('.recharts-wrapper').should('be.visible');
    cy.get('.recharts-line').should('be.visible');
    
    cy.contains('Total Points:').should('be.visible');
    cy.contains(/Min:/).should('be.visible');
    cy.contains(/Max:/).should('be.visible');
    cy.contains(/Avg:/).should('be.visible');
  });

  it('should validate time series API responses', () => {
    cy.get('[role="grid"]').then(($grid) => {
      if ($grid.find('[role="row"]').length > 0) {
        cy.get('[role="row"]').first().invoke('attr', 'data-row-id').then((rowId) => {
          if (rowId) {
            cy.request('GET', `http://localhost:3001/monitoring-points/${rowId}/time-series?take=10`)
              .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('items');
                expect(response.body).to.have.property('total');
                expect(response.body.items).to.be.an('array');
              });

            cy.request('GET', `http://localhost:3001/monitoring-points/${rowId}/time-series/metrics`)
              .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('count');
                expect(response.body).to.have.property('min');
                expect(response.body).to.have.property('max');
                expect(response.body).to.have.property('avg');
              });
          }
        });
      } else {
        cy.request('GET', 'http://localhost:3001/monitoring-points')
          .then((response) => {
            if (response.body && response.body.items && response.body.items.length > 0) {
              const firstMP = response.body.items[0];
              
              cy.request('GET', `http://localhost:3001/monitoring-points/${firstMP.id}/time-series?take=10`)
                .then((response) => {
                  expect(response.status).to.eq(200);
                  expect(response.body).to.have.property('items');
                  expect(response.body).to.have.property('total');
                });

              cy.request('GET', `http://localhost:3001/monitoring-points/${firstMP.id}/time-series/metrics`)
                .then((response) => {
                  expect(response.status).to.eq(200);
                  expect(response.body).to.have.property('count');
                  expect(response.body).to.have.property('min');
                  expect(response.body).to.have.property('max');
                  expect(response.body).to.have.property('avg');
                });
            }
          });
      }
    });
  });

  it('should handle time range selection', () => {
    cy.get('[role="grid"]').then(($grid) => {
      if ($grid.find('[role="row"]').length > 0) {
        cy.get('[role="row"]').first().click();
      } else {
        cy.request('GET', 'http://localhost:3001/monitoring-points')
          .then((response) => {
            if (response.body && response.body.items && response.body.items.length > 0) {
              const firstMP = response.body.items[0];
              cy.get('[role="grid"]').should('contain', firstMP.monitoringPointName);
              cy.get('[role="row"]').first().click();
            } else {
              cy.log('No monitoring points found, skipping time range test');
              return;
            }
          });
      }
    });

    cy.get('.MuiDrawer-root', { timeout: 10000 }).should('be.visible');
    
    cy.get('label').contains('Time Range').should('be.visible');
    cy.get('[role="combobox"]').should('be.visible');
    
    const timeRanges = ['Last 24 hours', 'Last 7 days', 'Last 30 days'];
    
    timeRanges.forEach((range) => {
      cy.get('[role="combobox"]').click();
      cy.get('[role="option"]').contains(range).click();
      cy.get('.MuiDrawer-root').should('be.visible');
      
      cy.get('.recharts-wrapper').should('be.visible');
    });
  });

  it('should validate global time series count endpoint', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    
    cy.request('GET', 'http://localhost:3001/time-series/count')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('count');
        expect(response.body.count).to.be.a('number');
        expect(response.body.count).to.be.greaterThan(0);
      });
    
    cy.get('[role="grid"]').then(($grid) => {
      if ($grid.find('[role="row"]').length > 0) {
        cy.get('[role="row"]').first().invoke('attr', 'data-row-id').then((rowId) => {
          if (rowId) {
            cy.request('GET', `http://localhost:3001/time-series/count?monitoringPointId=${rowId}`)
              .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('count');
                expect(response.body).to.have.property('monitoringPointId', rowId);
              });
          }
        });
      }
    });
});
});
