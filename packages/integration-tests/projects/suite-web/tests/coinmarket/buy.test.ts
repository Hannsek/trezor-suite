// @group:coinmarket

import { should } from "chai";
import { invoke } from "cypress/types/lodash";

/*
1. Navigates to Trade/Buy. 
2. Verifies the mocked API response (country:AT).
3. Fills in an amount and clicks “Compare offers”.
4. Verifies the mocked API response (only offers from the mocked file, e.g. banxa, btcdirect).
5. Picks one offer and clicks “Get this deal”.
6. Verifies that a modal opens. 
7. Clicks the checkbox and “Confirm”.
8. Clicks “Confirm on Trezor”  in Suite and on the emulator.
9. Verifies “Confirmed on Trezor” text.
10. Verifies the amount, currency, crypto, provider and payment method all match the mocked/given data.
11. Clicks “Finish transaction”.
12. Up Next: Mocking interaction with the partners.
*/

describe('Coinmarket buy', () => {
    beforeEach(() => 
        cy.task('startEmu', { wipe: true });
        cy.task('setupEmu', { needs_backup: false });
        cy.task('startBridge');

        cy.viewport(1024, 768).resetDb();
        cy.interceptInvityApi();
        cy.prefixedVisit('/');
        cy.passThroughInitialRun();
        cy.discoveryShouldFinish();
        // navigate to buy
        cy.getTestElement('@suite/menu/wallet-index').click();
        cy.getTestElement('@wallet/menu/wallet-coinmarket-buy').click();
    });

    it('Should buy crypto successfully', () => {
        cy.getTestElement('@coinmarket/buy/country-select/input').should('have.value', 'AT'); 
        cy.getTestElement('@coinmarket/buy/crypto-input').should('have.value', 'BTC');
        cy.getTestElement('@coinmarket/buy/fiat-input').should('have.value', 'EUR');
        /*var min = 300
        var max = 1000
        amountFiat = randomInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min;}
        I want to write in a code which generates the fiat amount each time the test is executed.
        This obviously doesn't work, but I think it's a good idea than a static amount.    
        */
        cy.getTestElement('@coinmarket/buy/fiat-input').type('500');
        cy.getTestElement('@coinmarket/buy/compare-button').click();
        cy.wait(5000);
        cy.contains('mercuryo').should('not.exist'); //Here I am reverse checking that no other providers except the mocks exist 
        cy.contains('coinify').should('not.exist'); //This could be written more elegantly, how?
        cy.contains('wyre').should('not.exist');
        cy.contains('simplex').should('not.exist');
        cy.contains('cexdirect').should('not.exist'); 

        cy.getTestElement('@coinmarket/buy/offers/get-this-deal-button').eq(1).click(); //I want to select the second element from the list
        cy.get('@modal').should('be.visible'); //Checking whether this opens in a modal
        cy.wait(3000);
        cy.getTestElement('@coinmarket/buy/offers/buy-terms-agree-checkbox').click();
        cy.getTestElement('@coinmarket/buy/offers/buy-terms-confirm-button').click();
        cy.getTestElement('@coinmarket/buy/offers/confirm-on-trezor-button').click();
        cy.task('pressYes');
        cy.wait(3000);
        
        cy.get('CoinmarketBuyOfferInfo').should('have.value', 'BTC');
        cy.get('CoinmarketBuyOfferInfo').should('have.value', 'EUR'); //I created this data-test-id
        cy.get('CoinmarketProviderInfo').should('have.value', 'Banxa');
        cy.get('CoinmarketPaymentType').should('have.value', 'Bank Transfer');
        //I need to also check the amount put in, which I want to do by putting in in a variable and then checking it

        cy.getTestElement('@coinmarket/buy/offers/finish-transaction-button').click();
        // TODO: click buy button on mocked server
        // TODO: check the UI in suite for completed tx
    });

    /* it('Should show same crypto currency as it has been chosen (BTC)', () => {
        // Cannot easily check selected account for now. Rely on URI.
        cy.getTestElement('@coinmarket/buy/crypto-currency-select/input').contains('BTC');
    });

    it("Should remember form's values as a draft", () => {
        // TODO-test: set also country and verify that it is remembered

        cy.getTestElement('@coinmarket/buy/fiat-input').type('1000');
        cy.wait(1000);

        cy.getTestElement('@suite/menu/wallet-index').click();
        cy.getTestElement('@wallet/menu/wallet-coinmarket-buy').click();
        cy.getTestElement('@coinmarket/buy/fiat-input').should('have.value', '1000');
    });

    it('Should clear form draft', () => {
        // TODO-test: set fiat or crypto input, press clear button and verify that the form is empty
    });

    it('Should get error on non numeric value typed to fiat input', () => {
        // TODO-test: enter non numeric value to the fiat input field and verify that an error is shown
    }); */
});
