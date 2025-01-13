<template>
  <div class="confirmation">
    <div class="container">
      <div class="confirmation-card">
        <div class="status-banner success">
          <h1>ご予約ありがとうございます</h1>
          <p>予約が完了しました</p>
        </div>

        <div class="confirmation-details">
          <div class="section">
            <h2>予約番号</h2>
            <p class="reservation-id">{{ reservationId }}</p>
          </div>

          <div class="section">
            <h2>ご予約内容</h2>
            <dl>
              <dt>チェックイン</dt>
              <dd>{{ formatDate(reservation.checkIn) }}</dd>
              
              <dt>チェックアウト</dt>
              <dd>{{ formatDate(reservation.checkOut) }}</dd>
              
              <dt>宿泊人数</dt>
              <dd>
                大人{{ reservation.adultCount }}名
                <template v-if="reservation.childCount > 0">
                  、お子様{{ reservation.childCount }}名
                </template>
              </dd>
              
              <dt>合計金額</dt>
              <dd>¥{{ formatPrice(totalPrice) }}</dd>
            </dl>
          </div>

          <div class="section">
            <h2>ご予約者情報</h2>
            <dl>
              <dt>お名前</dt>
              <dd>{{ reservation.name }} 様</dd>
              
              <dt>ふりがな</dt>
              <dd>{{ reservation.nameKana }}</dd>
              
              <dt>メールアドレス</dt>
              <dd>{{ reservation.email }}</dd>
              
              <dt>電話番号</dt>
              <dd>{{ reservation.phone }}</dd>
            </dl>
          </div>

          <div class="section notice">
            <h2>ご案内</h2>
            <ul>
              <li>予約確認メールをお送りしましたので、ご確認ください。</li>
              <li>チェックイン時間は15:00～21:00です。</li>
              <li>チェックアウト時間は10:00までです。</li>
              <li>キャンセルをご希望の場合は、お電話にてご連絡ください。</li>
            </ul>
          </div>
        </div>

        <div class="actions">
          <router-link to="/" class="btn-home">
            トップページへ戻る
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Confirmation',
  data() {
    return {
      reservationId: 'R123456789',  // 実際には予約時に生成された番号を使用
      reservation: {
        checkIn: new Date(),
        checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000),
        adultCount: 2,
        childCount: 1,
        name: '山田 太郎',
        nameKana: 'やまだ たろう',
        email: 'yamada@example.com',
        phone: '090-1234-5678'
      },
      totalPrice: 32500  // 実際には予約データから計算
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    },
    formatPrice(price) {
      return price.toLocaleString()
    }
  }
}
</script>

<style scoped>
.confirmation {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.confirmation-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.status-banner {
  padding: 2rem;
  text-align: center;
  color: white;
}

.status-banner.success {
  background-color: #4CAF50;
}

.status-banner h1 {
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.confirmation-details {
  padding: 2rem;
}

.section {
  margin-bottom: 2rem;
}

.section:last-child {
  margin-bottom: 0;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.reservation-id {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
}

dl {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
}

dt {
  color: #666;
  font-weight: bold;
}

dd {
  margin: 0;
}

.notice ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice li {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.notice li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #4CAF50;
}

.actions {
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
}

.btn-home {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn-home:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .confirmation {
    padding: 1rem 0;
  }
  
  dl {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  dt {
    margin-top: 1rem;
  }
  
  .status-banner h1 {
    font-size: 1.5rem;
  }
}
</style> 