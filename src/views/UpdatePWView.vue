<template>
  <div class="container">
    <!-- Main Content -->
    <main class="main-content">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1 class="login-title">새 비밀번호 설정</h1>
            <p class="login-subtitle">새로운 비밀번호를 입력해주세요.</p>
          </div>

          <form @submit.prevent="UpdatePassword" class="login-form">
            <div class="input-group">
              <label for="password" class="input-label">새 비밀번호</label>
              <div class="password-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="formData.password"
                  placeholder="새 비밀번호를 입력하세요"
                  class="input-field"
                  :class="{ error: errors.password }"
                  required
                />
                <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>

            <div class="input-group">
              <label for="confirmPassword" class="input-label">새 비밀번호 확인</label>
              <div class="password-wrapper">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  class="input-field"
                  :class="{ error: errors.confirmPassword }"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="password-toggle"
                >
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="error-message">{{
                errors.confirmPassword
              }}</span>
            </div>

            <!-- 비밀번호 강도 표시 -->
            <div v-if="formData.password" class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <p class="strength-text" :class="passwordStrength.class">
                {{ passwordStrength.text }}
              </p>
            </div>

            <button type="submit" class="login-btn" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? '비밀번호 재설정 중...' : '비밀번호 재설정 완료' }}
            </button>
          </form>

          <div class="signup-link">
            <p>
              <RouterLink to="/loginForm" class="signup-btn">로그인으로 돌아가기</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/api.js'
import CryptoJS from 'crypto-js'

// Composables
const router = useRouter()
const route = useRoute()

// Reactive state
const formData = reactive({
  password: '',
  confirmPassword: '',
})

const errors = reactive({})
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 비밀번호 강도 계산
const passwordStrength = computed(() => {
  const password = formData.password
  if (!password) return { width: '0%', class: '', text: '' }

  let score = 0
  let text = ''
  let className = ''

  // 길이 체크
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1

  // 복잡성 체크
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 2) {
    text = '약함'
    className = 'weak'
  } else if (score <= 4) {
    text = '보통'
    className = 'medium'
  } else {
    text = '강함'
    className = 'strong'
  }

  const width = Math.min((score / 6) * 100, 100) + '%'

  return { width, class: className, text }
})

// Methods
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key])

  // 비밀번호 validation
  if (!formData.password) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (formData.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.'
  } else if (formData.password.length > 50) {
    errors.password = '비밀번호는 50자 이하여야 합니다.'
  } else if (!isValidPassword(formData.password)) {
    errors.password = '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'
  }

  // 비밀번호 확인 validation
  if (!formData.confirmPassword) {
    errors.confirmPassword = '비밀번호 확인을 입력해주세요.'
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
  }

  return Object.keys(errors).length === 0
}

const isValidPassword = (password) => {
  // 영문, 숫자, 특수문자 중 최소 2가지 포함
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return (hasLetter && hasNumber) || (hasLetter && hasSpecial) || (hasNumber && hasSpecial)
}

const UpdatePassword = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    // URL 쿼리 파라미터에서 passwordResetToken 가져오기
    const passwordResetToken = route.query.passwordResetToken

    if (!passwordResetToken) {
      errors.password = '유효하지 않은 접근입니다.'
      return
    }

    // 비밀번호 재설정 API 호출
    // 비밀번호 해싱 예시
    const hashedPassword = CryptoJS.SHA256(formData.password).toString(CryptoJS.enc.Base64)
    const response = await api.post('/user/reset-password', {
      password: hashedPassword,
      passwordResetToken: passwordResetToken,
    })

    console.log(response)

    if (response.status == 200) {
      // 비밀번호 재설정 성공
      alert('비밀번호가 성공적으로 변경되었습니다.')
      router.push('/loginForm')
    } else {
      // 실패 처리
      if (data.message === 'Invalid or expired token') {
        errors.password = '유효하지 않거나 만료된 링크입니다.'
      } else if (data.message === 'Password too weak') {
        errors.password = '더 강한 비밀번호를 설정해주세요.'
      } else {
        errors.password = '비밀번호 재설정에 실패했습니다.'
      }
    }
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error)
    errors.password = '서버 연결에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.container {
  min-height: 90vh;
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

/* 비밀번호 강도 표시 */
.password-strength {
  margin-top: -1rem;
  margin-bottom: 0.5rem;
}

.strength-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.strength-fill.weak {
  background: linear-gradient(90deg, #e74c3c, #ff6b6b);
}

.strength-fill.medium {
  background: linear-gradient(90deg, #f39c12, #f1c40f);
}

.strength-fill.strong {
  background: linear-gradient(90deg, #27ae60, #2ecc71);
}

.strength-text {
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.strength-text.weak {
  color: #e74c3c;
}

.strength-text.medium {
  color: #f39c12;
}

.strength-text.strong {
  color: #27ae60;
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
