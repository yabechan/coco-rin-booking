// テストデータの作成
function createTestReservationData() {
  // 現在の日付から3日後をチェックイン日に設定
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + 3);
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkOutDate.getDate() + 2);

  return {
    email: 'test@example.com',
    name: 'テスト太郎',
    nameKana: 'テストタロウ',
    phone: '090-1234-5678',
    address: '東京都渋谷区',
    adultCount: 2,
    childCount: 1,
    childAges: [5],
    checkIn: Utilities.formatDate(checkInDate, 'JST', 'yyyy-MM-dd'),
    checkOut: Utilities.formatDate(checkOutDate, 'JST', 'yyyy-MM-dd'),
    checkInTime: '15:00',
    transportation: 'train',
    needPickup: true,
    status: 'pending'
  }
}

// 予約フロー全体の統合テスト
function testReservationFlow() {
  const reservationManager = new ReservationManager();
  
  const testCases = [
    {
      name: '正常系: 基本的な予約フロー',
      data: {
        ...createTestReservationData(),
        reservationId: 'TEST-' + new Date().getTime()
      },
      expectedStatus: 'success'
    },
    {
      name: '正常系: 子供なしの予約',
      data: {
        email: 'test@example.com',
        name: 'テスト太郎',
        nameKana: 'テストタロウ',
        phone: '090-1234-5678',
        address: '東京都渋谷区',
        adultCount: 2,
        childCount: 0,
        childAges: [],
        checkIn: Utilities.formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'JST', 'yyyy-MM-dd'),
        checkOut: Utilities.formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 'JST', 'yyyy-MM-dd'),
        checkInTime: '15:00',
        transportation: 'train',
        needPickup: false,
        status: 'pending',
        reservationId: 'TEST-' + new Date().getTime() + '-2'
      },
      expectedStatus: 'success'
    },
    {
      name: 'エラー系: 必須項目の欠落',
      data: {
        email: 'test@example.com',
        name: 'テスト太郎',
        reservationId: 'TEST-' + new Date().getTime() + '-3'
      },
      expectedStatus: 'error'
    },
    // 日付バリデーションのテスト
    {
      name: 'エラー系: 過去の日付を指定',
      data: {
        ...createTestReservationData(),
        checkIn: '2023-01-01',
        checkOut: '2023-01-03',
        reservationId: 'TEST-' + new Date().getTime() + '-4'
      },
      expectedStatus: 'error'
    },
    {
      name: 'エラー系: チェックアウト日がチェックイン日より前',
      data: {
        ...createTestReservationData(),
        checkIn: Utilities.formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 'JST', 'yyyy-MM-dd'),
        checkOut: Utilities.formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'JST', 'yyyy-MM-dd'),
        reservationId: 'TEST-' + new Date().getTime() + '-5'
      },
      expectedStatus: 'error'
    },
    // メールアドレスバリデーションのテスト
    {
      name: 'エラー系: 不正なメールアドレス',
      data: {
        ...createTestReservationData(),
        email: 'invalid-email',
        reservationId: 'TEST-' + new Date().getTime() + '-6'
      },
      expectedStatus: 'error'
    },
    // 人数バリデーションのテスト
    {
      name: 'エラー系: 大人0人',
      data: {
        ...createTestReservationData(),
        adultCount: 0,
        reservationId: 'TEST-' + new Date().getTime() + '-7'
      },
      expectedStatus: 'error'
    },
    {
      name: 'エラー系: 負の値の人数',
      data: {
        ...createTestReservationData(),
        adultCount: -1,
        childCount: -2,
        reservationId: 'TEST-' + new Date().getTime() + '-8'
      },
      expectedStatus: 'error'
    }
  ];

  const results = [];
  
  for (const testCase of testCases) {
    try {
      console.log(`テストケース実行: ${testCase.name}`);
      
      // 予約作成を試行
      const result = reservationManager.createReservation(testCase.data);
      
      // テスト結果の記録
      results.push({
        testCase: testCase.name,
        expected: testCase.expectedStatus,
        actual: result.success ? 'success' : 'error',
        result: result
      });
      
    } catch (error) {
      results.push({
        testCase: testCase.name,
        expected: testCase.expectedStatus,
        actual: 'error',
        error: error.toString()
      });
    }
  }
  
  // テスト結果のレポート
  console.log('=== 統合テスト結果 ===');
  results.forEach(result => {
    console.log(`\nテストケース: ${result.testCase}`);
    console.log(`期待結果: ${result.expected}`);
    console.log(`実際の結果: ${result.actual}`);
    if (result.error) {
      console.log(`エラー: ${result.error}`);
    } else if (result.result) {
      console.log('結果:', result.result);
    }
  });
  
  return results;
}

// カレンダー機能のテスト
function testCalendarOperations() {
  const testData = createTestReservationData();
  const results = [];
  
  try {
    // 予約の追加テスト
    console.log('カレンダーへの予約追加テスト');
    const addResult = CalendarManager.addReservation(testData);
    results.push({
      operation: '予約追加',
      success: addResult.success,
      result: addResult
    });
    
    if (addResult.success) {
      // 予約の更新テスト
      console.log('予約更新テスト');
      const checkOutDate = new Date(testData.checkIn);
      checkOutDate.setDate(checkOutDate.getDate() + 3); // チェックイン日から3日後に設定
      const updatedData = {
        ...testData,
        checkOut: Utilities.formatDate(checkOutDate, 'JST', 'yyyy-MM-dd')
      };
      const updateResult = CalendarManager.updateReservation(addResult.eventId, updatedData);
      results.push({
        operation: '予約更新',
        success: updateResult.success,
        result: updateResult
      });
      
      // 予約のキャンセルテスト
      console.log('予約キャンセルテスト');
      const cancelResult = CalendarManager.cancelReservation(addResult.eventId);
      results.push({
        operation: '予約キャンセル',
        success: cancelResult.success,
        result: cancelResult
      });
    }
    
  } catch (error) {
    console.error('カレンダーテストエラー:', error);
    results.push({
      operation: 'エラー発生',
      success: false,
      error: error.toString()
    });
  }
  
  // テスト結果のレポート
  console.log('\n=== カレンダー機能テスト結果 ===');
  results.forEach(result => {
    console.log(`\n操作: ${result.operation}`);
    console.log(`結果: ${result.success ? '成功' : '失敗'}`);
    if (result.error) {
      console.log(`エラー: ${result.error}`);
    } else {
      console.log('詳細:', result.result);
    }
  });
  
  return results;
}

// メール送信機能のテスト
function testMailOperations() {
  const testData = createTestReservationData();
  testData.reservationId = 'TEST-' + new Date().getTime();
  
  try {
    console.log('メール送信テスト開始');
    const result = MailManager.sendReservationConfirmation(testData);
    
    console.log('\n=== メール送信テスト結果 ===');
    console.log(`結果: ${result ? '成功' : '失敗'}`);
    
    return {
      success: result,
      testData: testData
    };
    
  } catch (error) {
    console.error('メール送信テストエラー:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
} 