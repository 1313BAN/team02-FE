<template>
  <div class="map-container">
    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-bar">
        <div class="location-search-group">
          <!-- 계층적 지역 검색 -->
          <div class="location-selectors">
            <select v-model="selectedSido" @change="onSidoChange" class="location-select">
              <option value="">시/도 선택</option>
              <option v-for="sido in sidoList" :key="sido.code" :value="sido.code">
                {{ sido.name }}
              </option>
            </select>
            <select
              v-model="selectedSigungu"
              @change="onSigunguChange"
              class="location-select"
              :disabled="!selectedSido"
            >
              <option value="">구/군 선택</option>
              <option v-for="sigungu in sigunguList" :key="sigungu.code" :value="sigungu.code">
                {{ sigungu.name }}
              </option>
            </select>
            <select
              v-model="selectedEupmyeondong"
              @change="onEupmyeondongChange"
              class="location-select"
              :disabled="!selectedSigungu"
            >
              <option value="">읍/면/동 선택</option>
              <option v-for="emd in eupmyeondongList" :key="emd.code" :value="emd.code">
                {{ emd.name }}
              </option>
            </select>
          </div>

          <!-- 년월 검색 -->
          <div class="date-selectors">
            <select v-model="selectedYear" class="date-select">
              <option value="">년도 선택</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}년</option>
            </select>
            <select v-model="selectedMonth" class="date-select" :disabled="!selectedYear">
              <option value="">월 선택</option>
              <option v-for="month in availableMonths" :key="month" :value="month">
                {{ month }}월
              </option>
            </select>
          </div>

          <button class="search-btn" @click="handleLocationSearch" :disabled="!canSearch">
            🔍 검색
          </button>
        </div>

        <div class="search-filters">
          <select v-model="selectedType" class="filter-select">
            <option value="">매물종류</option>
            <option value="apartment">아파트</option>
            <option value="villa">빌라/연립</option>
            <option value="oneroom">단독/다가구</option>
            <option value="officetel">오피스텔</option>
          </select>
          <select v-model="selectedDeal" class="filter-select">
            <option value="">거래종류</option>
            <option value="sale">매매</option>
            <option value="rent">전세</option>
            <option value="monthly">월세</option>
          </select>
          <button class="filter-btn" @click="toggleAdvancedFilter">
            상세조건 {{ showAdvancedFilter ? '▲' : '▼' }}
          </button>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div v-if="showAdvancedFilter" class="advanced-filters">
        <div class="filter-row">
          <div class="filter-group">
            <label>가격범위 (만원)</label>
            <div class="price-range">
              <input type="number" v-model="minPrice" placeholder="최소가격" class="price-input" />
              <span>~</span>
              <input type="number" v-model="maxPrice" placeholder="최대가격" class="price-input" />
            </div>
          </div>
          <div class="filter-group">
            <label>면적 (㎡)</label>
            <div class="area-range">
              <input type="number" v-model="minArea" placeholder="최소면적" class="area-input" />
              <span>~</span>
              <input type="number" v-model="maxArea" placeholder="최대면적" class="area-input" />
            </div>
          </div>
          <div class="filter-group">
            <label>층수</label>
            <div class="floor-range">
              <input type="number" v-model="minFloor" placeholder="최소층" class="floor-input" />
              <span>~</span>
              <input type="number" v-model="maxFloor" placeholder="최대층" class="floor-input" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- Left Panel - Property List -->
      <div class="left-panel">
        <div class="list-header">
          <h3>매물 목록 ({{ properties.length }}건)</h3>
          <div class="sort-options">
            <select v-model="sortBy" class="sort-select">
              <option value="latest">최신순</option>
              <option value="price-low">가격낮은순</option>
              <option value="price-high">가격높은순</option>
              <option value="area-large">면적넓은순</option>
            </select>
          </div>
        </div>

        <div class="search-info" v-if="currentSearchInfo">
          <div class="search-location">📍 {{ currentSearchInfo.location }}</div>
          <div class="search-period" v-if="currentSearchInfo.period">
            📅 {{ currentSearchInfo.period }}
          </div>
        </div>

        <div class="property-list" ref="propertyList">
          <div
            v-for="property in filteredProperties"
            :key="property.id"
            class="property-card"
            :class="{ active: selectedProperty?.id === property.id }"
            @click="selectProperty(property)"
          >
            <div class="property-image">
              <img :src="property.image || '/placeholder-house.jpg'" :alt="property.title" />
              <div class="property-badge">{{ property.type }}</div>
            </div>
            <div class="property-info">
              <h4 class="property-title">{{ property.title }}</h4>
              <p class="property-price">
                {{ formatPrice(property.price, property.dealType, property.deposit) }}
              </p>
              <p class="property-details">
                {{ property.area }}㎡ · {{ property.floor }}층
                <span v-if="property.rooms"> · {{ property.rooms }}방</span>
                <span v-if="property.bathrooms"> · {{ property.bathrooms }}욕실</span>
              </p>
              <p class="property-location">{{ property.address }}</p>
              <p class="property-date">거래일: {{ property.dealDate }}</p>
              <div class="property-tags" v-if="property.tags">
                <span v-for="tag in property.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="loading">
          <div class="loading-spinner"></div>
          <p>매물을 불러오는 중...</p>
        </div>

        <div v-if="!properties.length && !isLoading" class="no-results">
          <div class="no-results-icon">🏠</div>
          <p>검색된 매물이 없습니다.</p>
          <p class="no-results-sub">다른 조건으로 검색해보세요.</p>
        </div>
      </div>

      <!-- Right Panel - SGIS Map -->
      <div class="right-panel">
        <div class="map-area" ref="sgisMapContainer">
          <div class="map-placeholder" v-if="!mapInitialized">
            <div class="map-loading">
              <div class="loading-spinner"></div>
              <p>SGIS 지도를 불러오는 중...</p>
            </div>
          </div>
          <!-- SGIS Map will be rendered here -->
          <div id="sgis-map" class="sgis-map-container"></div>
        </div>

        <!-- Map Controls -->
        <div class="map-controls">
          <button class="control-btn" @click="getCurrentLocation" title="내 위치">📍</button>
          <button class="control-btn" @click="resetMapView" title="전체보기">🌍</button>
          <button class="control-btn" @click="toggleMapLayer" title="레이어 변경">🗺️</button>
          <button class="control-btn" @click="showStatistics" title="통계보기">📊</button>
        </div>

        <!-- Map Legend -->
        <div class="map-legend" v-if="showMapLegend">
          <h4>범례</h4>
          <div class="legend-item">
            <div class="legend-color" style="background: #ff6b35"></div>
            <span>매매가 상위</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #f7931e"></div>
            <span>매매가 중위</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #ffd23f"></div>
            <span>매매가 하위</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'

// Location data
const selectedSido = ref('')
const selectedSigungu = ref('')
const selectedEupmyeondong = ref('')
const selectedYear = ref('')
const selectedMonth = ref('')

// Location lists
const sidoList = await fetch('http://70.12.60.55:8080/map/dongcode/sido', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})

const sigunguList = ref([])
const eupmyeondongList = ref([])

// Date options
const currentYear = new Date().getFullYear()
const availableYears = ref(Array.from({ length: 10 }, (_, i) => currentYear - i))
const availableMonths = ref(Array.from({ length: 12 }, (_, i) => i + 1))

// Filter states
const selectedType = ref('')
const selectedDeal = ref('')
const showAdvancedFilter = ref(false)
const minPrice = ref('')
const maxPrice = ref('')
const minArea = ref('')
const maxArea = ref('')
const minFloor = ref('')
const maxFloor = ref('')
const sortBy = ref('latest')

// Map and data states
const selectedProperty = ref(null)
const isLoading = ref(false)
const mapInitialized = ref(false)
const showMapLegend = ref(true)
const sgisMapContainer = ref(null)
const propertyList = ref(null)
const currentSearchInfo = ref(null)

// Sample property data (will be replaced with real estate transaction data)
const properties = ref([])

// Computed properties
const canSearch = computed(() => {
  return selectedSido.value && selectedSigungu.value
})

const filteredProperties = computed(() => {
  let filtered = properties.value

  if (selectedType.value) {
    filtered = filtered.filter((p) => p.type === selectedType.value)
  }

  if (selectedDeal.value) {
    filtered = filtered.filter((p) => p.dealType === selectedDeal.value)
  }

  if (minPrice.value) {
    filtered = filtered.filter((p) => p.price >= parseInt(minPrice.value) * 10000)
  }

  if (maxPrice.value) {
    filtered = filtered.filter((p) => p.price <= parseInt(maxPrice.value) * 10000)
  }

  if (minArea.value) {
    filtered = filtered.filter((p) => p.area >= parseFloat(minArea.value))
  }

  if (maxArea.value) {
    filtered = filtered.filter((p) => p.area <= parseFloat(maxArea.value))
  }

  if (minFloor.value) {
    filtered = filtered.filter((p) => p.floor >= parseInt(minFloor.value))
  }

  if (maxFloor.value) {
    filtered = filtered.filter((p) => p.floor <= parseInt(maxFloor.value))
  }

  // Sort properties
  switch (sortBy.value) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'area-large':
      filtered.sort((a, b) => b.area - a.area)
      break
    default:
      // Latest by deal date
      filtered.sort((a, b) => new Date(b.dealDate) - new Date(a.dealDate))
  }

  return filtered
})

// Methods
const onSidoChange = async () => {
  selectedSigungu.value = ''
  selectedEupmyeondong.value = ''
  sigunguList.value = []
  eupmyeondongList.value = []

  if (selectedSido.value) {
    await fetchSigunguList(selectedSido.value)
  }
}

const onSigunguChange = async () => {
  selectedEupmyeondong.value = ''
  eupmyeondongList.value = []

  if (selectedSigungu.value) {
    await fetchEupmyeondongList(selectedSido.value, selectedSigungu.value)
  }
}

const onEupmyeondongChange = () => {
  // Optional: Auto search when emd selected
  if (selectedEupmyeondong.value) {
    handleLocationSearch()
  }
}

const fetchSigunguList = async (sidoCode) => {
  try {
    const response = await fetch(`/api/location/sigungu?sido=${sidoCode}`)
    const data = await response.json()
    sigunguList.value = data.sigunguList || []
  } catch (error) {
    console.error('Failed to fetch sigungu list:', error)
  }
}

const fetchEupmyeondongList = async (sidoCode, sigunguCode) => {
  try {
    const response = await fetch(
      `/api/location/eupmyeondong?sido=${sidoCode}&sigungu=${sigunguCode}`,
    )
    const data = await response.json()
    eupmyeondongList.value = data.eupmyeondongList || []
  } catch (error) {
    console.error('Failed to fetch eupmyeondong list:', error)
  }
}

const handleLocationSearch = async () => {
  if (!canSearch.value) return

  isLoading.value = true
  try {
    const searchParams = {
      sido: selectedSido.value,
      sigungu: selectedSigungu.value,
      eupmyeondong: selectedEupmyeondong.value,
      year: selectedYear.value,
      month: selectedMonth.value,
      type: selectedType.value,
      dealType: selectedDeal.value,
    }

    // Update search info
    updateSearchInfo()

    // Call backend API for real estate transaction data
    const response = await fetch('/api/realestate/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    })

    const data = await response.json()
    properties.value = data.properties || []

    // Update SGIS map with search results
    await updateSgisMap(searchParams)
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isLoading.value = false
  }
}

const updateSearchInfo = () => {
  const sidoName = sidoList.value.find((s) => s.code === selectedSido.value)?.name || ''
  const sigunguName = sigunguList.value.find((s) => s.code === selectedSigungu.value)?.name || ''
  const emdName =
    eupmyeondongList.value.find((e) => e.code === selectedEupmyeondong.value)?.name || ''

  let location = sidoName
  if (sigunguName) location += ` ${sigunguName}`
  if (emdName) location += ` ${emdName}`

  let period = ''
  if (selectedYear.value) {
    period = `${selectedYear.value}년`
    if (selectedMonth.value) {
      period += ` ${selectedMonth.value}월`
    }
  }

  currentSearchInfo.value = {
    location,
    period,
  }
}

const toggleAdvancedFilter = () => {
  showAdvancedFilter.value = !showAdvancedFilter.value
}

const selectProperty = (property) => {
  selectedProperty.value = property
  // Center SGIS map on selected property
  centerSgisMapOnProperty(property)
}

const centerSgisMapOnProperty = (property) => {
  // SGIS map centering logic
  if (window.sgisMap && property.lat && property.lng) {
    window.sgisMap.setCenter(property.lat, property.lng)
    window.sgisMap.setZoom(16)
  }
}

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      if (window.sgisMap) {
        window.sgisMap.setCenter(lat, lng)
        window.sgisMap.setZoom(15)
      }
    })
  }
}

const resetMapView = () => {
  if (window.sgisMap && currentSearchInfo.value) {
    // Reset map to show current search area
    window.sgisMap.fitBounds()
  }
}

const toggleMapLayer = () => {
  // Toggle between different SGIS map layers
  if (window.sgisMap) {
    window.sgisMap.toggleLayer()
  }
}

const showStatistics = () => {
  // Show area statistics overlay
  showMapLegend.value = !showMapLegend.value
}

const formatPrice = (price, dealType, deposit = null) => {
  const formatMoney = (amount) => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}억`
    } else if (amount >= 10000) {
      return `${Math.floor(amount / 10000)}만`
    } else {
      return `${amount}만`
    }
  }

  if (dealType === 'monthly') {
    const depositStr = deposit ? `(${formatMoney(deposit)})` : ''
    return `월세 ${depositStr} ${formatMoney(price)}`
  } else if (dealType === 'rent') {
    return `전세 ${formatMoney(price)}`
  } else {
    return `매매 ${formatMoney(price)}`
  }
}

const initializeSgisMap = async () => {
  try {
    // Initialize SGIS Map API
    const response = await fetch(
      'https://sgisapi.kostat.go.kr/OpenAPI3/auth/javascriptAuth?consumer_key=1cf2dad894ad48d79456',
    )
    const config = await response.json()

    // Load SGIS Map API script
    await loadSgisMapAPI(config.apiKey)

    // Create SGIS Map instance
    window.sgisMap = new window.SGIS.Map('sgis-map', {
      center: [37.5665, 127.0074], // Seoul
      zoom: 11,
      maxZoom: 18,
      minZoom: 6,
    })

    mapInitialized.value = true
    console.log('SGIS Map initialized successfully')
  } catch (error) {
    console.error('Failed to initialize SGIS map:', error)
  }
}

const loadSgisMapAPI = async (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.SGIS) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://sgisapi.kostat.go.kr/OpenAPI3/js/sgisapi.js?key=${apiKey}`
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const updateSgisMap = async (searchParams) => {
  if (!window.sgisMap) return

  try {
    // Update map with search results and statistical overlays
    const response = await fetch('/api/sgis/updateMap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    })

    const mapData = await response.json()

    // Update map layers with transaction density, price statistics, etc.
    window.sgisMap.updateLayers(mapData)
  } catch (error) {
    console.error('Failed to update SGIS map:', error)
  }
}

// Lifecycle
onMounted(() => {
  nextTick(() => {
    initializeSgisMap()
  })
})

// Watchers
watch(
  [selectedType, selectedDeal, minPrice, maxPrice, minArea, maxArea, minFloor, maxFloor],
  () => {
    // Auto-filter when filter values change
  },
  { deep: true },
)
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Noto Sans KR', Arial, sans-serif;
}

/* Search Section */
.search-section {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd23f 100%);
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.search-bar {
  max-width: 1200px;
  margin: 0 auto;
}

.location-search-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.location-selectors {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.location-select {
  min-width: 120px;
  padding: 0.75rem 1rem;
  border: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.location-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.location-select:focus {
  border-color: white;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.date-selectors {
  display: flex;
  gap: 0.5rem;
}

.date-select {
  min-width: 100px;
  padding: 0.75rem 1rem;
  border: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.date-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-btn {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #ffd23f 0%, #fff 50%, #ffd23f 100%);
  border: 3px solid white;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.search-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select,
.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:hover,
.filter-btn:hover {
  background: white;
  border-color: white;
}

/* Advanced Filters */
.advanced-filters {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.filter-row {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.price-range,
.area-range,
.floor-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input,
.area-input,
.floor-input {
  width: 100px;
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}

/* Main Content */
.main-content {
  display: flex;
  flex: 1;
  height: calc(100vh - 220px);
}

/* Left Panel */
.left-panel {
  width: 400px;
  background: white;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 210, 63, 0.1) 100%);
}

.list-header h3 {
  color: #ff6b35;
  font-weight: bold;
  margin: 0;
}

.sort-select {
  padding: 0.5rem;
  border: 2px solid #ff6b35;
  border-radius: 8px;
  color: #ff6b35;
  font-weight: 500;
}

.search-info {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(255, 210, 63, 0.1) 0%, rgba(247, 147, 30, 0.1) 100%);
  border-bottom: 1px solid #eee;
}

.search-location {
  font-weight: bold;
  color: #ff6b35;
  margin-bottom: 0.25rem;
}

.search-period {
  font-size: 0.9rem;
  color: #666;
}

/* Property List */
.property-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.property-card {
  display: flex;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 15px;
  margin-bottom: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.property-card:hover {
  border-color: #ff6b35;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.15);
}

.property-card.active {
  border-color: #ff6b35;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 210, 63, 0.05) 100%);
}

.property-image {
  width: 120px;
  height: 120px;
  position: relative;
  overflow: hidden;
}

.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.property-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ff6b35;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
}

.property-info {
  flex: 1;
  padding: 1rem;
}

.property-title {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.property-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #ff6b35;
  margin: 0 0 0.5rem 0;
}

.property-details,
.property-location,
.property-date {
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 0.25rem 0;
}

.property-date {
  color: #999;
  font-size: 0.8rem;
}

.property-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.tag {
  background: linear-gradient(135deg, #ffd23f 0%, #f7931e 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
}

/* Right Panel */
.right-panel {
  flex: 1;
  position: relative;
  background: #f8f9fa;
}

.map-area {
  width: 100%;
  height: 100%;
  position: relative;
}

.sgis-map-container {
  width: 100%;
  height: 100%;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.map-loading {
  text-align: center;
  color: #666;
}

/* Map Controls */
.map-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
}

.control-btn {
  width: 50px;
  height: 50px;
  background: white;
  border: 2px solid #ff6b35;
  border-radius: 50%;
  color: #ff6b35;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: #ff6b35;
  color: white;
  transform: scale(1.1);
}

/* Map Legend */
.map-legend {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.map-legend h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 0.9rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.legend-item span {
  font-size: 0.8rem;
  color: #666;
}

/* Loading and No Results */
.loading,
.no-results {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-results-sub {
  font-size: 0.9rem;
  color: #999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #ff6b35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .location-search-group {
    flex-direction: column;
    align-items: stretch;
  }

  .location-selectors,
  .date-selectors {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    height: 50%;
  }

  .right-panel {
    height: 50%;
  }

  .search-filters {
    flex-wrap: wrap;
  }

  .filter-row {
    flex-direction: column;
    gap: 1rem;
  }

  .map-controls {
    flex-direction: row;
    top: auto;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    justify-content: center;
  }

  .map-legend {
    display: none;
  }
}

@media (max-width: 640px) {
  .location-selectors {
    flex-direction: column;
  }

  .location-select,
  .date-select {
    min-width: auto;
  }

  .search-section {
    padding: 1rem;
  }
}
</style>
