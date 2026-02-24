describe('Contrato - data.json', () => {

  it('Deve retornar estrutura válida', () => {

    cy.request('/data.json').then((response) => {

      expect(response.status).to.eq(200)

      expect(response.body).to.have.property('data').that.is.an('array')
      expect(response.body.data).to.be.an('array')
      expect(response.body.data.length).to.be.greaterThan(0)

      response.body.data.forEach((series) => {

        expect(series).to.have.property('name').that.is.an('string')
        expect(series).to.have.property('data').that.is.an('array')
        expect(series.data.length).to.be.greaterThan(0)
        // expect(series.data).to.be.an('array')

        series.data.forEach(point => {
          expect(point).to.have.property('datetime').that.is.a('string')
          expect(point).to.have.property('max')

          // Se existir valor diferente de null precisa ser number.
          if (point.max !== null) {
            expect(point.max).to.be.a('number')
          }

          expect(new Date(point.datetime).toString())
            .to.not.equal('Invalid Date')
        })

      })

    })

  })

/*
  O que isso faz:
    Garante que a propriedade 'max' existe no objeto
    Permite que 'max' seja um número válido
    Permite que 'max' seja null (valor nulo real)
    Impede que 'max' seja string, undefined ou qualquer outro tipo inválido
    Protege o contrato da API contra regressão de tipagem
*/

})