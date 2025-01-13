<template>
  <div class="reservation-page">
    <ErrorMessage
      :message="errorMessage"
      :type="errorType"
      @close="clearError"
    />
    <ReservationForm @show-error="showError" />
  </div>
</template>

<script>
import ReservationForm from '@/components/reservation/ReservationForm.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

export default {
  name: 'Reservation',
  components: {
    ReservationForm,
    ErrorMessage
  },
  data() {
    return {
      errorMessage: '',
      errorType: 'error'
    }
  },
  methods: {
    showError(message, type = 'error') {
      this.errorMessage = message
      this.errorType = type
      
      // 5秒後に自動的にエラーメッセージを消す
      setTimeout(this.clearError, 5000)
    },
    clearError() {
      this.errorMessage = ''
    }
  }
}
</script>

<style scoped>
.reservation-page {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px); /* ヘッダーの高さを引く */
}
</style> 