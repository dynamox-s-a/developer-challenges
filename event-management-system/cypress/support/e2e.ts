import './commands'

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Hydration failed')) {
    return false
  }
})