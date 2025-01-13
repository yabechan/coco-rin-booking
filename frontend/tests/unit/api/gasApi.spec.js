import GasApiClient from '@/api/gasApi'

describe('GasApiClient', () => {
  const mockFetch = jest.fn()
  global.fetch = mockFetch

  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('checkAvailability', () => {
    const checkIn = '2024-03-01'
    const checkOut = '2024-03-03'

    it('空室確認が成功した場合、正しいレスポンスを返すこと', async () => {
      const mockResponse = {
        success: true,
        availability: true
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await GasApiClient.checkAvailability(checkIn, checkOut)
      
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('action=checkAvailability'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ checkIn, checkOut })
        })
      )
    })

    it('APIがエラーを返した場合、エラーがスローされること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      await expect(GasApiClient.checkAvailability(checkIn, checkOut))
        .rejects
        .toThrow('空室確認に失敗しました')
    })

    it('ネットワークエラーの場合、エラーがスローされること', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(GasApiClient.checkAvailability(checkIn, checkOut))
        .rejects
        .toThrow('Network error')
    })
  })

  describe('createReservation', () => {
    const reservationData = {
      email: 'test@example.com',
      name: 'テスト太郎',
      checkIn: '2024-03-01',
      checkOut: '2024-03-03'
    }

    it('予約作成が成功した場合、正しいレスポンスを返すこと', async () => {
      const mockResponse = {
        success: true,
        reservationId: 'R123456'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await GasApiClient.createReservation(reservationData)
      
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('action=createReservation'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reservationData)
        })
      )
    })

    it('APIがエラーを返した場合、エラーがスローされること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      await expect(GasApiClient.createReservation(reservationData))
        .rejects
        .toThrow('予約作成に失敗しました')
    })

    it('ネットワークエラーの場合、エラーがスローされること', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(GasApiClient.createReservation(reservationData))
        .rejects
        .toThrow('Network error')
    })
  })

  describe('handleError', () => {
    it('エラーメッセージを含むオブジェクトを返すこと', () => {
      const error = new Error('テストエラー')
      const result = GasApiClient.handleError(error)

      expect(result).toEqual({
        success: false,
        message: 'テストエラー'
      })
    })

    it('エラーメッセージがない場合、デフォルトメッセージを返すこと', () => {
      const result = GasApiClient.handleError({})

      expect(result).toEqual({
        success: false,
        message: '予期せぬエラーが発生しました'
      })
    })
  })
}) 