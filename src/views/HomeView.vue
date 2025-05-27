<template>
  <div class="container">
    <!-- Main Content -->
    <main class="main-content">
      <div class="hero-section">
        <!-- 맞동산 의미 강조 -->
        <h1 class="hero-title">
          <span class="title-highlight mat">맞</span>춤
          <span class="title-highlight dong">동</span>네 추천 부동<span class="title-highlight san"
            >산</span
          >
        </h1>
        <div class="title-explanation">
          <span class="explanation-item"> <span class="emphasis">맞</span>춤형 추천 </span>
          <span class="explanation-item"> <span class="emphasis">동</span>네 정보 </span>
          <span class="explanation-item"> 부동<span class="emphasis">산</span> 플랫폼 </span>
        </div>

        <p class="hero-subtitle">AI가 추천하는<br />당신만의 맞춤 동네를 찾아보세요!</p>

        <div class="cta-section">
          <RouterLink to="/map" class="main-cta-btn">🏠 집 보러 가기</RouterLink>
        </div>
      </div>

      <!-- 맛동산 캐릭터 이미지 -->
      <div class="mascot-container">
        <img src="/img/character.png" alt="맛동산 캐릭터" class="mascot-image" />
      </div>
    </main>
  </div>
</template>

<script></script>

<style scoped>
.container {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans KR', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Main Content Styles - 연한 색상으로 변경 */
.main-content {
  flex: 1;
  background: linear-gradient(135deg, #ffa069 0%, #fab17d 50%, #ffda62 100%);
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
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="snack-pattern" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.4)"/><circle cx="30" cy="25" r="1.5" fill="rgba(255,231,167,0.5)"/><circle cx="45" cy="15" r="1" fill="rgba(255,255,255,0.3)"/><circle cx="20" cy="40" r="1.5" fill="rgba(255,196,155,0.4)"/><circle cx="40" cy="35" r="1" fill="rgba(255,255,255,0.35)"/></pattern></defs><rect width="100" height="100" fill="url(%23snack-pattern)"/></svg>');
  opacity: 0.5;
}

.hero-section {
  text-align: center;
  color: white;
  z-index: 2;
  position: relative;
  max-width: 800px;
  padding: 2rem;
}

/* 맞동산 제목 강조 스타일 */
.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-shadow:
    3px 3px 0px #ff9068,
    6px 6px 0px #ffb386,
    9px 9px 15px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 1s ease;
  color: white;
  letter-spacing: -1px;
  transform: rotate(-1deg);
  line-height: 1.2;
}

.title-highlight {
  position: relative;
  padding: 0 0.2rem;
  border-radius: 8px;
  animation: glow 2s ease-in-out infinite alternate;
}

.title-highlight.mat {
  color: #ff5518;
  text-shadow: 2px 2px 0px #ffe600fa;
}

.title-highlight.dong {
  color: #ff5518;
  text-shadow: 2px 2px 0px #ffe600fa;
}

.title-highlight.san {
  color: #ff5518;
  text-shadow: 2px 2px 0px #ffe600fa;
}

@keyframes glow {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

/* 제목 설명 */
.title-explanation {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease 0.1s both;
}

.explanation-item {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.emphasis {
  color: #ffeaa7;
  font-weight: 800;
  text-shadow: 2px 2px 0px #ffb386;
}

.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  font-weight: 400;
  animation: fadeInUp 1s ease 0.3s both;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: fadeInUp 1s ease 0.5s both;
}

.main-cta-btn {
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffeaa7 0%, #fff 50%, #ffeaa7 100%);
  color: #ff9068;
  border: 3px solid #ffb386;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.15),
    inset 0 2px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-block;
}

.main-cta-btn:hover {
  transform: translateY(-3px) rotate(1deg);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, #fff 0%, #ffeaa7 50%, #fff 100%);
  border-color: #ffc49b;
}
/* 맛동산 캐릭터 이미지 */
.mascot-container {
  position: absolute;
  right: 8%;
  top: 45%;
  transform: translateY(-50%);
  animation: mascotFloat 4s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(255, 144, 104, 0.3));
}

.mascot-image {
  width: 200px;
  height: auto;
  animation: mascotWave 3s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.mascot-image:hover {
  transform: scale(1.1) rotate(5deg);
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

@keyframes mascotWave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-3deg);
  }
  75% {
    transform: rotate(3deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .title-explanation {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .explanation-item {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .snack-house-container {
    display: none;
  }

  .hero-section {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
    line-height: 1.3;
  }

  .title-explanation {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
