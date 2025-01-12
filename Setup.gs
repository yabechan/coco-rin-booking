// スプレッドシートの初期設定
function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  
  // 予約一覧シートの作成
  createReservationSheet(ss)
  
  // 空室管理シートの作成
  createAvailabilitySheet(ss)
}

// 予約一覧シートの作成
function createReservationSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.RESERVATIONS)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.RESERVATIONS)
  }
  
  // ヘッダーの設定
  const headers = [
    '予約番号',
    'メールアドレス',
    '代表者氏名',
    'ふりがな',
    '電話番号',
    'お住まい',
    '大人人数',
    '子供人数',
    '子供年齢',
    'チェックイン日',
    'チェックアウト日',
    'チェックイン予定時間',
    '交通手段',
    '送迎',
    'ステータス',
    '予約日時'
  ]
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
  sheet.setFrozenRows(1)
}

// 空室管理シートの作成
function createAvailabilitySheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.AVAILABILITY)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.AVAILABILITY)
  }
  
  // ヘッダーの設定
  const headers = ['日付', '空室あり', '予約済み部屋数']
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
  sheet.setFrozenRows(1)
  
  // 今日から1年分の日付を生成
  const today = new Date()
  const dates = []
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    dates.push([date, true, 0])
  }
  
  // データを一括で追加
  sheet.getRange(2, 1, dates.length, 3).setValues(dates)
}

// 管理者メールアドレスの設定
function setupAdminEmail(adminEmail) {
  PropertiesService.getScriptProperties()
    .setProperty('ADMIN_EMAIL', adminEmail)
} 