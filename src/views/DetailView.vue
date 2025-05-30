<template>
  <div class="container">
    <!-- Main Content -->
    <main class="main-content">
      <div class="mypage-container">
        <div class="mypage-card">
          <div class="mypage-header">
            <h1 class="mypage-title">마이페이지</h1>
            <p class="mypage-subtitle">내 정보를 확인하고 수정해보세요!</p>
          </div>

          <!-- 로딩 상태 -->
          <div v-if="isInitialLoading" class="loading-container">
            <div class="loading-spinner large"></div>
            <p class="loading-text">정보를 불러오는 중...</p>
          </div>

          <!-- 에러 상태 -->
          <div v-else-if="loadError" class="error-container">
            <p class="error-text">정보를 불러오는 중 오류가 발생했습니다.</p>
            <button @click="fetchUserData" class="retry-btn">다시 시도</button>
          </div>

          <!-- 조회 모드 -->
          <div v-else-if="!isEditMode" class="view-mode">
            <div class="info-group">
              <label class="info-label">이름</label>
              <div class="info-display">{{ userInfo.name }}</div>
            </div>

            <div class="info-group">
              <label class="info-label">닉네임</label>
              <div class="info-display">{{ userInfo.nickname }}</div>
            </div>

            <div class="info-group">
              <label class="info-label">이메일</label>
              <div class="info-display">{{ userInfo.email }}</div>
            </div>

            <div class="info-group">
              <label class="info-label">전화번호</label>
              <div class="info-display">{{ userInfo.phoneNumber }}</div>
            </div>

            <button @click="enterEditMode" class="edit-btn">✏️ 정보 수정</button>
          </div>

          <!-- 수정 모드 -->
          <form v-else @submit.prevent="handleUpdate" class="edit-form">
            <div class="input-group">
              <label for="name" class="input-label">이름</label>
              <input
                type="text"
                id="name"
                v-model="editData.name"
                placeholder="이름을 입력하세요"
                class="input-field"
                :class="{ error: errors.name }"
                required
              />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="input-group">
              <label for="nickname" class="input-label">닉네임</label>
              <input
                type="text"
                id="nickname"
                v-model="editData.nickname"
                placeholder="닉네임을 입력하세요"
                class="input-field"
                :class="{ error: errors.nickname }"
                required
              />
              <span v-if="errors.nickname" class="error-message">{{ errors.nickname }}</span>
            </div>

            <div class="input-group">
              <label for="email" class="input-label">이메일</label>
              <input
                type="email"
                id="email"
                v-model="editData.email"
                placeholder="이메일을 입력하세요"
                class="input-field"
                :class="{ error: errors.email }"
                required
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="input-group">
              <label for="phoneNumber" class="input-label">전화번호</label>
              <input
                type="tel"
                id="phoneNumber"
                v-model="editData.phoneNumber"
                placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
                class="input-field"
                :class="{ error: errors.phoneNumber }"
                required
              />
              <span v-if="errors.phoneNumber" class="error-message">{{ errors.phoneNumber }}</span>
            </div>

            <div class="input-group">
              <label for="password" class="input-label">새 비밀번호</label>
              <div class="password-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="editData.password"
                  placeholder="새 비밀번호를 입력하세요 (선택사항)"
                  class="input-field"
                  :class="{ error: errors.password }"
                />
                <button type="button" class="password-toggle" @click="togglePassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              <small class="password-hint">비밀번호를 변경하지 않으려면 비워두세요</small>
            </div>

            <div class="button-group">
              <button type="button" @click="cancelEdit" class="cancel-btn">취소</button>
              <button type="submit" class="save-btn" :disabled="isLoading">
                <span v-if="isLoading" class="loading-spinner"></span>
                {{ isLoading ? '저장 중...' : '수정 완료' }}
              </button>
            </div>
          </form>
        </div>

        <!-- 찜한 매물 섹션 -->
        <div v-if="!isInitialLoading && !loadError" class="favorites-section">
          <div class="favorites-header">
            <h2 class="favorites-title">💖 찜한 매물</h2>
            <span class="favorites-count">{{ favoriteProperties.length }}개</span>
          </div>

          <div v-if="favoriteProperties.length > 0" class="favorites-list">
            <div v-for="property in favoriteProperties" :key="property.id" class="property-card">
              <div class="property-info">
                <h3 class="property-name">{{ property.aptNm }}</h3>
                <p class="property-location">
                  📍
                  {{
                    property.roadNm +
                    ' ' +
                    property.roadNmBonbun +
                    (property.roadNmBubun != 0 ? '-' + property.roadNmBubun : '') +
                    ' ' +
                    property.aptNm
                  }}
                </p>
                <div class="property-details">
                  <span class="property-type">아파트</span>
                </div>
              </div>
              <button @click="removeFavorite(property.aptSeq)" class="remove-btn">❌</button>
            </div>
          </div>

          <div v-else class="empty-favorites">
            <p>아직 찜한 매물이 없습니다.</p>
            <p class="empty-subtitle">마음에 드는 매물을 찜해보세요! 💝</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/api.js'
import CryptoJS from 'crypto-js'

export default {
  name: 'MyPageView',
  setup() {
    // 반응형 데이터
    const userInfo = reactive({
      name: '',
      nickname: '',
      email: '',
      phoneNumber: '',
    })

    const editData = reactive({
      name: '',
      nickname: '',
      email: '',
      phoneNumber: '',
      password: '',
    })

    const favoriteProperties = ref([])

    const errors = reactive({})
    const isEditMode = ref(false)
    const showPassword = ref(false)
    const isLoading = ref(false)
    const isInitialLoading = ref(true)
    const loadError = ref(false)

    // API 호출 함수들
    const fetchUserData = async () => {
      try {
        isInitialLoading.value = true
        loadError.value = false

        const response = await api.get('/user')

        // 사용자 정보 업데이트
        userInfo.name = response.data.data.name || ''
        userInfo.nickname = response.data.data.nickname || ''
        userInfo.email = response.data.data.email || ''
        userInfo.phoneNumber = response.data.data.phoneNumber || ''

        // 찜한 매물 정보도 함께 받아온다면
        if (response.data.data.userLikes) {
          favoriteProperties.value = response.data.data.userLikes
        }

        console.log('사용자 정보 로드 완료:', response.data.data)
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error)
        loadError.value = true

        // 에러에 따른 처리
        if (error.response?.status === 401) {
          // 인증 실패 - 로그인 페이지로 리다이렉트 등
          console.log('인증이 필요합니다.')
        } else {
          console.log('서버 오류가 발생했습니다.')
        }
      } finally {
        isInitialLoading.value = false
      }
    }

    // 메서드들
    const enterEditMode = () => {
      isEditMode.value = true
      editData.name = userInfo.name
      editData.nickname = userInfo.nickname
      editData.email = userInfo.email
      editData.phoneNumber = userInfo.phoneNumber
      editData.password = ''
      Object.keys(errors).forEach((key) => delete errors[key])
    }

    const cancelEdit = () => {
      isEditMode.value = false
      editData.name = ''
      editData.nickname = ''
      editData.email = ''
      editData.phoneNumber = ''
      editData.password = ''
      Object.keys(errors).forEach((key) => delete errors[key])
      showPassword.value = false
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    const isValidPhoneNumber = (phoneNumber) => {
      // 한국 전화번호 패턴 (010-1234-5678, 01012345678 등)
      const phoneRegex = /^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/
      return phoneRegex.test(phoneNumber.replace(/\s/g, ''))
    }

    const validateForm = () => {
      Object.keys(errors).forEach((key) => delete errors[key])

      if (!editData.name.trim()) {
        errors.name = '이름을 입력해주세요.'
      } else if (editData.name.length < 2) {
        errors.name = '이름은 2자 이상이어야 합니다.'
      }

      if (!editData.nickname.trim()) {
        errors.nickname = '닉네임을 입력해주세요.'
      } else if (editData.nickname.length < 2) {
        errors.nickname = '닉네임은 2자 이상이어야 합니다.'
      }

      if (!editData.email) {
        errors.email = '이메일을 입력해주세요.'
      } else if (!isValidEmail(editData.email)) {
        errors.email = '올바른 이메일 형식이 아닙니다.'
      }

      if (!editData.phoneNumber.trim()) {
        errors.phoneNumber = '전화번호를 입력해주세요.'
      } else if (!isValidPhoneNumber(editData.phoneNumber)) {
        errors.phoneNumber = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
      }

      if (editData.password && editData.password.length < 6) {
        errors.password = '비밀번호는 6자 이상이어야 합니다.'
      }

      return Object.keys(errors).length === 0
    }

    const handleUpdate = async () => {
      if (!validateForm()) return

      isLoading.value = true
      try {
        // API로 업데이트 요청
        const updateData = {
          name: editData.name,
          nickname: editData.nickname,
          email: editData.email,
          phoneNumber: editData.phoneNumber,
        }

        // 비밀번호가 입력된 경우에만 포함
        if (editData.password) {
          updateData.password = editData.password
          const hashedPassword = CryptoJS.SHA256(updateData.password).toString(CryptoJS.enc.Base64)
          updateData.password = hashedPassword
        }

        const response = await api.put('/user/update', updateData)

        // 성공시 로컬 데이터 업데이트
        userInfo.name = editData.name
        userInfo.nickname = editData.nickname
        userInfo.email = editData.email
        userInfo.phoneNumber = editData.phoneNumber

        isEditMode.value = false
        alert('정보가 성공적으로 업데이트되었습니다!')

        console.log('업데이트 성공:', response.data)
      } catch (error) {
        console.error('업데이트 오류:', error)

        // 에러 타입에 따른 처리
        if (error.response?.status === 400) {
          alert('입력한 정보를 확인해주세요.')
        } else if (error.response?.status === 409) {
          alert('이미 사용중인 이메일입니다.')
        } else {
          alert('업데이트 중 오류가 발생했습니다.')
        }
      } finally {
        isLoading.value = false
      }
    }

    const removeFavorite = async (aptSeq) => {
      try {
        await api.delete(`/like/${aptSeq}`)
        favoriteProperties.value = favoriteProperties.value.filter(
          (property) => property.aptSeq !== aptSeq,
        )
        console.log('찜 해제 완료:', aptSeq)
      } catch (error) {
        console.error('찜 해제 실패:', error)
        alert('찜 해제 중 오류가 발생했습니다.')
      }
    }

    // 컴포넌트 마운트시 데이터 로드
    onMounted(() => {
      fetchUserData()
    })

    return {
      userInfo,
      editData,
      favoriteProperties,
      errors,
      isEditMode,
      showPassword,
      isLoading,
      isInitialLoading,
      loadError,
      enterEditMode,
      cancelEdit,
      togglePassword,
      handleUpdate,
      removeFavorite,
      fetchUserData,
    }
  },
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans KR', Arial, sans-serif;
  background: linear-gradient(135deg, #ffa069 0%, #fab17d 50%, #ffda62 100%);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="clean-pattern" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="1" fill="rgba(255,107,53,0.08)"/><circle cx="45" cy="30" r="0.8" fill="rgba(247,147,30,0.06)"/><circle cx="30" cy="45" r="1.2" fill="rgba(255,107,53,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23clean-pattern)"/></svg>');
  opacity: 0.3;
}

.mypage-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 450px;
}

.mypage-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.mypage-header {
  text-align: center;
  margin-bottom: 2rem;
}

.mypage-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #ff6b35;
  text-shadow:
    2px 2px 0px #ffd23f,
    -1px -1px 0px #f7931e;
  margin-bottom: 0.5rem;
  transform: rotate(-1deg);
}

.mypage-subtitle {
  color: #666;
  font-size: 0.9rem;
}

/* 로딩 및 에러 상태 */
.loading-container,
.error-container {
  text-align: center;
  padding: 3rem 2rem;
}

.loading-text,
.error-text {
  color: #666;
  font-size: 1rem;
  margin-top: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
}

/* 조회 모드 스타일 */
.view-mode {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.info-display {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 107, 53, 0.2);
  border-radius: 15px;
  font-size: 1rem;
  color: #333;
}

.edit-btn {
  padding: 1rem;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(255, 107, 53, 0.4);
}

/* 수정 모드 스타일 */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.input-field {
  padding: 1rem;
  border: 2px solid rgba(255, 107, 53, 0.2);
  border-radius: 15px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.input-field:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  background: white;
}

.input-field.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.password-hint {
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn {
  flex: 1;
  padding: 1rem;
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  border: 2px solid rgba(108, 117, 125, 0.3);
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: rgba(108, 117, 125, 0.2);
  transform: translateY(-1px);
}

.save-btn {
  flex: 1;
  padding: 1rem;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(255, 107, 53, 0.4);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.large {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 107, 53, 0.2);
  border-top: 3px solid #ff6b35;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Favorites Section */
.favorites-section {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 450px;
  margin-top: 2rem;
}

.favorites-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.favorites-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff6b35;
  margin: 0;
}

.favorites-count {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.property-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 107, 53, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;
}

.property-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.15);
}

.property-info {
  flex: 1;
}

.property-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.property-location {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 0.8rem 0;
}

.property-details {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.property-type {
  background: rgba(255, 107, 53, 0.1);
  color: #ff6b35;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.property-year {
  font-weight: 700;
  color: #ff6b35;
  font-size: 1rem;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.remove-btn:hover {
  opacity: 1;
  background: rgba(231, 76, 60, 0.1);
}

.empty-favorites {
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.empty-favorites p {
  color: #666;
  margin: 0.5rem 0;
}

.empty-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 640px) {
  .main-content {
    padding: 1rem;
  }

  .mypage-card {
    padding: 2rem;
  }

  .mypage-title {
    font-size: 2rem;
  }

  .button-group {
    flex-direction: column;
    gap: 0.75rem;
  }

  .favorites-section {
    margin-top: 1.5rem;
  }

  .property-card {
    padding: 1.2rem;
  }

  .property-details {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>
