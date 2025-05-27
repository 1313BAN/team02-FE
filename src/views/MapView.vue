<template>
  <div class="map-container">
    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-bar">
        <!-- Search Mode Toggle - AI 검색 완료시 숨김 -->
        <div class="search-mode-toggle" v-if="!aiSearchCompleted">
          <button
            class="toggle-btn"
            :class="{ active: !isAiSearchMode }"
            @click="toggleSearchMode(false)"
          >
            🔍 일반 검색
          </button>
          <button
            class="toggle-btn"
            :class="{ active: isAiSearchMode }"
            @click="toggleSearchMode(true)"
          >
            🤖 AI 추천 검색
          </button>
        </div>

        <!-- AI 검색 결과 표시 영역 - 새로 추가 -->
        <div v-if="aiSearchCompleted" class="ai-results-section">
          <div class="ai-results-header">
            <h3>🤖 AI 추천 검색 결과</h3>
            <button class="new-search-btn" @click="resetAiSearch">🔄 새로 검색</button>
          </div>

          <div class="ai-results-summary">
            <div class="search-summary-info">
              <span class="summary-item"
                >💰 예산: {{ aiSearchData.minBudget }}만원 ~ {{ aiSearchData.maxBudget }}만원</span
              >
              <span class="summary-item">🏠 타입: {{ aiSearchData.houseType }}</span>
              <span class="summary-item">👤 {{ aiSearchData.age }}세 {{ aiSearchData.job }}</span>
              <span class="summary-item">🚇 {{ aiSearchData.transport }}</span>
            </div>
          </div>

          <div class="ai-results-grid">
            <div
              v-for="(result, index) in aiSearchResults"
              :key="index"
              class="ai-result-card"
              @click="selectAiResult(result)"
            >
              <div class="ai-result-header">
                <div class="ai-result-rank">{{ index + 1 }}위</div>
                <div class="ai-result-score">{{ result.score }}점</div>
              </div>
              <div class="ai-result-content">
                <div class="ai-result-title">
                  {{ result.sido }} {{ result.gungu }} {{ result.dong }}
                </div>
                <div class="ai-result-tags">
                  <span class="ai-tag" v-for="tag in result.tags" :key="tag">{{ tag }}</span>
                </div>
                <p class="ai-result-reason">{{ result.reason }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isAiSearchMode && !aiSearchCompleted" class="location-search-group">
          <!-- 계층적 지역 검색 -->
          <div class="location-selectors">
            <select v-model="selectedSido" @change="onSidoChange" class="location-select">
              <option value="">시/도 선택</option>
              <option v-for="sido in sidoList">
                {{ sido }}
              </option>
            </select>
            <select
              v-model="selectedGungu"
              @change="onGunguChange"
              class="location-select"
              :disabled="!selectedSido"
            >
              <option value="">구/군 선택</option>
              <option v-for="gungu in gunguList">
                {{ gungu }}
              </option>
            </select>
            <select v-model="selectedDong" class="location-select" :disabled="!selectedGungu">
              <option value="">읍/면/동 선택</option>
              <option v-for="dong in dongList">
                {{ dong }}
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

          <button class="search-btn" @click="locationSearch" :disabled="!canSearch">🔍 검색</button>
        </div>

        <!-- AI 검색 UI -->
        <div v-if="isAiSearchMode && !aiSearchCompleted" class="ai-search-group">
          <div class="ai-search-row">
            <!-- 가격 범위 -->
            <div class="ai-input-group">
              <label class="ai-label">예산 (만원)</label>
              <div class="price-range-group">
                <input
                  type="number"
                  v-model="aiSearchData.minBudget"
                  placeholder="최소"
                  class="ai-input small"
                />
                <span class="range-divider">~</span>
                <input
                  type="number"
                  v-model="aiSearchData.maxBudget"
                  placeholder="최대"
                  class="ai-input small"
                />
              </div>
            </div>

            <!-- 집 타입 -->
            <div class="ai-input-group">
              <label class="ai-label">집 타입</label>
              <select v-model="aiSearchData.houseType" class="ai-input">
                <option value="">선택하세요</option>
                <option value="원룸">원룸</option>
                <option value="투룸">투룸</option>
                <option value="쓰리룸">쓰리룸</option>
                <option value="오피스텔">오피스텔</option>
                <option value="아파트">아파트</option>
              </select>
            </div>

            <!-- 나이 -->
            <div class="ai-input-group">
              <label class="ai-label">나이</label>
              <input
                type="number"
                v-model="aiSearchData.age"
                placeholder="나이를 입력하세요"
                class="ai-input"
              />
            </div>
          </div>

          <div class="ai-search-row">
            <!-- 직업 -->
            <div class="ai-input-group">
              <label class="ai-label">직업</label>
              <input
                type="text"
                v-model="aiSearchData.job"
                placeholder="예: 개발자, 디자이너"
                class="ai-input"
              />
            </div>

            <!-- 교통수단 -->
            <div class="ai-input-group">
              <label class="ai-label">주 교통수단</label>
              <select v-model="aiSearchData.transport" class="ai-input">
                <option value="">선택하세요</option>
                <option value="지하철">지하철</option>
                <option value="버스">버스</option>
                <option value="자차">자차</option>
                <option value="도보">도보</option>
                <option value="자전거">자전거</option>
              </select>
            </div>

            <!-- 가족 구성원 -->
            <div class="ai-input-group">
              <label class="ai-label">가족 구성</label>
              <select v-model="aiSearchData.familySize" class="ai-input">
                <option value="">선택하세요</option>
                <option value="1인가구">1인가구</option>
                <option value="2인가구">2인가구</option>
                <option value="3인가구">3인가구</option>
                <option value="4인 이상">4인 이상</option>
              </select>
            </div>
          </div>

          <div class="ai-search-row">
            <!-- 생활습관 -->
            <div class="ai-input-group full-width">
              <label class="ai-label">생활습관</label>
              <textarea
                v-model="aiSearchData.lifestyle"
                placeholder="예: 집순이 성격, 카페에서 작업하는 것을 좋아함"
                class="ai-textarea"
                rows="2"
              ></textarea>
            </div>
          </div>

          <div class="ai-search-row">
            <!-- 원하는 동네 분위기 -->
            <div class="ai-input-group full-width">
              <label class="ai-label">원하는 동네 분위기</label>
              <textarea
                v-model="aiSearchData.neighborhoodMood"
                placeholder="예: 한적한 분위기, 젊은 사람들이 많은 활기찬 동네"
                class="ai-textarea"
                rows="2"
              ></textarea>
            </div>
          </div>

          <button
            class="ai-search-btn"
            @click="handleAiSearch"
            :disabled="!canAiSearch || isLoading"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'AI 분석 중...' : '🤖 AI 추천 받기' }}
          </button>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- Left Panel - Property List -->
      <div class="left-panel">
        <div class="list-header">
          <h3>매물 목록 ({{ properties.length }}건)</h3>
        </div>

        <div class="search-info" v-if="currentSearchInfo">
          <div class="search-location">📍 {{ currentSearchInfo.location }}</div>
          <div class="search-period" v-if="currentSearchInfo.period">
            📅 {{ currentSearchInfo.period }}
          </div>
        </div>

        <div v-if="!properties.length && !isLoading" class="no-results">
          <div class="no-results-icon">🏠</div>
          <p>검색된 매물이 없습니다.</p>
          <p class="no-results-sub">다른 조건으로 검색해보세요.</p>
        </div>

        <div v-if="isLoading" class="loading">
          <div class="loading-spinner"></div>
          <p>매물을 불러오는 중...</p>
        </div>

        <div class="property-list" ref="propertyList">
          <div
            v-for="property in properties"
            :key="property.id"
            class="property-card"
            :class="{ active: selectedProperty?.id === property.id }"
            @click="selectProperty(property)"
          >
            <div class="property-image">
              <img :src="property.image || '/img/apart.png'" :alt="property.title" />
              <div class="property-badge">아파트</div>
            </div>
            <div class="property-info">
              <h4 class="property-title">{{ property.label }}</h4>
              <p class="property-location">{{ property.address }}</p>
            </div>
            <!-- 찜 하트 버튼 추가 -->
            <button
              class="favorite-btn"
              :class="{ active: property.isLike }"
              @click.stop="toggleFavorite(property)"
              :disabled="property.isToggling"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                :class="{ filled: property.isLike, beating: property.isToggling }"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Deal Details Section -->
      <div class="deal-section" v-if="selectedProperty">
        <div class="deal-header">
          <div class="deal-title">
            <h3>{{ selectedProperty.label }} 거래내역</h3>
            <div class="deal-count">{{ deals.length }}건</div>
          </div>

          <div class="sort-options">
            <select v-model="sortBy" class="sort-select">
              <option value="latest">최신순</option>
              <option value="price-low">가격 낮은순</option>
              <option value="price-high">가격 높은순</option>
              <option value="area-large">면적 넓은순</option>
              <option value="area-small">면적 작은순</option>
            </select>
          </div>
        </div>

        <div v-if="isLoadingDeals" class="loading">
          <div class="loading-spinner"></div>
          <p>거래내역을 불러오는 중...</p>
        </div>

        <div v-else-if="!deals.length" class="no-results">
          <div class="no-results-icon">📊</div>
          <p>해당 기간 거래내역이 없습니다.</p>
        </div>

        <div v-else class="deal-list">
          <div
            v-for="deal in filteredDeals"
            :key="`${deal.aptSeq}-${deal.dealDate}-${deal.dealAmount}`"
            class="deal-card"
          >
            <div class="deal-info">
              <div class="deal-main">
                <span class="deal-type">{{ deal.type }}</span>
                <span class="deal-price">{{ formatPrice(deal.amount) }}</span>
              </div>
              <div class="deal-details">
                <span class="deal-area">{{ deal.area }}㎡</span>
                <span class="deal-floor">{{ deal.floor }}층</span>
                <span class="deal-date">{{ deal.date }}</span>
              </div>
              <div class="deal-address">{{ selectedProperty.address }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - SGIS Map -->
      <div class="right-panel">
        <div class="map-area" ref="sgisMapContainer">
          <div class="map-placeholder" v-if="!mapInitialized">
            <div class="map-loading">
              <div class="loading-spinner"></div>
              <p>지도를 불러오는 중...</p>
            </div>
          </div>
          <!-- SGIS Map will be rendered here -->
          <div id="sgis-map" class="sgis-map-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import api from '@/api/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()

// Location data
const selectedSido = ref('')
const selectedGungu = ref('')
const selectedDong = ref('')
const selectedYear = ref('')
const selectedMonth = ref('')

// Location lists
const sidoList = ref([])
const gunguList = ref([])
const dongList = ref([])

// Date options
const currentYear = new Date().getFullYear()
const availableYears = ref(Array.from({ length: 10 }, (_, i) => currentYear - i))
const availableMonths = ref(Array.from({ length: 12 }, (_, i) => i + 1))

const markers = []
const bounds = []

// Filter states
const sortBy = ref('latest')

// Map and data states
const selectedProperty = ref(null)
const isLoading = ref(false)
const isLoadingDeals = ref(false)
const mapInitialized = ref(false)
const sgisMapContainer = ref(null)
const propertyList = ref(null)
const currentSearchInfo = ref(null)

// AI Search states - 업데이트
const isAiSearchMode = ref(false)
const aiSearchCompleted = ref(false)
const aiSearchResults = ref([])
const aiSearchData = reactive({
  minBudget: '',
  maxBudget: '',
  houseType: '',
  age: '',
  job: '',
  lifestyle: '',
  transport: '',
  familySize: '',
  neighborhoodMood: '',
})

// Sample property data (will be replaced with real estate transaction data)
const properties = ref([])
const deals = ref([])

// Computed properties
const canSearch = computed(() => {
  return (
    selectedSido.value &&
    selectedGungu.value &&
    selectedDong.value &&
    selectedYear.value &&
    selectedMonth.value
  )
})

const canAiSearch = computed(() => {
  return (
    aiSearchData.minBudget &&
    aiSearchData.maxBudget &&
    aiSearchData.houseType &&
    aiSearchData.age &&
    aiSearchData.job &&
    aiSearchData.lifestyle &&
    aiSearchData.transport &&
    aiSearchData.familySize &&
    aiSearchData.neighborhoodMood
  )
})

const filteredDeals = computed(() => {
  let filtered = deals.value

  // Sort properties
  switch (sortBy.value) {
    case 'price-low':
      filtered.sort(
        (a, b) =>
          parseInt(a.amount.replace(/,/g, ''), 10) - parseInt(b.amount.replace(/,/g, ''), 10),
      )
      break
    case 'price-high':
      filtered.sort(
        (a, b) =>
          parseInt(b.amount.replace(/,/g, ''), 10) - parseInt(a.amount.replace(/,/g, ''), 10),
      )
      break
    case 'area-small':
      filtered.sort((a, b) => a.area - b.area)
      break
    case 'area-large':
      filtered.sort((a, b) => b.area - a.area)
      break
    default:
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  return filtered
})

// 시도 선택 감지
const onSidoChange = async () => {
  selectedGungu.value = ''
  selectedDong.value = ''
  gunguList.value = []
  dongList.value = []

  if (selectedSido.value) {
    await fetchGunguList(selectedSido.value)
  }
}

// 구군 선택 감지
const onGunguChange = async () => {
  selectedDong.value = ''
  dongList.value = []

  if (selectedGungu.value) {
    await fetchDongList(selectedSido.value, selectedGungu.value)
  }
}

// 시/도 목록 로드
const fetchSidoList = async () => {
  const response = await api.get('/map/dongcode/sido')
  sidoList.value = response.data.data
}

// 구군 목록 로드
const fetchGunguList = async (sidoName) => {
  try {
    const response = await api.get(`/map/dongcode/gugun?sidoName=${sidoName}`)
    gunguList.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch sigungu list:', error)
  }
}

// 읍면동 목록 로드
const fetchDongList = async (sidoName, gunguName) => {
  try {
    const response = await api.get(`/map/dongcode/dong?sidoName=${sidoName}&gugunName=${gunguName}`)
    dongList.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch eupmyeondong list:', error)
  }
}

// 지도 초기화
const initializeSgisMap = async () => {
  try {
    // Create SGIS Map instance
    window.sgisMap = new window.sop.Map('sgis-map')

    updateSgisMap([
      {
        address: '서울특별시 강남구 테헤란로 212',
        utmk: await api.get('/map/coords?address=서울특별시 강남구 테헤란로 212'),
        label: '멀티캠퍼스',
      },
    ])

    mapInitialized.value = true
  } catch (error) {
    console.error('Failed to initialize SGIS map:', error)
  }
}

const locationSearch = async () => {
  properties.value = []
  isLoading.value = true
  try {
    // Update search info
    updateSearchInfo()

    // Call backend API for real estate transaction data
    const response = await api.get(
      '/map/apart' +
        '?sidoName=' +
        selectedSido.value +
        '&gugunName=' +
        selectedGungu.value +
        '&dongName=' +
        selectedDong.value,
    )

    const items = response.data.data

    for (const item of items) {
      const aptSeq = item.aptSeq
      const roadNm = item.roadNm
      const roadNmBonbun = item.roadNmBonbun
      const roadNmBubun = item.roadNmBubun
      const aptNm = item.aptNm
      const address = `${selectedSido.value} ${selectedGungu.value} ${roadNm} ${roadNmBonbun}${roadNmBubun != 0 ? '-' + roadNmBubun : ''} ${aptNm}`
      let utmkObject = {
        data: {
          x: item.x,
          y: item.y,
        },
      }

      if (item.x == 0 && item.y == 0) {
        utmkObject = await api.get('/map/coords?address=' + address)
      }

      properties.value.push({
        aptSeq: aptSeq,
        address: address,
        utmk: utmkObject,
        label: aptNm,
        isToggling: false,
        isLike: false,
      })
    }

    if (authStore.isLoggedIn) {
      const likeResponse = await api.get('/like')
      const likeItems = likeResponse.data.data.map((p) => p.aptSeq)

      properties.value.forEach((property) => {
        if (likeItems.includes(property.aptSeq)) {
          property.isLike = true
        }
      })
    }
    // Update SGIS map with search results
    await updateSgisMap(properties.value)
    await insertDB()
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isLoading.value = false
  }
}

const insertDB = async () => {
  const infos = []
  for (const item of properties.value) {
    infos.push({
      aptSeq: item.aptSeq,
      x: item.utmk.data.x,
      y: item.utmk.data.y,
    })
  }
  await api.post('/map/coord', infos)
}

const updateSearchInfo = () => {
  const sidoName = selectedSido.value
  const gunguName = selectedGungu.value
  const dongName = selectedDong.value

  let location = sidoName
  if (gunguName) location += ` ${gunguName}`
  if (dongName) location += ` ${dongName}`

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

const selectProperty = async (property) => {
  // 같은 매물을 다시 클릭하면 선택 해제
  if (selectedProperty.value?.aptSeq === property.aptSeq) {
    selectedProperty.value = null
    deals.value = []
    return
  }

  selectedProperty.value = property
  deals.value = [] // 이전 거래 내역 초기화

  // Center SGIS map on selected property
  centerSgisMapOnProperty(property)

  // Load deals for selected property
  await fetchDeals(property.aptSeq)
}

const centerSgisMapOnProperty = (property) => {
  if (window.sgisMap && property.utmk && property.utmk.data) {
    try {
      const x = property.utmk.data.x
      const y = property.utmk.data.y

      // 다양한 SGIS API 메서드 지원
      if (window.sgisMap.setView) {
        window.sgisMap.setView([x, y], 16)
      } else if (window.sgisMap.setCenter) {
        window.sgisMap.setCenter([x, y])
        window.sgisMap.setZoom(16)
      }
    } catch (error) {
      console.error('Failed to center map:', error)
    }
  }
}

const fetchDeals = async (aptSeq) => {
  if (!aptSeq) return

  isLoadingDeals.value = true
  try {
    const response = await api.get(`/map/apart/${aptSeq}/detail`)
    const items = response.data.data.apartDeals

    for (const item of items) {
      deals.value.push({
        type: '매매',
        amount: item.dealAmount,
        area: item.excluUseAr,
        floor: item.floor,
        date: item.dealYear + '.' + item.dealMonth + '.' + item.dealDay,
      })
    }
  } catch (error) {
    console.error('Failed to fetch deals:', error)
    deals.value = []
  } finally {
    isLoadingDeals.value = false
  }
}

const formatPrice = (price) => {
  const cleanAmount = parseInt(price.replace(/,/g, '').trim(), 10)

  const eok = Math.floor(cleanAmount / 10000) // 억
  const man = cleanAmount % 10000 // 만

  let result = ''

  if (eok > 0) {
    result += `${eok}억`
  }

  if (man > 0) {
    if (man % 1000 === 0) {
      result += ` ${man / 1000}천만`
    } else {
      result += ` ${man}만`
    }
  }

  result = result.trim() + ' 원'
  return result
}

const updateSgisMap = (infos) => {
  resetMarker()
  try {
    for (let i = 0; i < infos.length; i++) {
      const info = infos[i]
      if (!info.utmk.data.x || !info.utmk.data.y) continue
      const myIcon = sop.icon({
        iconUrl: '/img/marker.png',
        iconSize: [32, 32],
        iconAnchor: [15, 0],
        shadowAnchor: [5, 0],
        popupAnchor: [0, -75],
      })
      const marker = sop.marker([info.utmk.data.x, info.utmk.data.y], { icon: myIcon }) //마커 생성시 myIcon 옵션값이용 마커 생성

      marker.addTo(window.sgisMap).bindInfoWindow(info.label)
      markers.push(marker)
      bounds.push([info.utmk.data.x, info.utmk.data.y])
    }
    // 경계를 기준으로 map을 중앙에 위치하도록 함
    if (bounds.length > 1) {
      window.sgisMap.setView(
        window.sgisMap._getBoundsCenterZoom(bounds).center,
        window.sgisMap._getBoundsCenterZoom(bounds).zoom,
      )
    } else {
      window.sgisMap.setView(window.sgisMap._getBoundsCenterZoom(bounds).center, 9)
    }
  } catch (e) {
    console.log(e)
  }
}

// 마커와 경계 초기화
const resetMarker = () => {
  markers.forEach((item) => item.remove())
  bounds.length = 0
}

// AI Search Methods - 업데이트
const toggleSearchMode = (isAiMode) => {
  isAiSearchMode.value = isAiMode
  // 검색 모드 변경 시 AI 검색 완료 상태 초기화
  if (!isAiMode) {
    aiSearchCompleted.value = false
    aiSearchResults.value = []
  }
}

const handleAiSearch = async () => {
  if (!authStore.isLoggedIn) {
    alert('로그인 후 사용해주세요.')
    router.push('/loginForm')
    return
  }
  isLoading.value = true

  try {
    const response = await api.post('/recommendation/recommend', aiSearchData)

    // 검색 결과 저장
    aiSearchResults.value = response.data.data.recommendations
    aiSearchCompleted.value = true // 검색 완료 상태로 변경
  } catch (error) {
    console.error('AI Search failed:', error)
  } finally {
    isLoading.value = false
  }
}

// AI 검색 결과 선택 - 새로 추가
const selectAiResult = async (result) => {
  selectedSido.value = result.sido
  selectedGungu.value = result.gungu
  selectedDong.value = result.dong
  locationSearch()
}

// AI 검색 초기화 - 새로 추가
const resetAiSearch = () => {
  aiSearchCompleted.value = false
  aiSearchResults.value = []
  properties.value = []

  // 검색 데이터 초기화 (선택사항)
  Object.keys(aiSearchData).forEach((key) => {
    aiSearchData[key] = ''
  })
}

// 찜 토글 함수
const toggleFavorite = async (property) => {
  if (!authStore.isLoggedIn) {
    alert('로그인 후 사용해주세요.')
    router.push('/loginForm')
    return
  }
  // 중복 클릭 방지
  if (property.isToggling) return

  property.isToggling = true

  try {
    const aptSeq = property.aptSeq

    if (property.isLike) {
      // 찜 취소 API 호출
      await api.delete(`/like/${aptSeq}`)
      property.isLike = false
    } else {
      // 찜 추가 API 호출
      await api.post(`/like/${aptSeq}`)
      property.isLike = true
    }
  } catch (error) {
    console.error('찜 상태 변경 실패:', error)
  } finally {
    // 하트 뛰는 애니메이션을 위한 딜레이
    setTimeout(() => {
      property.isToggling = false
    }, 600)
  }
}

// Lifecycle
onMounted(() => {
  // Load sido list on component mount
  fetchSidoList()

  nextTick(() => {
    initializeSgisMap()
  })
})
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  font-family: 'Noto Sans KR', Arial, sans-serif;
}

/* Search Section */
.search-section {
  background: linear-gradient(135deg, #ffa069 0%, #fab17d 50%, #ffda62 100%);
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.search-bar {
  max-width: 1200px;
  margin: 0 auto;
}

/* Search Mode Toggle */
.search-mode-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.toggle-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  color: white;
}

.toggle-btn.active {
  background: rgba(255, 255, 255, 0.95);
  color: #ff6b35;
  border-color: white;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
}

/* AI 검색 결과 섹션 - 새로 추가 */
.ai-results-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.ai-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.ai-results-header h3 {
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.new-search-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid white;
  border-radius: 12px;
  color: #ff6b35;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.new-search-btn:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
}

.ai-results-summary {
  margin-bottom: 1.5rem;
}

.search-summary-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.summary-item {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.ai-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.ai-result-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  backdrop-filter: blur(10px);
}

.ai-result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.8);
}

.ai-result-card.selected {
  border-color: #ff6b35;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 210, 63, 0.1) 100%);
}

.ai-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ai-result-rank {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.ai-result-score {
  background: linear-gradient(135deg, #ffd23f 0%, #f7931e 100%);
  color: #333;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.ai-result-content h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: bold;
}

.ai-result-title {
  margin: 0 0 1rem 0;
  font-weight: bold;
  font-size: 1.1rem;
}

.ai-result-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.ai-tag {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 210, 63, 0.1) 100%);
  color: #ff6b35;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 107, 53, 0.3);
}

.ai-result-reason {
  margin: 0;
  color: #555;
  font-size: 0.85rem;
  line-height: 1.4;
}

/* AI Search Styles */
.ai-search-group {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.ai-search-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.ai-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.ai-input-group.full-width {
  flex: 100%;
}

.ai-label {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.ai-input {
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  outline: none;
  transition: all 0.3s ease;
}

.ai-input:focus {
  border-color: white;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  background: white;
}

.ai-input.small {
  flex: 1;
  min-width: 80px;
}

.ai-textarea {
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  outline: none;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}

.ai-textarea:focus {
  border-color: white;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  background: white;
}

.price-range-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-divider {
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.ai-search-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ffd23f 0%, #fff 50%, #ffd23f 100%);
  border: 3px solid white;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ff6b35;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.ai-search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
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
  height: calc(100vh - 220px);
}

/* Left Panel */
.left-panel {
  width: 400px;
  height: 100%;
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
  width: 110px;
  height: 110px;
  left: 10px;
  top: 10px;
  position: relative;
  overflow: hidden;
}

.property-image img {
  width: 85%;
  height: 85%;
  object-fit: cover;
}

.property-badge {
  position: absolute;
  bottom: 20px;
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
  font-size: 1.1rem;
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
/* Deal Section Styles */

.deal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 210, 63, 0.1) 100%);
  gap: 10px;
}

.deal-header h3 {
  color: #ff6b35;
  font-weight: bold;
  margin: 0;
  font-size: 1rem;
}

.deal-count {
  background: #ff6b35;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.deal-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sort-options {
  align-self: flex-end; /* 좌측 정렬 (필요 시) */
}

.deal-section {
  height: 100%;
  overflow: hidden;
}

.deal-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  height: 90%; /* flex item이 정확한 높이를 가지도록 */
}

.deal-card {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  padding: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.deal-card:hover {
  border-color: #ff6b35;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.1);
}

.deal-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.deal-type {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
}

.deal-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #ff6b35;
}

.deal-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.deal-area,
.deal-floor,
.deal-date {
  display: flex;
  align-items: center;
}

.deal-area::before {
  content: '📐';
  margin-right: 0.25rem;
}

.deal-floor::before {
  content: '🏢';
  margin-right: 0.25rem;
}

.deal-date::before {
  content: '📅';
  margin-right: 0.25rem;
}

.deal-address {
  font-size: 0.8rem;
  color: #999;
  border-top: 1px solid #f5f5f5;
  padding-top: 0.5rem;
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

  .ai-results-grid {
    grid-template-columns: 1fr;
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

  .search-summary-info {
    flex-direction: column;
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

  .ai-results-section {
    padding: 1rem;
  }
}

/* 찜 버튼 스타일 */
.favorite-btn {
  margin: 5px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.favorite-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.favorite-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.favorite-btn.active {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

/* 하트 SVG 스타일 */
.favorite-btn svg {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

/* 기본 상태 (빈 하트) */
.favorite-btn svg path {
  fill: #e5e7eb;
  stroke: #9ca3af;
  stroke-width: 1;
  transition: all 0.3s ease;
}

/* 호버 상태 */
.favorite-btn:hover svg path {
  fill: #fca5a5;
  stroke: #ef4444;
}

/* 찜한 상태 (빨간 하트) */
.favorite-btn svg.filled path {
  fill: #ef4444;
  stroke: #dc2626;
  stroke-width: 0;
}

/* 클릭 애니메이션 */
.favorite-btn svg.beating {
  animation: heartBeat 0.6s ease-in-out;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.3);
  }
  30% {
    transform: scale(1.1);
  }
  45% {
    transform: scale(1.25);
  }
  60% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 찜 표시 인디케이터 */
.favorite-indicator {
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 600;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 알림 애니메이션 */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .favorite-btn {
    width: 32px;
    height: 32px;
    top: 6px;
    right: 6px;
  }

  .favorite-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>
