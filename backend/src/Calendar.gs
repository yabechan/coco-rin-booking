class CalendarManager {
  // カレンダーID（デフォルトカレンダーを使用）
  static get CALENDAR_ID() { return 'primary'; }
  
  // 予約をカレンダーに追加
  static addReservation(reservationData) {
    try {
      const calendar = CalendarApp.getCalendarById(this.CALENDAR_ID);
      const checkIn = new Date(reservationData.checkIn);
      const checkOut = new Date(reservationData.checkOut);
      
      // イベントのタイトルと説明を作成
      const title = `予約：${reservationData.name}様（${reservationData.reservationId}）`;
      const description = this.createEventDescription(reservationData);
      
      // イベントを作成
      const event = calendar.createEvent(
        title,
        checkIn,
        checkOut,
        {
          description: description
        }
      );
      
      return {
        success: true,
        eventId: event.getId()
      };
      
    } catch (error) {
      console.error('カレンダー登録エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // イベントの説明文を作成
  static createEventDescription(data) {
    return `
■予約情報
予約番号：${data.reservationId}
宿泊人数：大人${data.adultCount}名${data.childCount > 0 ? `、お子様${data.childCount}名` : ''}

■予約者情報
お名前：${data.name}
ふりがな：${data.nameKana}
電話番号：${data.phone}
メール：${data.email}

■料金
合計：¥${this.calculateTotalPrice(data).toLocaleString()}
    `.trim();
  }
  
  // 合計金額の計算（MailManagerと同じロジック）
  static calculateTotalPrice(data) {
    const adultPrice = 13000;
    const childPrice = 6500;
    return (data.adultCount * adultPrice) + (data.childCount * childPrice);
  }
  
  // 予約の更新
  static updateReservation(eventId, reservationData) {
    try {
      const calendar = CalendarApp.getCalendarById(this.CALENDAR_ID);
      const event = calendar.getEventById(eventId);
      
      if (!event) {
        throw new Error('指定された予約が見つかりません');
      }
      
      const checkIn = new Date(reservationData.checkIn);
      const checkOut = new Date(reservationData.checkOut);
      
      // イベントを更新
      event.setTitle(`予約：${reservationData.name}様（${reservationData.reservationId}）`);
      event.setDescription(this.createEventDescription(reservationData));
      event.setTime(checkIn, checkOut);
      
      return {
        success: true,
        eventId: event.getId()
      };
      
    } catch (error) {
      console.error('カレンダー更新エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // 予約のキャンセル（イベントの削除）
  static cancelReservation(eventId) {
    try {
      const calendar = CalendarApp.getCalendarById(this.CALENDAR_ID);
      const event = calendar.getEventById(eventId);
      
      if (!event) {
        throw new Error('指定された予約が見つかりません');
      }
      
      event.deleteEvent();
      
      return {
        success: true
      };
      
    } catch (error) {
      console.error('予約キャンセルエラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // 空室状況の確認
  static checkAvailability(startDate, endDate) {
    try {
      const calendar = CalendarApp.getCalendarById(this.CALENDAR_ID);
      const events = calendar.getEvents(new Date(startDate), new Date(endDate));
      
      // 予約済みの日付を集計
      const reservedDates = events.reduce((acc, event) => {
        const start = event.getStartTime();
        const end = event.getEndTime();
        const dates = this.getDatesInRange(start, end);
        
        dates.forEach(date => {
          const dateStr = Utilities.formatDate(date, 'JST', 'yyyy-MM-dd');
          acc[dateStr] = (acc[dateStr] || 0) + 1;
        });
        
        return acc;
      }, {});
      
      // 空室状況を判定（1日3部屋まで）
      const availability = {};
      const current = new Date(startDate);
      const end = new Date(endDate);
      
      while (current <= end) {
        const dateStr = Utilities.formatDate(current, 'JST', 'yyyy-MM-dd');
        const reservedCount = reservedDates[dateStr] || 0;
        availability[dateStr] = {
          available: reservedCount < 3,
          remainingRooms: 3 - reservedCount
        };
        current.setDate(current.getDate() + 1);
      }
      
      return {
        success: true,
        availability: availability
      };
      
    } catch (error) {
      console.error('空室確認エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // 日付範囲内の全日付を取得
  static getDatesInRange(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    
    while (current < endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }
} 