// 予約データを処理するメインクラス
class ReservationManager {
  constructor() {
    // スプレッドシートの取得
    this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // 予約データシートの取得または作成
    this.sheet = this.spreadsheet.getSheetByName('予約データ');
    if (!this.sheet) {
      this.sheet = this.spreadsheet.insertSheet('予約データ');
      // ヘッダー行の設定
      this.sheet.appendRow([
        '予約番号',
        '氏名',
        'フリガナ',
        'メールアドレス',
        '電話番号',
        '大人人数',
        '子供人数',
        'チェックイン',
        'チェックアウト',
        'ステータス',
        '作成日時'
      ]);
    }
  }

  // 新規予約を作成
  createReservation(reservationData) {
    try {
      // 予約番号の生成
      const reservationId = this.generateReservationId();
      
      // データの検証
      this.validateReservationData(reservationData);
      
      // 空室確認
      if (!this.checkAvailability(reservationData.checkIn, reservationData.checkOut)) {
        throw new Error('指定された期間は満室です');
      }
      
      // 予約データの保存
      this.saveReservation({
        reservationId,
        ...reservationData,
        status: '予約確定',
        createdAt: new Date()
      });
      
      // カレンダーに予約を追加
      CalendarManager.addReservation(reservationData);
      
      // メール送信
      MailManager.sendReservationConfirmation(reservationData);
      
      return {
        success: true,
        reservationId: reservationId,
        message: '予約が完了しました'
      };
      
    } catch (error) {
      console.error('予約作成エラー:', error);
      return {
        success: false,
        message: error.message || '予約処理中にエラーが発生しました'
      };
    }
  }

  // 予約データのバリデーション
  validateReservationData(data) {
    const requiredFields = [
      'email',
      'name',
      'nameKana',
      'phone',
      'adultCount',
      'checkIn',
      'checkOut'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`${field}は必須項目です`);
      }
    }
    
    // childCountの検証（undefined/nullの場合のみエラー、0は許可）
    if (data.childCount === undefined || data.childCount === null) {
      throw new Error('childCountは必須項目です');
    }

    // 人数の検証
    if (data.adultCount <= 0) {
      throw new Error('大人の人数は1人以上で指定してください');
    }
    if (data.childCount < 0) {
      throw new Error('子供の人数は0人以上で指定してください');
    }
    
    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('メールアドレスの形式が正しくありません');
    }
    
    // 日付のチェック
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時刻部分をリセット

    // 日付の妥当性チェック
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new Error('無効な日付形式です');
    }
    
    if (checkIn < today) {
      throw new Error('チェックイン日は今日以降の日付を指定してください');
    }
    if (checkOut <= checkIn) {
      throw new Error('チェックアウト日はチェックイン日の翌日以降を指定してください');
    }
  }

  // 予約番号の生成
  generateReservationId() {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `R${timestamp}${random}`;
  }

  // 空室状況の確認
  checkAvailability(checkIn, checkOut) {
    // TODO: 実際の空室確認ロジックを実装
    return true;
  }

  // 予約データの保存
  saveReservation(data) {
    const row = [
      data.reservationId,
      data.name,
      data.nameKana,
      data.email,
      data.phone,
      data.adultCount,
      data.childCount,
      data.checkIn,
      data.checkOut,
      data.status,
      data.createdAt
    ];
    
    this.sheet.appendRow(row);
  }
}

// APIエンドポイント
function doPost(e) {
  const reservationManager = new ReservationManager();
  
  try {
    const data = JSON.parse(e.postData.contents);
    const result = reservationManager.createReservation(data);
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.message || 'リクエストの処理中にエラーが発生しました'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// テスト用の予約データ取得API
function doGet() {
  const reservationManager = new ReservationManager();
  const sheet = reservationManager.sheet;
  const data = sheet.getDataRange().getValues();
  
  const headers = data[0];
  const reservations = data.slice(1).map(row => {
    const reservation = {};
    headers.forEach((header, index) => {
      reservation[header] = row[index];
    });
    return reservation;
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: reservations
  })).setMimeType(ContentService.MimeType.JSON);
} 