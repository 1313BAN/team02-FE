<template>
  <div class="container">
    <!-- Main Content -->
    <main class="main-content">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1 class="login-title">회원가입</h1>
            <p class="login-subtitle">회원 정보를 입력해주세요.</p>
          </div>

          <form @submit.prevent="handleSignup" class="login-form">
            <div class="input-group">
              <label for="email" class="input-label">아이디</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                placeholder="이메일을 입력하세요"
                class="input-field"
                :class="{ error: errors.email }"
                required
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="input-group">
              <label for="password" class="input-label">비밀번호</label>
              <div class="password-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="formData.password"
                  placeholder="비밀번호를 입력하세요"
                  class="input-field"
                  :class="{ error: errors.password }"
                  required
                />
                <button type="button" class="password-toggle" @click="togglePassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>

            <div class="input-group">
              <label for="name" class="input-label">이름</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
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
                v-model="formData.nickname"
                placeholder="닉네임을 입력하세요"
                class="input-field"
                :class="{ error: errors.nickname }"
                required
              />
              <span v-if="errors.nickname" class="error-message">{{ errors.nickname }}</span>
            </div>

            <div class="input-group">
              <label for="phoneNumber" class="input-label">전화번호</label>
              <input
                type="tel"
                id="phoneNumber"
                v-model="formData.phoneNumber"
                placeholder="010-1234-5678"
                class="input-field"
                :class="{ error: errors.phoneNumber }"
                required
              />
              <span v-if="errors.phoneNumber" class="error-message">{{ errors.phoneNumber }}</span>
            </div>

            <button type="submit" class="login-btn" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? '회원가입 중...' : '회원가입' }}
            </button>
          </form>

          <div class="signup-link">
            <p>
              이미 회원이신가요?
              <RouterLink to="/loginForm" class="signup-btn">로그인</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api'

// const api = localAxios()

// Composables
const router = useRouter()

// Reactive state
const formData = reactive({
  email: '',
  password: '',
  name: '',
  nickname: '',
  phoneNumber: '',
})

const errors = reactive({})
const showPassword = ref(false)
const isLoading = ref(false)

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key])

  // 이메일 validation
  if (!formData.email) {
    errors.email = '이메일을 입력해주세요.'
  } else if (!isValidEmail(formData.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.'
  }

  // 비밀번호 validation
  if (!formData.password) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (formData.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.'
  } else if (formData.password.length > 20) {
    errors.password = '비밀번호는 20자 이하여야 합니다.'
  } else if (!isValidPassword(formData.password)) {
    errors.password = '비밀번호는 영문, 숫자, 특수문자를 조합해야 합니다.'
  }

  // 이름 validation
  if (!formData.name) {
    errors.name = '이름을 입력해주세요.'
  } else if (formData.name.length < 2) {
    errors.name = '이름은 2자 이상이어야 합니다.'
  } else if (formData.name.length > 10) {
    errors.name = '이름은 10자 이하여야 합니다.'
  } else if (!isValidName(formData.name)) {
    errors.name = '이름은 한글, 영문만 입력 가능합니다.'
  }

  // 닉네임 validation
  if (!formData.nickname) {
    errors.nickname = '닉네임을 입력해주세요.'
  } else if (formData.nickname.length < 2) {
    errors.nickname = '닉네임은 2자 이상이어야 합니다.'
  } else if (formData.nickname.length > 12) {
    errors.nickname = '닉네임은 12자 이하여야 합니다.'
  } else if (!isValidNickname(formData.nickname)) {
    errors.nickname = '닉네임은 한글, 영문, 숫자만 입력 가능합니다.'
  }

  // 전화번호 validation
  if (!formData.phoneNumber) {
    errors.phoneNumber = '전화번호를 입력해주세요.'
  } else if (!isValidPhone(formData.phoneNumber)) {
    errors.phoneNumber = '올바른 전화번호 형식이 아닙니다. (010-1234-5678)'
  }

  return Object.keys(errors).length === 0
}

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

const isValidPassword = (password) => {
  // 영문, 숫자, 특수문자 조합 체크
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  return hasLetter && hasNumber && hasSpecial
}

const isValidName = (name) => {
  // 한글, 영문, 공백만 허용
  const nameRegex = /^[가-힣a-zA-Z\s]+$/
  return nameRegex.test(name)
}

const isValidNickname = (nickname) => {
  // 한글, 영문, 숫자만 허용
  const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/
  return nicknameRegex.test(nickname)
}

const isValidPhone = (phoneNumber) => {
  // 010-1234-5678 또는 01012345678 형식
  const phoneRegex = /^010-?([0-9]{4})-?([0-9]{4})$/
  return phoneRegex.test(phoneNumber)
}

const formatPhoneNumber = (phoneNumber) => {
  // 전화번호를 010-1234-5678 형식으로 변환
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  if (cleanPhone.length === 11 && cleanPhone.startsWith('010')) {
    return cleanPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  return phoneNumber
}

const handleSignup = async () => {
  if (!validateForm()) return
  // 전화번호 포맷팅
  formData.phoneNumber = formatPhoneNumber(formData.phoneNumber)

  isLoading.value = true
  try {
    // 회원가입 API 호출
    const response = await api.post('/auth/signup', formData)

    if (response.status == 201) {
      // 회원가입 성공
      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      router.push('/loginForm')
    } else {
    }
  } catch (error) {
    // 회원가입 실패
    if (error.status == 409) {
      errors.email = '이미 존재하는 이메일입니다.'
    } else {
      errors.email = '서버 연결에 실패했습니다.'
    }
    console.error('회원가입 오류:', error)
  } finally {
    isLoading.value = false
  }
}

// Watchers
// 전화번호 입력 시 자동 포맷팅
watch(
  () => formData.phoneNumber,
  (newPhone) => {
    if (newPhone && newPhone.length >= 3) {
      const cleanPhone = newPhone.replace(/\D/g, '')
      if (cleanPhone.length <= 11) {
        if (cleanPhone.length >= 7) {
          formData.phoneNumber = cleanPhone
            .replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3')
            .replace(/-$/, '')
        } else if (cleanPhone.length >= 3) {
          formData.phoneNumber = cleanPhone.replace(/(\d{3})(\d{0,4})/, '$1-$2').replace(/-$/, '')
        }
      }
    }
  },
)
</script>

<style scoped>
.container {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans KR', Arial, sans-serif;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd23f 100%);
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
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="snack-pattern" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.3)"/><circle cx="30" cy="25" r="1.5" fill="rgba(255,210,63,0.4)"/><circle cx="45" cy="15" r="1" fill="rgba(255,255,255,0.2)"/><circle cx="20" cy="40" r="1.5" fill="rgba(247,147,30,0.3)"/><circle cx="40" cy="35" r="1" fill="rgba(255,255,255,0.25)"/></pattern></defs><rect width="100" height="100" fill="url(%23snack-pattern)"/></svg>');
  opacity: 0.6;
}

.login-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 2.5rem;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 3px solid rgba(255, 210, 63, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #ff6b35;
  text-shadow:
    2px 2px 0px #ffd23f,
    -1px -1px 0px #f7931e;
  margin-bottom: 0.5rem;
  transform: rotate(-1deg);
}

.login-subtitle {
  color: #666;
  font-size: 0.9rem;
}

.login-form {
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

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ff6b35;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox:checked + .checkmark {
  background: #ff6b35;
}

.checkbox:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.forgot-link {
  color: #ff6b35;
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
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
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(255, 107, 53, 0.4);
}

.login-btn:disabled {
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.signup-btn {
  color: #ff6b35;
  text-decoration: none;
  font-weight: 600;
}

.signup-btn:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 640px) {
  .nav-container {
    padding: 0 1rem;
  }

  .main-content {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem;
  }

  .login-title {
    font-size: 2rem;
  }
}
</style>
