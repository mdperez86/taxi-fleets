import {
  getLongDistanceBgColor,
  getNormalDistanceBgColor,
  getRideInfo,
  getRidePrice,
  getRides,
} from '../support/app.po';

describe('frontend', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v0/rides', {
      fixture: 'rides.json',
    }).as('rides');
    cy.intercept('GET', '/api/v0/rides/1', {
      fixture: 'ride.json',
    }).as('ride');
    cy.intercept('GET', '/api/v0/rides/1/price', {
      fixture: 'price.json',
    }).as('price');
    cy.visit('/');
  });

  it('should display rides', () => {
    cy.wait('@rides').then(({ response }) => {
      const rides = response.body;
      expect(rides).to.have.length(4);
      getRides()
        .get('li')
        .each((li, index) => {
          const ride = rides[index];
          expect(li.text()).contains(ride.id);
        });
    });
  });

  it('should render rides with distance greater then 2 miles in red', () => {
    cy.wait('@rides').then(({ response }) => {
      const rides = response.body;
      getRides()
        .get('li')
        .each((li, index) => {
          const { distance } = rides[index];
          if (distance > 2)
            expect(li.css('backgroundColor')).to.eq(getLongDistanceBgColor());
          else
            expect(li.css('backgroundColor')).to.eq(getNormalDistanceBgColor());
        });
    });
  });

  it('should show the duration and the endTime of the ride', () => {
    cy.wait('@rides').then(() => {
      getRides().get('li').first().click();
      const stub = cy.stub();
      cy.on('window:alert', stub);

      cy.wait('@ride').then(({ response }) => {
        const ride = response.body;
        expect(stub.getCall(0)).to.be.calledWithMatch(ride.endTime);
      });
    });
  });

  it('should display ride prices', () => {
    cy.wait('@price').then(({ response }) => {
      const ridePrice = response.body;
      cy.log(ridePrice);

      const ride = getRides().get('li').first();

      getRideInfo(ride).contains(ridePrice.id);
      getRidePrice(ride).contains(ridePrice.price);
    });
  });
});
