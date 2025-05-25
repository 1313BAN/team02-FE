<template>
  <div class="container">
    <!-- Main Content -->
    <main class="main-content">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1 class="login-title">로그인</h1>
            <p class="login-subtitle">맞동산에서 나만의 동네을 찾아보세요!</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="input-group">
              <label for="email" class="input-label">이메일</label>
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

            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="rememberMe" class="checkbox" />
                <span class="checkmark"></span>
                로그인 상태 유지
              </label>
              <RouterLink to="/findPWForm" class="forgot-link"> 비밀번호를 잊으셨나요? </RouterLink>
            </div>

            <button type="submit" class="login-btn" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? '로그인 중...' : '로그인' }}
            </button>
          </form>

          <div class="signup-link">
            <p>
              아직 회원이 아니신가요?
              <RouterLink to="/signUpForm" class="signup-btn">회원가입</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
      errors: {},
      showPassword: false,
      rememberMe: false,
      isLoading: false,
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    validateForm() {
      this.errors = {}

      if (!this.formData.email) {
        this.errors.email = '이메일을 입력해주세요.'
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = '올바른 이메일 형식이 아닙니다.'
      }

      if (!this.formData.password) {
        this.errors.password = '비밀번호를 입력해주세요.'
      } else if (this.formData.password.length < 6) {
        this.errors.password = '비밀번호는 6자 이상이어야 합니다.'
      }

      return Object.keys(this.errors).length === 0
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    async handleLogin() {
      if (!this.validateForm()) return

      this.isLoading = true
      try {
        // 실제 로그인 API 호출
        console.log('로그인 시도:', this.formData)

        // 임시 로그인 처리 (실제 구현 시 API 호출)
        setTimeout(() => {
          this.isLoading = false
          this.$router.push('/')
        }, 1000)
      } catch (error) {
        this.isLoading = false
        console.error('로그인 오류:', error)
        // 에러 처리
      }
    },
  },
}
</script>

<style scoped>
.container {
  min-height: 100vh;
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
