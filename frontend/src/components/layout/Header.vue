<template>
  <header class="header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <h1 class="site-title">coco-Rin</h1>
      </router-link>
      <nav class="nav">
        <router-link to="/reservation" class="reservation-btn">
          宿泊予約をする
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent'
}
</script>

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.reservation-btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.reservation-btn:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
}
</style> 