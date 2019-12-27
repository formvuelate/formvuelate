// https://docs.cypress.io/api/introduction/api.html

describe('First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.get('title').contains('Vue App')
  })
})
