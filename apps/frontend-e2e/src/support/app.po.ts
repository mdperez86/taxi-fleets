export const getRides = () => cy.get('[data-testid="rides"]');
export const getRide = (el: Cypress.Chainable) =>
  el.get('[data-testid="ride"]');
export const getRideInfo = (el: Cypress.Chainable) =>
  el.get('[data-testid="ride-info"]');
export const getRidePrice = (el: Cypress.Chainable) =>
  el.get('[data-testid="ride-price"]');
export const getLongDistanceBgColor = () => 'rgb(239, 83, 80)';
export const getNormalDistanceBgColor = () => 'rgba(0, 0, 0, 0)';
