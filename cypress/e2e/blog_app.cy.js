

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testi Uuseri',
      username: 'testUser',
      password: 'pass123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')

    const user2 = {
      name: 'Another user',
      username: 'userRand',
      password: 'pass123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('pass123')
      cy.get('#login-button').click()
      cy.contains('Testi Uuseri logged in')
    })

    it('Fails with incorrect credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testUser', password: 'pass123' })
    })

    it('Creating a blog is possible', function() {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('e2e cypress testing')
      cy.get('#author-input').type('Tester')
      cy.get('#url-input').type('www.test.com')
      cy.get('#create').click()
      cy.contains('e2e cypress testing Tester')
    })

    describe('And a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another blog cypress',
          author: 'Tester',
          url: 'www.test.com'
        })
      })

      it('it can be liked', function () {
        cy.get('#showDetails').click()
        cy.contains('likes 0')
        cy.get('#like').click()
        cy.contains('likes 1')
      })

      it('it can be deleted by the user who created it', function () {
        cy.get('#showDetails').click()
        cy.contains('remove')
        cy.get('#remove').click()
        cy.contains('Removed blog another blog cypress by Tester')
      })

      it('the remove button is not visible for other users', function () {
        cy.get('#logout').click()
        cy.login({ username: 'userRand', password: 'pass123' })
        cy.get('#showDetails').click()
        cy.contains('remove').should('not.exist')

      })
    })

    describe('and multiple blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Least liked blog',
          author: 'Tester',
          url: 'www.test.com'
        })
        cy.createBlog({
          title: 'Most liked blog',
          author: 'Tester',
          url: 'www.test.com'
        })
        cy.createBlog({
          title: 'Decently liked blog',
          author: 'Tester',
          url: 'www.test.com'
        })

      })

      it(', the blogs should be ordered by likes', function () {
        cy.contains('Most liked blog Tester')
          .get('#showDetails').click()
        cy.contains('Decently liked blog Tester')
          .get('#showDetails').click()
        cy.contains('Least liked blog Tester')
          .get('#showDetails').click()

        cy.contains('Most liked blog Tester').parent().within(() => {
          cy.get('#like').click()
          cy.contains('likes 1')
          cy.get('#like').click()
          cy.contains('likes 2')
          cy.get('#like').click()
          cy.contains('likes 3')
        })

        cy.contains('Decently liked blog Tester').parent().within(() => {
          cy.get('#like').click()
          cy.contains('likes 1')
          cy.get('#like').click()
          cy.contains('likes 2')
        })

        cy.contains('Least liked blog Tester').parent().within(() => {
          cy.get('#like').click()
          cy.contains('likes 1')
        })

        cy.get('.fullBlog').eq(0).should('contain', 'Most liked blog')
        cy.get('.fullBlog').eq(1).should('contain', 'Decently liked blog')
        cy.get('.fullBlog').eq(2).should('contain', 'Least liked')

      })
    })

  })
})