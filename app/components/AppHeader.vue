<template>
  <header class="app-header" role="banner">
    <div class="header-inner container">
      <a href="/" class="logo" aria-label="Chronicle of War - Home">
        <span class="logo-icon">⚔</span>
        <span class="logo-text">
          <span class="logo-title">Chronicle</span>
          <span class="logo-sub">of War</span>
        </span>
      </a>

      <nav class="header-nav" aria-label="Main navigation">
        <a href="/" class="nav-link" :class="{ active: route.path === '/' }">Timeline</a>
        <a href="/about" class="nav-link" :class="{ active: route.path === '/about' }">About</a>
      </nav>

      <div class="header-actions">
        <button
          id="theme-toggle-btn"
          class="theme-toggle"
          :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
          :title="`Switch to ${theme === 'dark' ? 'light encyclopedic' : 'dark documentary'} theme`"
          @click="$emit('toggle-theme')"
        >
          <span v-if="theme === 'dark'" class="theme-icon">☀</span>
          <span v-else class="theme-icon">☽</span>
          <span class="theme-label">{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})
defineEmits(['toggle-theme'])
const route = useRoute()
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: background var(--transition-slow), border-color var(--transition-slow);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  height: 64px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 1.5rem;
  line-height: 1;
  color: var(--accent-primary);
  filter: drop-shadow(0 0 8px var(--accent-primary));
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.05em;
}

.logo-sub {
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 400;
  color: var(--accent-primary);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

/* Nav */
.header-nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
}

.nav-link {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: all var(--transition-fast);
}

.nav-link:hover,
.nav-link.active {
  color: var(--text-primary);
  background: var(--bg-surface-2);
}

.nav-link.active {
  color: var(--accent-primary);
}

/* Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
}

/* Theme toggle */
.theme-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.theme-toggle:hover {
  background: var(--bg-surface-3);
  color: var(--text-primary);
  border-color: var(--border-strong);
}

.theme-icon {
  font-size: 1rem;
  line-height: 1;
}

.theme-label {
  font-weight: 500;
  letter-spacing: 0.03em;
}

/* Responsive */
@media (max-width: 640px) {
  .theme-label {
    display: none;
  }
  .header-nav {
    gap: 0;
  }
  .nav-link {
    padding: var(--space-2) var(--space-3);
  }
}
</style>
