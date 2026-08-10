<template>
  <div :data-theme="theme">
    <AppHeader :theme="theme" @toggle-theme="toggleTheme" />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
const theme = ref('dark')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

// Persist theme in localStorage
onMounted(() => {
  const saved = localStorage.getItem('cow-theme')
  if (saved) theme.value = saved
})

watch(theme, (val) => {
  localStorage.setItem('cow-theme', val)
})
</script>

<style>
[data-theme] {
  min-height: 100vh;
  background-color: var(--bg-base);
  color: var(--text-primary);
  transition: background-color 0.4s ease, color 0.4s ease;
}
</style>
