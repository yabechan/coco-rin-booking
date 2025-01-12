// メールテンプレートの定義
const MAIL_TEMPLATES = {
  GUEST: {
    SUBJECT: '【coco-rin】ご予約ありがとうございます',
    BODY: `※このメールは自動送信されています。

{name} 様

この度は、coco-rinをご予約いただき、誠にありがとうございます。
以下の内容で予約を承りましたので、ご確認ください。

【予約番号】
{reservationNumber}

【ご予約内容】
■チェックイン日: {checkIn}
■チェックアウト日: {checkOut}
■チェックイン予定時間: {checkInTime}
■宿泊人数: 
  大人: {adultCount}名
  {childInfo}
■交通手段: {transportation}
{pickupInfo}

【お客様情報】
■お名前: {name}
■ふりがな: {nameKana}
■メールアドレス: {email}
■電話番号: {phone}
{addressInfo}

【料金】
■合計金額: ¥{totalPrice}
{childPriceNote}

ご不明な点がございましたら、お気軽にお問い合わせください。
当日のお越しを心よりお待ちしております。

------------------
coco-rin
メール: info@coco-rin.com
電話: XXX-XXXX-XXXX
------------------`
  },
  ADMIN: {
    SUBJECT: '【coco-rin】新規予約を受け付けました',
    BODY: `新規予約を受け付けました。

【予約番号】
{reservationNumber}

【予約内容】
■チェックイン日: {checkIn}
■チェックアウト日: {checkOut}
■チェックイン予定時間: {checkInTime}
■宿泊人数: 
  大人: {adultCount}名
  {childInfo}
■交通手段: {transportation}
{pickupInfo}

【お客様情報】
■お名前: {name}
■ふりがな: {nameKana}
■メールアドレス: {email}
■電話番号: {phone}
{addressInfo}

【料金】
■合計金額: ¥{totalPrice}
{childPriceNote}

予約管理スプレッドシートURL:
{spreadsheetUrl}`
  }
}

// メール送信処理
function sendReservationMails(reservationData) {
  const guestMail = createGuestMail(reservationData)
  const adminMail = createAdminMail(reservationData)
  
  try {
    // ゲスト向けメール送信
    MailApp.sendEmail({
      to: reservationData.email,
      subject: guestMail.subject,
      body: guestMail.body
    })
    
    // 管理者向けメール送信
    const adminEmail = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL')
    if (!adminEmail) {
      throw new Error('管理者メールアドレスが設定されていません')
    }
    
    MailApp.sendEmail({
      to: adminEmail,
      subject: adminMail.subject,
      body: adminMail.body
    })
    
    return true
  } catch (error) {
    handleMailError(error, 'MAIL_SEND', reservationData)
    return false
  }
}

// ゲスト向けメール作成
function createGuestMail(data) {
  const template = MAIL_TEMPLATES.GUEST
  const body = replaceMailTemplate(template.BODY, data)
  
  return {
    subject: template.SUBJECT,
    body: body
  }
}

// 管理者向けメール作成
function createAdminMail(data) {
  const template = MAIL_TEMPLATES.ADMIN
  const body = replaceMailTemplate(template.BODY, data)
  
  return {
    subject: template.SUBJECT,
    body: body
  }
}

// テンプレート置換処理
function replaceMailTemplate(template, data) {
  const checkIn = formatDate(new Date(data.checkIn))
  const checkOut = formatDate(new Date(data.checkOut))
  const transportationTypes = {
    car: 'お車',
    train: '電車',
    other: 'その他'
  }
  
  // 子供情報の整形
  let childInfo = ''
  if (data.childCount > 0) {
    const ages = data.childAges.join('歳, ') + '歳'
    childInfo = `  お子様: ${data.childCount}名（${ages}）`
  }
  
  // 送迎情報の整形
  let pickupInfo = ''
  if (data.transportation === 'train') {
    pickupInfo = `■送迎: ${data.needPickup ? '必要' : '不要'}`
  }
  
  // 住所情報の整形
  let addressInfo = ''
  if (data.address) {
    addressInfo = `■お住まい: ${data.address}`
  }
  
  // 子供料金の注意書き
  let childPriceNote = ''
  if (data.childCount > 0) {
    childPriceNote = '※お子様の料金は現地にてご精算ください。'
  }
  
  // 料金計算
  const prices = {
    1: 14000,
    2: 13000,
    3: 12000
  }
  const basePrice = prices[data.adultCount] || prices[1]
  const nights = Math.ceil((new Date(data.checkOut) - new Date(data.checkIn)) / (1000 * 60 * 60 * 24))
  const totalPrice = basePrice * data.adultCount * nights
  
  // テンプレート置換
  return template
    .replace(/{reservationNumber}/g, data.reservationNumber)
    .replace(/{name}/g, data.name)
    .replace(/{nameKana}/g, data.nameKana)
    .replace(/{email}/g, data.email)
    .replace(/{phone}/g, data.phone)
    .replace(/{checkIn}/g, checkIn)
    .replace(/{checkOut}/g, checkOut)
    .replace(/{checkInTime}/g, data.checkInTime)
    .replace(/{adultCount}/g, data.adultCount)
    .replace(/{childInfo}/g, childInfo)
    .replace(/{transportation}/g, transportationTypes[data.transportation])
    .replace(/{pickupInfo}/g, pickupInfo)
    .replace(/{addressInfo}/g, addressInfo)
    .replace(/{totalPrice}/g, totalPrice.toLocaleString())
    .replace(/{childPriceNote}/g, childPriceNote)
    .replace(/{spreadsheetUrl}/g, SpreadsheetApp.getActiveSpreadsheet().getUrl())
}

// 日付フォーマット
function formatDate(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDay = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  return `${year}年${month}月${day}日（${weekDay}）`
}

// メール送信エラーハンドリング
function handleMailError(error, type, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const errorLogSheet = ss.getSheetByName('エラーログ') || ss.insertSheet('エラーログ')
  
  // エラーログのヘッダー設定
  if (errorLogSheet.getLastRow() === 0) {
    errorLogSheet.appendRow([
      '発生日時',
      'エラー種別',
      '予約番号',
      'エラー内容',
      'スタック',
      'データ'
    ])
    errorLogSheet.setFrozenRows(1)
  }
  
  // エラー情報の記録
  errorLogSheet.appendRow([
    new Date().toISOString(),
    type,
    data.reservationNumber || 'N/A',
    error.message,
    error.stack,
    JSON.stringify(data)
  ])
  
  // 管理者へのエラー通知
  try {
    const adminEmail = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL')
    if (adminEmail) {
      MailApp.sendEmail({
        to: adminEmail,
        subject: '【coco-rin】メール送信エラーが発生しました',
        body: `
予約システムでメール送信エラーが発生しました。

【エラー情報】
■発生日時: ${new Date().toLocaleString('ja-JP')}
■エラー種別: ${type}
■予約番号: ${data.reservationNumber || 'N/A'}
■エラー内容: ${error.message}
■エラースタック: ${error.stack}

【予約データ】
${JSON.stringify(data, null, 2)}

エラーログスプレッドシートURL:
${ss.getUrl()}
        `
      })
    }
  } catch (notifyError) {
    console.error('エラー通知の送信に失敗しました:', notifyError)
  }
} 