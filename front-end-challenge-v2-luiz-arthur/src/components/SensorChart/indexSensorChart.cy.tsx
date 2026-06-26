import React from 'react'
import SensorChart from './index'

describe('<SensorChart />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SensorChart />)
  })
})