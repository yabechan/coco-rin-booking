class MailManager {
  // 管理者のメールアドレス
  static get ADMIN_EMAIL() { return 'admin@example.com'; }
  
  // 予約確認メールを送信
  static sendReservationConfirmation(reservationData) {
    try {
      // 予約者向けメール
      this.sendGuestConfirmation(reservationData);
      
      // 管理者向けメール
      this.sendAdminNotification(reservationData);
      
      return true;
    } catch (error) {
      console.error('メール送信エラー:', error);
      return false;
    }
  }
  
  // 予約者向け確認メール
  static sendGuestConfirmation(data) {
    const subject = `【coco-Rin】ご予約ありがとうございます（予約番号：${data.reservationId}）`;
    const body = this.createGuestEmailBody(data);
    
    GmailApp.sendEmail(
      data.email,
      subject,
      body,
      {
        name: 'coco-Rin予約システム',
        replyTo: this.ADMIN_EMAIL
      }
    );
  }
  
  // 管理者向け通知メール
  static sendAdminNotification(data) {
    const subject = `【新規予約】予約番号：${data.reservationId}`;
    const body = this.createAdminEmailBody(data);
    
    GmailApp.sendEmail(
      this.ADMIN_EMAIL,
      subject,
      body,
      {
        name: 'coco-Rin予約システム'
      }
    );
  }
  
  // 予約者向けメール本文の作成
  static createGuestEmailBody(data) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    
    return `
${data.name} 様

この度はcoco-Rinをご予約いただき、誠にありがとうございます。
以下の内容で予約を承りましたのでご確認ください。

■ご予約内容
予約番号：${data.reservationId}
チェックイン：${Utilities.formatDate(checkIn, 'JST', 'yyyy年MM月dd日')}
チェックアウト：${Utilities.formatDate(checkOut, 'JST', 'yyyy年MM月dd日')}
宿泊人数：大人${data.adultCount}名${data.childCount > 0 ? `、お子様${data.childCount}名` : ''}

■ご予約者情報
お名前：${data.name} 様
ふりがな：${data.nameKana}
メールアドレス：${data.email}
電話番号：${data.phone}

■お支払い金額
合計：¥${this.calculateTotalPrice(data).toLocaleString()}
（大人：¥13,000×${data.adultCount}名${data.childCount > 0 ? `、お子様：¥6,500×${data.childCount}名` : ''}）

■ご案内事項
・チェックイン時間：15:00～21:00
・チェックアウト時間：～10:00
・キャンセルポリシー：
  7日前まで：無料
  6日前～前日：50%
  当日：100%

ご不明な点がございましたら、お気軽にお問い合わせください。
心よりお待ちしております。

coco-Rin
TEL: XXX-XXXX-XXXX
Email: ${this.ADMIN_EMAIL}
    `.trim();
  }
  
  // 管理者向けメール本文の作成
  static createAdminEmailBody(data) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    
    return `
新規予約を受け付けました。

■予約情報
予約番号：${data.reservationId}
予約日時：${new Date().toLocaleString('ja-JP')}

■宿泊情報
チェックイン：${Utilities.formatDate(checkIn, 'JST', 'yyyy年MM月dd日')}
チェックアウト：${Utilities.formatDate(checkOut, 'JST', 'yyyy年MM月dd日')}
宿泊人数：大人${data.adultCount}名${data.childCount > 0 ? `、お子様${data.childCount}名` : ''}

■予約者情報
お名前：${data.name}
ふりがな：${data.nameKana}
メールアドレス：${data.email}
電話番号：${data.phone}

■料金
合計：¥${this.calculateTotalPrice(data).toLocaleString()}
    `.trim();
  }
  
  // 合計金額の計算
  static calculateTotalPrice(data) {
    const adultPrice = 13000;
    const childPrice = 6500;
    return (data.adultCount * adultPrice) + (data.childCount * childPrice);
  }
} 