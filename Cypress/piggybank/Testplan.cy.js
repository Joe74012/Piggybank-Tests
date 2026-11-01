/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('- Geld overboeken', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('button[class="login__account"]').eq(0).should('not.have.text', "").click();
  })
  it('Geld overboeken van een rekening waar geld op staat.', () => {
    cy.visit('http://localhost:3000/transfer');
    cy.get('select[name="toaccount"]').should('have.attr', "required");
    cy.get('select[name="toaccount"]').select('3');
    cy.get('input[type="number"]').should('have.class', "amount-input").type("25");
    cy.get('textarea[name="description"]').should('have.attr', "required");
    cy.get('textarea[name="description"]').type("Zakgeld");
    cy.get('button[type="submit"]').should('have.text', "Overboeken").click();
    cy.get('div[class="alert"]').should('exist');
    cy.visit('http://localhost:3000/transactions');
    cy.contains('.transaction', 'Zakgeld').should('contain.text', '-25');
  })
  it('- Geld overboeken met onvoldoende saldo', () => {
    cy.visit('http://localhost:3000/transfer');
    cy.get('select[name="toaccount"]').should('have.attr', "required");
    cy.get('select[name="toaccount"]').select('3');
    cy.get('input[type="number"]').should('have.class', "amount-input").type("10000");
    cy.get('textarea[name="description"]').should('have.attr', "required");
    cy.get('textarea[name="description"]').type("Bedrag om negatief saldo te hebben.");
    cy.get('button[type="submit"]').should('have.text', "Overboeken").click();
    
    cy.visit('http://localhost:3000/transfer');
    cy.get('select[name="toaccount"]').should('have.attr', "required");
    cy.get('select[name="toaccount"]').select('3');
    cy.get('input[type="number"]').should('have.class', "amount-input").type("25");
    cy.get('textarea[name="description"]').should('have.attr', "required");
    cy.get('textarea[name="description"]').type("Zakgeld");
    cy.get('button[type="submit"]').should('have.text', "Overboeken").click();
    cy.get('div[class="alert"]').should('not.exist');

  })
  it('- Geld overboeken met geen geld', () => {
    cy.contains('button', 'Uitloggen').click();
    cy.get('div[class="login__account-selector"]').should('exist');
    cy.get('button[class="login__account"]').eq(1).should('not.have.text', "").click();

    cy.visit('http://localhost:3000/transfer');
    cy.get('select[name="toaccount"]').should('have.attr', "required");
    cy.get('select[name="toaccount"]').select('3');
    cy.get('input[type="number"]').should('have.class', "amount-input").type("968.65"); //gelijk aan het bedrag van het account
    cy.get('textarea[name="description"]').should('have.attr', "required");
    cy.get('textarea[name="description"]').type("Zakgeld");
    cy.get('button[type="submit"]').should('have.text', "Overboeken").click();
    cy.get('div[class="alert"]').should('not.exist');
  })
  it('- Geld overboeken met een teken', () => {
    cy.visit('http://localhost:3000/transfer');
    cy.get('select[name="toaccount"]').should('have.attr', "required");
    cy.get('select[name="toaccount"]').select('3');
    cy.get('input[type="number"]').should('have.class', "amount-input").type("%^*");
    cy.get('textarea[name="description"]').should('have.attr', "required");
    cy.get('textarea[name="description"]').type("Zakgeld");
    cy.get('button[type="submit"]').should('have.text', "Overboeken").click();
    cy.get('input[type="number"]').should('be.empty');
    cy.get('div[class="alert"]').should('not.exist');
  })
  it('- Geld overboeken zonder omschrijving', () => {
    cy.visit('http://localhost:3000/transfer');
    cy.get('select[name="toaccount"]').should('have.attr', "required");
    cy.get('select[name="toaccount"]').select('3');
    cy.get('input[type="number"]').should('have.class', "amount-input").type(25);
    cy.get('button[type="submit"]').should('have.text', "Overboeken").click();;
    cy.get('div[class="alert"]').should('exist');
    cy.visit('http://localhost:3000/transactions');
    cy.contains('.transaction', '').should('contain.text', '-25');
  })
  it('- Geld overboeken met andere valuta', () => {
    cy.visit('http://localhost:3000/transfer');
    cy.get('select[name="toaccount"]').should('have.attr', "required");
    cy.get('select[name="toaccount"]').select('3');
    cy.get('select[class="transfer__currency"]').should('have.attr', "required")
    cy.get('select[class="transfer__currency"]').select('GBP');
    cy.get('input[type="number"]').should('have.class', "amount-input").type(25);
    cy.get('textarea[name="description"]').should('have.attr', "required");
    cy.get('textarea[name="description"]').type("Zakgeld");
    cy.get('button[type="submit"]').should('have.text', "Overboeken").click();
    cy.get('div[class="alert"]').should('exist');
  })
  it('- Negatief Geld overboeken', () => {
    cy.visit('http://localhost:3000/transfer');
    cy.get('select[name="toaccount"]').should('have.attr', "required");
    cy.get('select[name="toaccount"]').select('3');
    cy.get('input[type="number"]').should('have.class', "amount-input").type(-25);
    cy.get('textarea[name="description"]').should('have.attr', "required");
    cy.get('textarea[name="description"]').type("Zakgeld");
    cy.get('button[type="submit"]').should('have.text', "Overboeken").click();
    cy.get('div[class="alert"]').should('not.exist');
  })
})

describe('- Inloggen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  })
  it('Inloggen als een willekeurige gebruiker', () => {
    cy.get('button[class="login__account"]').eq(0).should('not.have.text', "").click();
    cy.get('div[class="accounts__account"]').should('exist');
    cy.visit('http://localhost:3000/transactions');
    cy.get('.transaction').should('exist');
    cy.visit('http://localhost:3000/settings');
    cy.get('#accountName').should('have.value', 'Rekening van Melvin');
  })
})

describe('- Uitloggen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('button[class="login__account"]').eq(0).should('not.have.text', "").click();
  })
  it('Uitloggen als gebruiker', () => {
    cy.contains('button', 'Uitloggen').click();
    cy.get('div[class="login__account-selector"]').should('exist');
    cy.contains('nav a', 'Overzicht').click();
    cy.get('div[class="login__account-selector"]').should('exist');
    cy.contains('nav a', 'Transacties').click();
    cy.get('div[class="login__account-selector"]').should('exist');
    cy.contains('nav a', 'Overboeken').click();
    cy.get('div[class="login__account-selector"]').should('exist');
    cy.contains('nav a', 'Instellingen').click();
    cy.get('div[class="login__account-selector"]').should('exist');
  })
})

describe('- Rekening naam wijzigen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('button[class="login__account"]').eq(0).should('not.have.text', "").click();
  })
  it('Rekenings naam van gebruiker aanpassen', () => {
    cy.visit('http://localhost:3000/settings');
    cy.get('input[type="text"]').should('have.attr', "required");
    cy.get('input[type="text"]').type("Nieuwe rekenings naam");
    cy.get('button[type="submit"]').contains('button', 'Opslaan').click();
    cy.get('div[class="alert"]').should('exist');
    cy.visit('http://localhost:3000/');
    cy.get('.accounts__account-name').should('have.text', 'Nieuwe rekenings naam');
    cy.visit('http://localhost:3000/transfer');
    cy.get('select[name="account"]').should('contain.text', 'Nieuwe rekenings naam');
    cy.visit('http://localhost:3000/settings');
    cy.get('#accountName').should('have.value', 'Nieuwe rekenings naam');
  })
  it('Rekenings naam van gebruiker aanpassen naar een speciaal teken', () => {
    cy.visit('http://localhost:3000/settings');
    cy.get('input[type="text"]').should('have.attr', "required");
    cy.get('input[type="text"]').type("$%^^");
    cy.get('button[type="submit"]').contains('button', 'Opslaan').click();
    cy.get('div[class="alert"]').should('exist');
    cy.visit('http://localhost:3000/');
    cy.get('.accounts__account-name').should('have.text', '$%^^');
    cy.visit('http://localhost:3000/transfer');
    cy.get('select[name="account"]').should('contain.text', '$%^^');
    cy.visit('http://localhost:3000/settings');
    cy.get('#accountName').should('have.value', '$%^^');
  })
  it('Rekenings naam van gebruiker aanpassen naar een leeg veld', () => {
    cy.visit('http://localhost:3000/settings');
    cy.get('input[type="text"]').should('have.attr', "required");
    cy.get('input[type="text"]').clear();
    cy.get('button[type="submit"]').contains('button', 'Opslaan').click();
    cy.get('div[class="alert"]').should('not.exist');
  })
})