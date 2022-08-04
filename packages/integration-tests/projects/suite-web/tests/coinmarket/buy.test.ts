// @group:coinmarket

// CR: davat pozor na vscode autoimporty -> v cypressu je az na par vyjimek vsechno chainovane, takze bude zacinat teckou
// import { should } from "chai";
// import { invoke } from "cypress/types/lodash";

describe('Coinmarket buy', () => {
    // CR: davat si pozor na zavorky, tady ti chybela oteviraci slozena zavorka, ktera definuje scope beforeEach metody
    beforeEach(() => {
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

    // CR: na dokumentaci testu prosim pouzivej jsdoc (/** */) a ne multi-line comment (/* */).
    /**
     * 1. Navigates to Trade/Buy.
     * 2. Verifies the mocked API response (country:AT).
     * 3. Fills in an amount and clicks “Compare offers”.
     * 4. Verifies the mocked API response (only offers from the mocked file, e.g. banxa, btcdirect).
     * 5. Picks one offer and clicks “Get this deal”.
     * 6. Verifies that a modal opens.
     * 7. Clicks the checkbox and “Confirm”.
     * 8. Clicks “Confirm on Trezor”  in Suite and on the emulator.
     * 9. Verifies “Confirmed on Trezor” text.
     * 10. Verifies the amount, currency, crypto, provider and payment method all match the mocked/given data.
     * 11. Clicks “Finish transaction”.
     * 12. Up Next: Mocking interaction with the partners.
     */
    it.only('Should buy crypto successfully', () => {
        // CR: tady se upravil assert - je potreba overit obsah textu (protoze text neni value getnuteho elementu, ale je hloub ve strukture)
        cy.getTestElement('@coinmarket/buy/country-select/input').should('contain.text', 'Austria');
        // tenhle krok je nejspis zastaraly z nejake predchozi verze frontendu, v inputu je hodnota prazdna.
        // cy.getTestElement('@coinmarket/buy/crypto-input').should('have.value', 'BTC');
        // cy.getTestElement('@coinmarket/buy/fiat-input').should('have.value', 'EUR');
        /* var min = 300
        var max = 1000
        amountFiat = randomInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min;}
        I want to write in a code which generates the fiat amount each time the test is executed.
        This obviously doesn't work, but I think it's a good idea than a static amount.
        */
        cy.getTestElement('@coinmarket/buy/fiat-input').type('500');
        cy.getTestElement('@coinmarket/buy/compare-button').click();
        // CR: staticky wait (a takto dlouhy) je velke no-no,
        cy.wait(5000);
        // CR: tahle cast je podle me zbytecne prepalena, nemyslim ze je potreba kontrolovat, ze tam neni vsech 5 provideru, staci 1-2 max. Navic, takhle negativni kontrola je docela dost
        // siroka, co kdyz tam budou nejaka jina spatna data, ale tato ne? Je lepsi kontrolovat, ze je v aplikaci to, co tam ty ocekavas (mockovana data)
        cy.contains('mercuryo').should('not.exist'); // Here I am reverse checking that no other providers except the mocks exist
        cy.contains('coinify').should('not.exist'); // This could be written more elegantly, how?
        cy.contains('wyre').should('not.exist');
        cy.contains('simplex').should('not.exist');
        cy.contains('cexdirect').should('not.exist');

        cy.getTestElement('@coinmarket/buy/offers/get-this-deal-button').eq(1).click(); // I want to select the second element from the list
        // pozor u tohoto getu -> pokud pozuivas cy.get a jako prvni znak pouzijes "@", cypress to chape jako cypress variable/alias. Tady jsi chtela pouzit cy.getTestElement()
        cy.getTestElement('@modal').should('be.visible'); // Checking whether this opens in a modal
        // cy.wait(3000); // CR: wait neni potreba
        cy.getTestElement('@coinmarket/buy/offers/buy-terms-agree-checkbox').click();
        cy.getTestElement('@coinmarket/buy/offers/buy-terms-confirm-button').click();
        cy.getTestElement('@coinmarket/buy/offers/confirm-on-trezor-button').click();
        // CR: interakce s tenvem je naopak jedine misto, kde staticke waity opravdu potrebujeme, protoze z tenvu nedostanem zadny feedback, ktereho by se slo chytit. Vetsinou staci i takto kratke.
        cy.wait(500);
        cy.task('pressYes');
        // cy.wait(3000); // CR: wait neni potreba

        // nasledujici gety ti nemuzou projit, napr. "CoinmarketBuyOfferInfo" sama o sobe neni vubec nic, cy.get potrebuje dostat platny css selektor. Pokud te zajima proc cy.getTestElement muze dostat jen hodnotu datatestu,
        // je to proto, ze si ji sam doplni do selektoru. cy.getTestElement('@modal') se prelozi na cy.get('[data-test="@modal"]')
        cy.get('CoinmarketBuyOfferInfo').should('have.value', 'BTC');
        cy.contains('[class^="CoinmarketBuyOfferInfo"]', 'buy');
        cy.get('CoinmarketBuyOfferInfo').should('have.value', 'EUR'); // I created this data-test-id
        cy.get('CoinmarketProviderInfo').should('have.value', 'Banxa');
        cy.get('CoinmarketPaymentType').should('have.value', 'Bank Transfer');
        // I need to also check the amount put in, which I want to do by putting in in a variable and then checking it

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
