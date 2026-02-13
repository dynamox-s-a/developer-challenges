describe('Teste de API - /data e /metadata', () => {
      it('API - data.json', () => {
    cy.request({
      method: 'GET',
      url: 'https://frontend-test-for-qa.vercel.app/data.json',
      headers: {
        accept: 'application/json'
      }
    }).then((response) => {

      // Valida status code
      expect(response.status).to.eq(200)

      // Valida header de resposta
      expect(response.headers['content-type'])
        .to.include('application/json')

      // Valida body 
      expect(response.body).to.not.be.null

    })
  })

   it('API - metadata.json', () => {

    cy.request({
      method: 'GET',
      url: 'https://frontend-test-for-qa.vercel.app/metadata.json',
      headers: {
        accept: 'application/json'
      }
    }).then((response) => {

      // Valida status
      expect(response.status).to.eq(200)

      // Valida content-type
      expect(response.headers['content-type'])
        .to.include('application/json')

      // Valida body
      expect(response.body).to.exist
      expect(response.body).to.be.an('object')

    })

  })

})