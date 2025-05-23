<template>
  <div class="error-page">
    <h2>오류가 발생했습니다.</h2>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: '알 수 없는 오류입니다.',
  },
})
</script>
