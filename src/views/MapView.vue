<template>
  <div id="section-container">
      <section>
        <header>
          <div class="filter-container">
            <select v-model="selectedSido" @change="fetchGungu" class="filter-select">
              <option value="" selected disabled>시도</option>
              <option v-for="sido in sidoList" :key="sido.code" :value="sido.code">
                {{ sido.name }}
              </option>
            </select>
            <select v-model="selectedGungu" @change="fetchDong" class="filter-select">
              <option value="">군/구</option>
              <option v-for="gungu in gunguList" :key="gungu.code" :value="gungu.code">
                {{ gungu.name }}
              </option>
            </select>
            <select v-model="selectedDong" class="filter-select">
              <option value="">동</option>
              <option v-for="dong in dongList" :key="dong.code" :value="dong.code">
                {{ dong.name }}
              </option>
            </select>
            <input type="month" v-model="dealYmd" />
            <button @click="searchApartments">검색</button>
          </div>
        </header>

        <main class="container">
          <div class="left-panel">
            <h2>매물</h2>
            <ul id="apartment-list">
              <li v-if="apartments.length === 0">
                <h3>매물 정보가 보고싶다면 검색을 해주세요!</h3>
              </li>
              <li v-for="(apt, index) in apartments" :key="index">
                <h3>{{ apt.name }}</h3>
                <p>{{ apt.address }}</p>
              </li>
            </ul>
          </div>
          <div class="right-panel">
            <div id="map" style="width: 100%; height: 100%;"></div>
          </div>
        </main>
      </section>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
const selectedSido = ref("");
const sidoList = ref([]);
const selectedGungu = ref("");
const gunguList = ref([]);
const selectedDong = ref("");
const dongList = ref([]);
const dealYmd = ref("");
const apartments = ref([]);

let map = null;

const accessToken = ref('');
const markers = [];
const bounds = [];

// Access Token 받아오기
const getAccessToken = async () => {
  const res = await fetch('https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      consumer_key: '1cf2dad894ad48d79456',
      consumer_secret: '8d956a4da0c24e8bb8ec'
    })
  });
  const json = await res.json();
  accessToken.value = json.result.accessToken;
};

// 주소를 좌표로 변환
const getCoords = async (address) => {
  const res = await fetch('https://sgisapi.kostat.go.kr/OpenAPI3/addr/geocode.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accessToken: accessToken.value,
      address: address,
      resultcount: 1
    })
  });
  const json = await res.json();

  // 만료된 토큰이면 갱신 후 재시도
  if (json.errCd === -401) {
    await getAccessToken();
    return await getCoords(address);
  }

  return json.result.resultdata[0]; // { x, y } 반환됨
};

// 마커 초기화
const resetMarkers = () => {
  markers.forEach(marker => marker.remove());
  bounds.length = 0;
};

// 지도에 마커 업데이트
const updateMap = async (infos) => {
  resetMarkers();
  for (const info of infos) {
    const marker = sop.marker([info.utmk.x, info.utmk.y]).addTo(map);
    marker.bindInfoWindow(info.label);
    markers.push(marker);
    bounds.push([info.utmk.x, info.utmk.y]);
  }

  if (bounds.length > 1) {
    map.setView(map._getBoundsCenterZoom(bounds).center, map._getBoundsCenterZoom(bounds).zoom);
  } else if (bounds.length === 1) {
    map.setView(bounds[0], 13);
  }
};

// 처음 한 번만 실행 (지도 초기화)
onMounted(async () => {
  await getAccessToken();

  map = sop.map('map');
  const exampleAddress = '서울특별시 강남구 테헤란로 212';
  const coord = await getCoords(exampleAddress);

  updateMap([
    {
      address: exampleAddress,
      utmk: coord,
      label: '멀티캠퍼스'
    }
  ]);
});
</script>

<style scoped>
.filter-container {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.filter-select {
    padding: 5px;
}

button {
    padding: 5px 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.container {
    /* display: flex;
    justify-content: space-between; */
    margin-top: 20px;
    padding: 20px;
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    height: 100vh;
}

.left-panel {
    width: 401px;
}

.right-panel {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
    z-index: 0;
}

.left-panel {
    border-right: 2px solid #ddd;
}

#apartment-list {
    max-height: 100%;
    overflow-y: auto;
    list-style-type: none;
    padding: 0;
    flex-grow: 1;
    position: relative;
}

.apart_image {
    width: 140px;
    height: 140px;
    position: relative;
    z-index: 2;
}

.apart_info {
    display: flex;
    flex-direction: column;
}

#apartment-list li {
    border-bottom: 1px solid #ddd;
    display: grid;
    grid-template-columns: 140px minmax(0px, 1fr);
    column-gap: 20px;
    padding: 16px;
    background-color: rgb(255, 255, 255);
    position: relative;
    transition: background-color 300mscubic-bezier(0.5, 1, 0.89, 1);
    user-select: none;
    cursor: pointer;
    z-index: 0;
}

#map {
    width: 100%;
    height: 100%;
}
</style>
