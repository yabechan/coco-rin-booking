<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>coco-Rin</h1>
        <p class="subtitle">自然に囲まれた心安らぐ宿泊施設</p>
        <router-link to="/reservation" class="cta-button">
          宿泊予約をする
        </router-link>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>施設のご案内</h2>
        <div class="feature-grid">
          <div class="feature-item">
            <h3>お部屋</h3>
            <p>全室から自然を望む、くつろぎの空間をご用意</p>
          </div>
          <div class="feature-item">
            <h3>お食事</h3>
            <p>地元の食材を活かした心温まる料理をご提供</p>
          </div>
          <div class="feature-item">
            <h3>周辺案内</h3>
            <p>豊かな自然に囲まれた観光スポットが充実</p>
          </div>
        </div>
      </div>
    </section>

    <section class="pricing">
      <div class="container">
        <h2>料金のご案内</h2>
        <div class="price-cards">
          <div class="price-card">
            <h3>1名様利用</h3>
            <p class="price">¥14,000</p>
            <p class="price-note">1泊2食付き</p>
          </div>
          <div class="price-card">
            <h3>2名様利用</h3>
            <p class="price">¥13,000</p>
            <p class="price-note">お一人様/1泊2食付き</p>
          </div>
          <div class="price-card">
            <h3>3名様利用</h3>
            <p class="price">¥12,000</p>
            <p class="price-note">お一人様/1泊2食付き</p>
          </div>
        </div>
        <div class="price-notes">
          <p>※小学生以下のお子様は¥6,500（食事付き）</p>
          <p>※料金は全て税込表示です</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  background-color: #f8f9fa;
}

.hero {
  height: 80vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
                    linear-gradient(45deg, #4CAF50, #45a049);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-content {
  padding: 2rem;
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #45a049;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem;
}

section h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2rem;
  color: #2c3e50;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-item {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.feature-item h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.price-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.price-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.price-card h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 0.5rem;
}

.price-note {
  color: #666;
}

.price-notes {
  text-align: center;
  color: #666;
}

.price-notes p {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 3rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .container {
    padding: 2rem 1rem;
  }
}
</style> 