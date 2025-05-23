<template>
  <div class="container">
    <!-- Main Content -->
    <main class="main-content">
      <div class="hero-section">
        <h1 class="hero-title">맞동산</h1>
        <p class="hero-subtitle">AI가 추천하는<br />당신만의 완벽한 동네를 찾아보세요!</p>

        <div class="cta-section">
          <RouterLink to="/map" class="main-cta-btn">🏠 집 보러 가기</RouterLink>
        </div>
      </div>

      <div class="house-icon">
        <svg class="house-svg" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </div>
    </main>
  </div>
</template>

<script></script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans KR', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd23f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 100%;
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

.hero-section {
  text-align: center;
  color: white;
  z-index: 2;
  position: relative;
  max-width: 800px;
  padding: 2rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-shadow:
    4px 4px 0px #ff6b35,
    8px 8px 0px #f7931e,
    12px 12px 20px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease;
  color: white;
  letter-spacing: -2px;
  transform: rotate(-2deg);
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  font-weight: 300;
  animation: fadeInUp 1s ease 0.2s both;
}

.cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: fadeInUp 1s ease 0.4s both;
}

.main-cta-btn {
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd23f 0%, #fff 50%, #ffd23f 100%);
  color: #ff6b35;
  border: 3px solid #ff6b35;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.8);
}

.main-cta-btn:hover {
  transform: translateY(-3px) rotate(1deg);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, #fff 0%, #ffd23f 50%, #fff 100%);
  border-color: #f7931e;
}

.house-icon {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%) rotate(-5deg);
  background: linear-gradient(135deg, rgba(255, 210, 63, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 3rem;
  animation: float 3s ease-in-out infinite;
  border: 3px solid rgba(255, 107, 53, 0.6);
  box-shadow:
    0 10px 30px rgba(255, 107, 53, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.8);
}

.house-svg {
  width: 120px;
  height: 120px;
  fill: #ff6b35;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

/* Mobile menu toggle */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ff6b35;
  cursor: pointer;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(-10px);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .nav-menu {
    gap: 1rem;
  }

  .nav-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .house-icon {
    display: none;
  }

  .hero-section {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .nav-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .nav-menu.active {
    display: flex;
  }

  .mobile-menu-toggle {
    display: block;
    color: #ff6b35;
  }
}
</style>
