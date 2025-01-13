<template>
  <div class="reservation-form">
    <h1>宿泊予約</h1>
    <form @submit.prevent="submitForm">
      <div class="form-section">
        <h2>お客様情報</h2>
        <div class="form-group">
          <label for="email">メールアドレス<span class="required">*</span></label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            @input="validateEmail"
          />
          <span class="error" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="name">代表者氏名<span class="required">*</span></label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            required
          />
        </div>

        <div class="form-group">
          <label for="nameKana">ふりがな<span class="required">*</span></label>
          <input
            type="text"
            id="nameKana"
            v-model="formData.nameKana"
            required
            @input="validateKana"
          />
          <span class="error" v-if="errors.nameKana">{{ errors.nameKana }}</span>
        </div>
      </div>

      <div class="form-section">
        <h2>宿泊情報</h2>
        <div class="date-selection">
          <DatePicker
            id="checkIn"
            label="チェックイン日"
            v-model="formData.checkIn"
            :required="true"
            :error="errors.checkIn"
            @update:modelValue="validateDates"
          />
          
          <DatePicker
            id="checkOut"
            label="チェックアウト日"
            v-model="formData.checkOut"
            :required="true"
            :min="formData.checkIn || minDate"
            :error="errors.checkOut"
            @update:modelValue="validateDates"
          />
        </div>

        <div class="form-group">
          <label>宿泊人数<span class="required">*</span></label>
          <div class="guest-count">
            <div>
              <label for="adultCount">大人</label>
              <input
                type="number"
                id="adultCount"
                v-model="formData.adultCount"
                min="1"
                required
                @input="calculatePrice"
              />
            </div>
            <div>
              <label for="childCount">小学生以下</label>
              <input
                type="number"
                id="childCount"
                v-model="formData.childCount"
                min="0"
                @input="calculatePrice"
              />
            </div>
          </div>
        </div>

        <div class="price-display" v-if="totalPrice">
          <h3>料金概算</h3>
          <p class="total-price">¥{{ totalPrice.toLocaleString() }}</p>
        </div>
      </div>

      <button type="submit" class="submit-btn">予約内容を確認する</button>
    </form>
  </div>
</template>

<script>
import DatePicker from './DatePicker.vue'
import GasApiClient from '@/api/gasApi'

export default {
  name: 'ReservationForm',
  components: {
    DatePicker
  },
  data() {
    return {
      formData: {
        email: '',
        name: '',
        nameKana: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        adultCount: 1,
        childCount: 0,
      },
      errors: {
        email: '',
        nameKana: '',
        checkIn: '',
        checkOut: '',
        phone: ''
      },
      totalPrice: 0,
      isSubmitting: false,
      apiError: ''
    }
  },
  computed: {
    minDate() {
      return new Date().toISOString().split('T')[0]
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.formData.email)) {
        this.errors.email = '正しいメールアドレスを入力してください'
      } else {
        this.errors.email = ''
      }
    },
    validateKana() {
      const kanaRegex = /^[ぁ-んー]*$/
      if (!kanaRegex.test(this.formData.nameKana)) {
        this.errors.nameKana = 'ひらがなで入力してください'
      } else {
        this.errors.nameKana = ''
      }
    },
    validatePhone() {
      const phoneRegex = /^[0-9\-]+$/
      if (!phoneRegex.test(this.formData.phone)) {
        this.errors.phone = '正しい電話番号を入力してください'
      } else {
        this.errors.phone = ''
      }
    },
    validateDates() {
      const checkIn = new Date(this.formData.checkIn)
      const checkOut = new Date(this.formData.checkOut)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      this.errors.checkIn = ''
      this.errors.checkOut = ''

      if (checkIn < today) {
        this.errors.checkIn = '過去の日付は選択できません'
      }

      if (this.formData.checkIn && this.formData.checkOut) {
        if (checkOut <= checkIn) {
          this.errors.checkOut = 'チェックアウト日はチェックイン日の翌日以降を選択してください'
        }
      }

      if (this.formData.checkIn && this.formData.checkOut) {
        this.checkAvailability()
      }
    },
    calculatePrice() {
      if (!this.formData.checkIn || !this.formData.checkOut) {
        return
      }

      const checkIn = new Date(this.formData.checkIn)
      const checkOut = new Date(this.formData.checkOut)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))

      const adultPrice = this.getAdultPrice(this.formData.adultCount)
      const childPrice = 6500

      this.totalPrice = (this.formData.adultCount * adultPrice * nights) +
                       (this.formData.childCount * childPrice * nights)
    },
    getAdultPrice(count) {
      const prices = {
        1: 14000,
        2: 13000,
        3: 12000
      }
      return prices[count] || prices[1]
    },
    async checkAvailability() {
      try {
        const result = await GasApiClient.checkAvailability(
          this.formData.checkIn,
          this.formData.checkOut
        )
        
        if (!result.success || !result.availability) {
          this.errors.checkIn = '指定された期間は満室です'
          return false
        }
        
        return true
      } catch (error) {
        console.error('空室確認エラー:', error)
        this.errors.checkIn = '空室確認に失敗しました'
        return false
      }
    },
    async submitForm() {
      if (this.isSubmitting) return

      // バリデーションチェック
      this.validateEmail()
      this.validateKana()
      this.validatePhone()
      this.validateDates()
      
      if (Object.values(this.errors).some(error => error !== '')) {
        return
      }

      this.isSubmitting = true
      this.apiError = ''

      try {
        // 空室確認
        const isAvailable = await this.checkAvailability()
        if (!isAvailable) {
          this.isSubmitting = false
          return
        }

        // 予約作成
        const result = await GasApiClient.createReservation(this.formData)
        
        if (result.success) {
          this.$router.push({
            name: 'Confirmation',
            params: {
              reservationId: result.reservationId,
              reservation: this.formData,
              totalPrice: this.totalPrice
            }
          })
        } else {
          throw new Error(result.message || '予約作成に失敗しました')
        }
      } catch (error) {
        console.error('予約送信エラー:', error)
        this.apiError = error.message || '予約処理中にエラーが発生しました'
        // エラーメッセージを表示
        this.$emit('show-error', this.apiError)
      } finally {
        this.isSubmitting = false
      }
    }
  },
  watch: {
    'formData.adultCount': 'calculatePrice',
    'formData.childCount': 'calculatePrice',
    'formData.checkIn': 'calculatePrice',
    'formData.checkOut': 'calculatePrice'
  }
}
</script>

<style scoped>
.reservation-form {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.required {
  color: #ff4444;
  margin-left: 0.25rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.error {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.guest-count {
  display: flex;
  gap: 1rem;
}

.guest-count > div {
  flex: 1;
}

.price-display {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.total-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .reservation-form {
    margin: 1rem;
    padding: 1rem;
  }
}

.date-selection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
</style> 