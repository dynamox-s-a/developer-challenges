describe('Contrato - metadata.json', () => {

  it('Deve retornar 200 e conter as propriedades esperadas', () => {

    cy.request('https://frontend-test-for-qa.vercel.app/metadata.json')
      .then((response) => {

        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('object')

        expect(response.body).to.have.property('machine').that.is.a('string')
        expect(response.body).to.have.property('spot').that.is.a('string')
        expect(response.body).to.have.property('rpm').that.is.a('string')
        expect(response.body).to.have.property('dynamicRange').that.is.a('string')
        expect(response.body).to.have.property('interval').that.is.a('null')

      })

  })

  /*
  O que isso faz:
    Garante status 200
    Garante que é objeto
    Garante que as propriedades existem
    Garante tipo correto
    Trata interval como null corretamente
  */

})