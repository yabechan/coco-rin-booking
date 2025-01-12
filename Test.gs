// テストデータの作成
function createTestReservationData() {
  return {
    email: 'test@example.com',
    name: 'テスト太郎',
    nameKana: 'テストタロウ',
    phone: '090-1234-5678',
    address: '東京都渋谷区',
    adultCount: 2,
    childCount: 1,
    childAges: [5],
    checkIn: '2024-04-01',
    checkOut: '2024-04-03',
    checkInTime: '15:00',
    transportation: 'train',
    needPickup: true,
    status: 'pending'
  }
}

// メール送信テスト
function testReservationMails() {
  const testData = createTestReservationData()
  testData.reservationNumber = 'TEST-20240401-001'
  
  try {
    const result = sendReservationMails(testData)
    console.log('メール送信テスト結果:', result)
    return result
  } catch (error) {
    console.error('メール送信テストエラー:', error)
    return false
  }
}

// 予約作成テスト
function testCreateReservation() {
  const testData = createTestReservationData()
  
  try {
    const result = createReservation(testData)
    console.log('予約作成テスト結果:', result)
    return result
  } catch (error) {
    console.error('予約作成テストエラー:', error)
    return false
  }
} 