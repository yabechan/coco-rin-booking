<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>coco-Rin</h3>
        <p>〒XXX-XXXX</p>
        <p>○○県○○市○○町1-2-3</p>
        <p>TEL: XXX-XXXX-XXXX</p>
        <p>Email: info@coco-rin.com</p>
      </div>

      <div class="footer-section">
        <h3>アクセス</h3>
        <p>最寄り駅：○○駅</p>
        <p>駅から送迎あり（要予約）</p>
        <p>駐車場完備</p>
      </div>

      <div class="footer-section">
        <h3>営業時間</h3>
        <p>チェックイン：15:00～21:00</p>
        <p>チェックアウト：～10:00</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2024 coco-Rin All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 3rem 0 0;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  color: #4CAF50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.footer-section p {
  margin: 0.5rem 0;
  color: #ecf0f1;
  font-size: 0.9rem;
}

.footer-bottom {
  margin-top: 3rem;
  padding: 1.5rem;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
}

.footer-bottom p {
  margin: 0;
  font-size: 0.8rem;
  color: #bdc3c7;
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 0;
    margin-top: 2rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-section {
    margin-bottom: 2rem;
  }
}
</style> 