const GAS_API_URL = process.env.VUE_APP_GAS_API_URL

class GasApiClient {
  // 空室状況を確認
  static async checkAvailability(checkIn, checkOut) {
    try {
      const response = await fetch(`${GAS_API_URL}?action=checkAvailability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checkIn,
          checkOut
        })
      })

      if (!response.ok) {
        throw new Error('空室確認に失敗しました')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('空室確認APIエラー:', error)
      throw error
    }
  }

  // 予約を作成
  static async createReservation(reservationData) {
    try {
      const response = await fetch(`${GAS_API_URL}?action=createReservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      })

      if (!response.ok) {
        throw new Error('予約作成に失敗しました')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('予約作成APIエラー:', error)
      throw error
    }
  }

  // エラーレスポンスを処理
  static handleError(error) {
    return {
      success: false,
      message: error.message || '予期せぬエラーが発生しました'
    }
  }
}

export default GasApiClient 