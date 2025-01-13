<template>
  <div class="date-picker">
    <div class="date-input">
      <label :for="id">{{ label }}<span v-if="required" class="required">*</span></label>
      <input
        :id="id"
        type="date"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :min="minDate"
        :max="maxDate"
        :required="required"
      />
    </div>
    <span class="error" v-if="error">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    minDate: {
      type: String,
      default() {
        return new Date().toISOString().split('T')[0];
      }
    },
    maxDate: {
      type: String,
      default() {
        const date = new Date();
        date.setMonth(date.getMonth() + 6);
        return date.toISOString().split('T')[0];
      }
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.date-picker {
  margin-bottom: 1rem;
}

.date-input {
  margin-bottom: 0.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2c3e50;
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
  color: #2c3e50;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.error {
  color: #ff4444;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  input {
    font-size: 16px; /* iOSでズームを防ぐ */
  }
}
</style> 