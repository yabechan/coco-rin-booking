<template>
  <div class="reservation-complete">
    <div class="complete-content">
      <div class="complete-header">
        <div class="check-icon">✓</div>
        <h2>ご予約ありがとうございます</h2>
        <p class="reservation-number">予約番号：{{ reservationNumber }}</p>
      </div>

      <div class="message-section">
        <p>ご予約内容の確認メールをお送りしましたので、ご確認ください。</p>
        <p>
          メールが届かない場合は、お手数ですが
          <a href="mailto:info@coco-rin.com">info@coco-rin.com</a>
          までお問い合わせください。
        </p>
      </div>

      <div class="reservation-summary">
        <h3>ご予約内容</h3>
        <div class="summary-item">
          <span class="label">チェックイン</span>
          <span class="value">{{ formatDate(reservation.checkIn) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">チェックアウト</span>
          <span class="value">{{ formatDate(reservation.checkOut) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">宿泊人数</span>
          <span class="value">
            大人{{ reservation.adultCount }}名
            <template v-if="reservation.childCount > 0">
              、お子様{{ reservation.childCount }}名
            </template>
          </span>
        </div>
        <div class="summary-item">
          <span class="label">合計金額</span>
          <span class="value price">¥{{ formatPrice(totalPrice) }}</span>
        </div>
      </div>

      <div class="notes-section">
        <h3>ご案内</h3>
        <ul>
          <li>チェックイン時間：{{ reservation.checkInTime }}</li>
          <template v-if="reservation.transportation === 'train' && reservation.needPickup">
            <li>最寄り駅からの送迎をご用意いたします。</li>
          </template>
          <template v-if="reservation.childCount > 0">
            <li>お子様の料金は現地にてご精算ください。</li>
          </template>
          <li>ご不明な点がございましたら、お気軽にお問い合わせください。</li>
        </ul>
      </div>

      <div class="button-group">
        <button class="home-button" @click="goToHome">
          トップページへ戻る
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReservationComplete',
  props: {
    reservation: {
      type: Object,
      required: true
    },
    reservationNumber: {
      type: String,
      required: true
    }
  },
  computed: {
    totalPrice() {
      const prices = {
        1: 14000,
        2: 13000,
        3: 12000
      }
      const basePrice = prices[this.reservation.adultCount] || prices[1]
      const checkIn = new Date(this.reservation.checkIn)
      const checkOut = new Date(this.reservation.checkOut)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      return basePrice * this.reservation.adultCount * nights
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekDay = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
      return `${year}年${month}月${day}日（${weekDay}）`
    },
    formatPrice(price) {
      return price.toLocaleString()
    },
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.reservation-complete {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.complete-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.complete-header {
  text-align: center;
  margin-bottom: 2rem;
}

.check-icon {
  width: 60px;
  height: 60px;
  background-color: #2ecc71;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
}

.reservation-number {
  color: #666;
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

.message-section {
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.message-section a {
  color: #3498db;
  text-decoration: none;
}

.message-section a:hover {
  text-decoration: underline;
}

.reservation-summary {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 4px;
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #dee2e6;
}

.summary-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
}

.value {
  font-weight: 500;
}

.value.price {
  color: #e74c3c;
  font-size: 1.2rem;
}

.notes-section {
  margin-bottom: 2rem;
}

.notes-section ul {
  list-style: none;
  padding: 0;
}

.notes-section li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.notes-section li::before {
  content: "•";
  position: absolute;
  left: 0.5rem;
  color: #3498db;
}

.button-group {
  text-align: center;
  margin-top: 3rem;
}

.home-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #2980b9;
}

h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0;
}

h3 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .reservation-complete {
    padding: 1rem;
  }

  .complete-content {
    padding: 1.5rem;
  }

  .summary-item {
    flex-direction: column;
    gap: 0.25rem;
  }

  .value.price {
    text-align: right;
  }
}
</style> 