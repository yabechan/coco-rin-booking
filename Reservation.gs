// 予約管理シートの設定
const SHEET_NAMES = {
  RESERVATIONS: '予約一覧',
  AVAILABILITY: '空室管理'
}

// 予約を作成
function createReservation(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAMES.RESERVATIONS)
  
  // 予約番号の生成（年月日-連番）
  const today = new Date()
  const baseNumber = Utilities.formatDate(today, 'JST', 'yyyyMMdd')
  const lastRow = sheet.getLastRow()
  const sequence = lastRow > 1 ? lastRow : 1
  const reservationNumber = `${baseNumber}-${sequence.toString().padStart(3, '0')}`
  
  // 予約データの整形
  const reservationData = [
    reservationNumber,              // 予約番号
    data.email,                     // メールアドレス
    data.name,                      // 代表者氏名
    data.nameKana,                  // ふりがな
    data.phone,                     // 電話番号
    data.address || '',             // お住まい
    data.adultCount,               // 大人人数
    data.childCount,               // 子供人数
    (data.childAges || []).join(','), // 子供年齢
    data.checkIn,                   // チェックイン日
    data.checkOut,                  // チェックアウト日
    data.checkInTime,              // チェックイン予定時間
    data.transportation,           // 交通手段
    data.needPickup ? 'あり' : 'なし', // 送迎要否
    data.status || 'pending',       // ステータス
    new Date().toISOString()        // 予約日時
  ]
  
  // データを追加
  sheet.appendRow(reservationData)
  
  // 空室情報を更新
  updateAvailability(data.checkIn, data.checkOut)
  
  // メール送信
  const mailData = {
    ...data,
    reservationNumber: reservationNumber
  }
  const mailSent = sendReservationMails(mailData)
  
  return {
    success: true,
    reservationNumber: reservationNumber,
    mailSent: mailSent
  }
}

// 空室状況を取得
function getAvailability(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAMES.AVAILABILITY)
  
  const startDate = new Date(params.startDate)
  const endDate = new Date(params.endDate)
  
  // データ範囲を取得
  const dataRange = sheet.getDataRange()
  const values = dataRange.getValues()
  
  // ヘッダー行をスキップ
  const availabilityData = values.slice(1).map(row => ({
    date: Utilities.formatDate(row[0], 'JST', 'yyyy-MM-dd'),
    available: row[1] === true,
    reservedRooms: row[2] || 0
  }))
  
  // 指定期間のデータをフィルタリング
  return availabilityData.filter(data => {
    const date = new Date(data.date)
    return date >= startDate && date <= endDate
  })
}

// 空室情報を更新
function updateAvailability(checkIn, checkOut) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAMES.AVAILABILITY)
  
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  
  // 宿泊期間中の各日付について空室数を更新
  let currentDate = new Date(checkInDate)
  while (currentDate < checkOutDate) {
    updateAvailabilityForDate(sheet, currentDate)
    currentDate.setDate(currentDate.getDate() + 1)
  }
}

// 特定日の空室情報を更新
function updateAvailabilityForDate(sheet, date) {
  const dateStr = Utilities.formatDate(date, 'JST', 'yyyy-MM-dd')
  const data = sheet.getDataRange().getValues()
  
  // 該当する日付の行を探す
  const rowIndex = data.findIndex(row => 
    Utilities.formatDate(row[0], 'JST', 'yyyy-MM-dd') === dateStr
  )
  
  if (rowIndex === -1) {
    // 該当する日付がない場合は新規作成
    sheet.appendRow([
      date,
      true,  // available
      1      // reservedRooms
    ])
  } else {
    // 既存の予約数を更新
    const reservedRooms = data[rowIndex][2] || 0
    sheet.getRange(rowIndex + 1, 3).setValue(reservedRooms + 1)
    
    // 空室状況を更新（3部屋以上予約されていたら満室）
    const isAvailable = (reservedRooms + 1) < 3
    sheet.getRange(rowIndex + 1, 2).setValue(isAvailable)
  }
} 