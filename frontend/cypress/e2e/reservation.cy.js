describe('予約フロー', () => {
  beforeEach(() => {
    // APIモックの設定
    cy.intercept('POST', '**/checkAvailability', {
      statusCode: 200,
      body: {
        success: true,
        availability: true
      }
    }).as('checkAvailability')

    cy.intercept('POST', '**/createReservation', {
      statusCode: 200,
      body: {
        success: true,
        reservationId: 'R123456'
      }
    }).as('createReservation')

    // トップページにアクセス
    cy.visit('/')
  })

  it('予約フローが正常に完了すること', () => {
    // 予約ページに遷移
    cy.contains('宿泊予約をする').click()
    cy.url().should('include', '/reservation')

    // フォームに入力
    cy.get('#email').type('test@example.com')
    cy.get('#name').type('テスト太郎')
    cy.get('#nameKana').type('てすとたろう')
    cy.get('#checkIn').type('2024-03-01')
    cy.get('#checkOut').type('2024-03-03')
    cy.get('#adultCount').clear().type('2')
    cy.get('#childCount').clear().type('1')

    // 料金が表示されることを確認
    cy.get('.total-price').should('be.visible')

    // フォームを送信
    cy.get('.submit-btn').click()

    // APIリクエストを確認
    cy.wait('@createReservation').its('request.body').should('deep.include', {
      email: 'test@example.com',
      name: 'テスト太郎',
      nameKana: 'てすとたろう'
    })

    // 確認ページに遷移することを確認
    cy.url().should('include', '/confirmation')
    cy.contains('ご予約ありがとうございます').should('be.visible')
    cy.contains('R123456').should('be.visible')
  })

  it('バリデーションエラーが表示されること', () => {
    cy.visit('/reservation')

    // 空のフォームを送信
    cy.get('.submit-btn').click()

    // エラーメッセージが表示されることを確認
    cy.get('.error').should('be.visible')
  })

  it('空室がない場合、エラーが表示されること', () => {
    // 空室なしのモック
    cy.intercept('POST', '**/checkAvailability', {
      statusCode: 200,
      body: {
        success: true,
        availability: false
      }
    }).as('checkAvailabilityFull')

    cy.visit('/reservation')

    // 日付を選択
    cy.get('#checkIn').type('2024-03-01')
    cy.get('#checkOut').type('2024-03-03')

    // エラーメッセージが表示されることを確認
    cy.contains('指定された期間は満室です').should('be.visible')
  })

  it('APIエラー時にエラーメッセージが表示されること', () => {
    // APIエラーのモック
    cy.intercept('POST', '**/createReservation', {
      statusCode: 500,
      body: {
        success: false,
        message: 'サーバーエラーが発生しました'
      }
    }).as('createReservationError')

    cy.visit('/reservation')

    // フォームに入力
    cy.get('#email').type('test@example.com')
    cy.get('#name').type('テスト太郎')
    cy.get('#nameKana').type('てすとたろう')
    cy.get('#checkIn').type('2024-03-01')
    cy.get('#checkOut').type('2024-03-03')
    cy.get('#adultCount').clear().type('2')

    // フォームを送信
    cy.get('.submit-btn').click()

    // エラーメッセージが表示されることを確認
    cy.contains('予約作成に失敗しました').should('be.visible')
  })

  it('レスポンシブデザインが機能すること', () => {
    // モバイル表示に切り替え
    cy.viewport('iphone-x')
    cy.visit('/reservation')

    // フォームが適切に表示されることを確認
    cy.get('.reservation-form').should('be.visible')
    cy.get('.guest-count').should('have.css', 'flex-direction', 'column')
  })
}) 