describe('Страница конструктора', () => {
  describe('Гость (без авторизации)', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/ingredients', {
        fixture: 'ingredients.json'
      }).as('getIngredients');

      cy.visit('http://localhost:4000');
      cy.wait('@getIngredients');
    });

    describe('Работа с ингредиентами в конструкторе', () => {
      const ingredients = {
        bun: 'Краторная булка N-200i',
        main1: 'Филе Люминесцентного тетраодонтимформа',
        main2: 'Говяжий метеорит (отбивная)',
        sauce: 'Соус с шипами Антарианского плоскоходца'
      };

      beforeEach(() => {
        Object.values(ingredients).forEach(name => {
          cy.contains(name).parent().find('button').click();
        });
      });

      it('Отображает добавленные ингредиенты и сумму', () => {
        cy.contains('Оформить заказ')
          .parents('section')
          .first()
          .within(() => {
            cy.contains(ingredients.main1).should('exist');
            cy.contains(ingredients.main2).should('exist');
            cy.contains(ingredients.sauce).should('exist');
            cy.contains(ingredients.bun).should('exist');
            cy.contains('6586').should('exist');
          });
      });

      it('Удаляет ингредиенты и пересчитывает сумму', () => {
        cy.contains('Оформить заказ')
          .parents('section')
          .first()
          .within(() => {
            [ingredients.main2, ingredients.sauce, ingredients.main1].forEach(name => {
              cy.contains(name).parent().find('.constructor-element__action').click();
            });

            cy.contains(ingredients.bun).should('exist');
            cy.contains('1255').should('exist');
          });
      });
    });

    describe('Модальные окна', () => {
      beforeEach(() => {
        cy.contains('Говяжий метеорит (отбивная)').parent().click();
      });

      it('Открывает модалку ингредиента', () => {
        cy.get('#modals').should('contain', 'Говяжий метеорит (отбивная)');
      });

      it('Закрывает модалку через крестик', () => {
        cy.get('#modals').find('button').click();
        cy.get('#modals').should('not.contain.html');
      });

      it('Закрывает модалку по клику вне окна', () => {
        cy.get('#modals').parent().click('topRight');
      });
    });
  });

  describe('Авторизованный пользователь', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'testAccessToken');
      cy.window().then(win => {
        win.localStorage.setItem('refreshToken', 'testRefresh');
      });

      cy.intercept('GET', '/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');

      cy.intercept('GET', '/api/ingredients', {
        fixture: 'ingredients.json'
      }).as('getIngredients');

      cy.visit('http://localhost:4000');
      cy.wait(['@getUser', '@getIngredients']);
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.window().then(win => {
        win.localStorage.removeItem('refreshToken');
      });
    });

    it('Оформляет заказ с ингредиентами и получает номер', () => {
      cy.intercept('POST', '/api/orders', {
        fixture: 'order.json',
        delay: 100
      }).as('postOrder');

      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .find('button')
        .click();

      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();

      cy.contains('Оформить заказ').click();

      cy.contains('Оформляем заказ...').should('exist');

      cy.wait('@postOrder').then(() => {
        cy.get('#modals').should('contain', '76315');
        cy.get('#modals').parent().click('topRight');
        cy.get('#modals').should('not.contain.html');

        cy.contains('Выберите булки').should('exist');
        cy.contains('Выберите начинку').should('exist');
        cy.contains('Оформить заказ').parent().contains('0').should('exist');
      });
    });
  });
});
