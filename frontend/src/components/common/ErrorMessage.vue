<template>
  <transition name="fade">
    <div v-if="message" class="error-message" :class="type">
      <div class="error-content">
        <span class="error-icon">!</span>
        <p>{{ message }}</p>
      </div>
      <button class="close-button" @click="$emit('close')">&times;</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'error',
      validator: value => ['error', 'warning', 'info'].includes(value)
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.error-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
  min-width: 300px;
  max-width: 500px;
}

.error-message.error {
  border-left: 4px solid #ff4444;
}

.error-message.warning {
  border-left: 4px solid #ffbb33;
}

.error-message.info {
  border-left: 4px solid #33b5e5;
}

.error-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.error-message.warning .error-icon {
  background-color: #ffbb33;
}

.error-message.info .error-icon {
  background-color: #33b5e5;
}

.error-message p {
  margin: 0;
  color: #333;
  font-size: 0.9rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.close-button:hover {
  color: #333;
}

/* アニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 768px) {
  .error-message {
    top: auto;
    bottom: 20px;
    left: 20px;
    right: 20px;
    min-width: auto;
  }
}
</style> 