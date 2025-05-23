<template>
  <!-- Header -->
  <header class="header">
    <nav class="nav-container">
      <RouterLink to="/" class="logo">맞동산</RouterLink>

      <ul class="nav-menu">
        <li>
          <RouterLink to="/map" class="nav-btn secondary">지도</RouterLink>
        </li>
        <li>
          <RouterLink to="/loginForm" class="nav-btn primary">로그인/회원가입</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* Header Styles */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
  min-height: 4rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.header.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff6b35;
  text-decoration: none;
  transition: transform 0.3s ease;
  text-shadow:
    2px 2px 0px #ffd23f,
    -1px -1px 0px #f7931e;
}

.logo:hover {
  transform: scale(1.05);
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.nav-btn.primary {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  border: 2px solid #ffd23f;
}

.nav-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
  background: linear-gradient(135deg, #f7931e 0%, #ff6b35 100%);
}

.nav-btn.secondary {
  background: transparent;
  color: #ff6b35;
  border: 2px solid #ff6b35;
}

.nav-btn.secondary:hover {
  background: #ff6b35;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.nav-btn.ghost {
  background: transparent;
  color: #666;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.nav-btn.ghost:hover {
  background: rgba(255, 107, 53, 0.1);
  color: #ff6b35;
}

.nav-btn.router-link-active {
  background: #ff6b35;
  color: white;
  border: 2px solid #ffd23f;
}
</style>
