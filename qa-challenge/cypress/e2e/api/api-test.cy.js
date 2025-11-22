describe('API tests', () => {
  it('Gets, types and asserts', () => {
    cy.request('https://frontend-test-for-qa.vercel.app/data.json').then((r) => {
        
        expect(r.status).to.eq(200);
        expect(r.body).to.have.property('data');
        const data1 = r.body;
        
        // 1. Checking cache - data must be refreshed every time by responde code
        cy.request('https://frontend-test-for-qa.vercel.app/data.json').then((r2) => {
            //cy.log(r2.status);
            if (r2.status != 200) {
                throw new Error('Data is not being refreshed');
            }
            const data2 = r2.body;
            // 2. Data content must be different
            expect(data2).not.to.deep.eq(data1);
        });
    });

    // 2. Metadata must be conscious
    cy.request('https://frontend-test-for-qa.vercel.app/metadata.json').then((r) => {
        //cy.log(r.status);
        expect(r.status).to.eq(200);

        const machineID = parseInt(r.body.machine.match(/\d+/)[0]);
        expect(Number.isInteger(machineID)).to.be.true;
        //cy.log(machineID);
        const pontoID = parseInt(r.body.spot.match(/\d+/)[0]);
        expect(Number.isInteger(pontoID)).to.be.true;
        //cy.log(pontoID);
        const dynamicRange = parseInt(r.body.dynamicRange.match(/\d+/)[0]);
        expect(Number.isFinite(dynamicRange)).to.be.true;
        //cy.log(dynamicRange);
        const rpm = parseInt(r.body.rpm.match(/\d+/)[0]);
        expect(Number.isFinite(rpm)).to.be.true;
        //cy.log(rpm);
        const interval = parseInt(r.body.interval.match(/\d+/)[0]);
        expect(Number.isFinite(interval)).to.be.true;
        //cy.log(interval);
    })
  })
})