<template>
  <div class="user-detail">
    <h2>{{ userName }}님의 정보</h2>
    <p>아이디: {{ userId }}</p>
    <button @click="goToEdit">정보 수정</button>
  </div>
</template>

<script setup>
const props = defineProps({
  userId: String,
  userName: String,
})

function goToEdit() {
  console.log('수정 페이지 이동')
}
</script>
