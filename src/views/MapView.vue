<template>
  <div class="map-page">
    <h2>지도 페이지</h2>
    <div id="map"></div>
  </div>
</template>

<script setup>
onMounted(() => {
  // 예: 카카오 지도 API 호출 등
  console.log('지도 로딩')
})
</script>

<style scoped>
#map {
  width: 100%;
  height: 400px;
}
</style>
