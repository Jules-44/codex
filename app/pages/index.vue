<template>
  <div class="timeline-page">
    <!-- Hero section -->
    <section class="hero" aria-label="Page hero">
      <div class="hero-inner container">
        <div class="hero-content">
          <div class="hero-eyebrow">1900 — Present</div>
          <h1 class="hero-title">Every War.<br>Every Nation.</h1>
          <p class="hero-subtitle">
            A comprehensive record of armed conflict across the modern era —
            from the world wars that reshaped global borders to the forgotten conflicts
            that defined modern history.
          </p>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">{{ wars.length }}</span>
              <span class="stat-label">Conflicts recorded</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-number">{{ ongoingCount }}</span>
              <span class="stat-label">Currently ongoing</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-number">7</span>
              <span class="stat-label">Regions covered</span>
            </div>
          </div>
        </div>
        <div class="hero-decoration" aria-hidden="true">
          <div class="deco-line"></div>
          <div class="deco-year">2024</div>
          <div class="deco-line"></div>
          <div class="deco-year deco-year--mid">1960</div>
          <div class="deco-line"></div>
          <div class="deco-year">1900</div>
        </div>
      </div>
    </section>

    <!-- Filter bar -->
    <FilterBar
      :selected-region="selectedRegion"
      :selected-type="selectedType"
      :selected-major-only="selectedMajorOnly"
      :selected-casualty-scale="selectedCasualtyScale"
      :view-mode="viewMode"
      :result-count="filteredWars.length"
      @update:region="selectedRegion = $event"
      @update:type="selectedType = $event"
      @update:majorOnly="selectedMajorOnly = $event"
      @update:casualtyScale="selectedCasualtyScale = $event"
      @update:viewMode="viewMode = $event"
      @reset="resetFilters"
    />

    <!-- Timeline Content -->
    <section class="timeline-section" aria-label="War timeline">
      <div class="container">
        <div v-if="filteredWars.length === 0" class="no-results">
          <p>No conflicts match the current filters.</p>
          <button class="btn btn--ghost" @click="resetFilters">Reset filters</button>
        </div>

        <!-- Mode A: Parallel Stream View -->
        <ParallelTimeline
          v-else-if="viewMode === 'parallel'"
          :wars="filteredWars"
          @select="openModal"
        />

        <!-- Mode B: Cards Grid View -->
        <template v-else>
          <div v-for="decade in decadesWithWars" :key="decade.label" class="decade-block">
            <div class="decade-header">
              <div class="decade-line"></div>
              <h2 class="decade-label">{{ decade.label }}</h2>
              <div class="decade-line"></div>
              <span class="decade-count">{{ decade.wars.length }}</span>
            </div>

            <div class="wars-grid">
              <WarCard
                v-for="war in decade.wars"
                :key="war.id"
                :war="war"
                class="war-card-animate"
                @select="openModal"
              />
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- War detail modal -->
    <WarModal :war="selectedWar" @close="closeModal" />
  </div>
</template>

<script setup>
import warsData from '~/content/wars.json'

useHead({
  title: 'Timeline',
  meta: [
    { name: 'description', content: 'Browse the complete timeline of armed conflicts from 1950 to the present day, filterable by region and conflict type.' }
  ]
})

const wars = warsData

const selectedRegion = ref('all')
const selectedType = ref('all')
const selectedMajorOnly = ref(false)
const selectedCasualtyScale = ref('all')
const viewMode = ref('parallel')
const selectedWar = ref(null)

const ongoingCount = computed(() => wars.filter(w => w.status === 'ongoing').length)

const filteredWars = computed(() => {
  return wars.filter(war => {
    const regionMatch = selectedRegion.value === 'all' || war.region === selectedRegion.value
    const typeMatch = selectedType.value === 'all' || war.type === selectedType.value
    const majorMatch = !selectedMajorOnly.value || war.is_major

    // Casualty scale check
    let casualtyMatch = true
    const casNum = war.total_casualties_num || 0
    if (selectedCasualtyScale.value === 'under10k') {
      casualtyMatch = casNum < 10000
    } else if (selectedCasualtyScale.value === '10k-100k') {
      casualtyMatch = casNum >= 10000 && casNum <= 100000
    } else if (selectedCasualtyScale.value === '100k-1m') {
      casualtyMatch = casNum > 100000 && casNum <= 1000000
    } else if (selectedCasualtyScale.value === 'over1m') {
      casualtyMatch = casNum > 1000000
    }

    return regionMatch && typeMatch && majorMatch && casualtyMatch
  })
})

// Group filtered wars by decade, most recent first
const decadesWithWars = computed(() => {
  const decadeMap = {}

  filteredWars.value.forEach(war => {
    const year = parseInt(war.start_date?.split('-')[0] || '1900')
    const decade = Math.floor(year / 10) * 10
    const label = `${decade}s`
    if (!decadeMap[label]) decadeMap[label] = []
    decadeMap[label].push(war)
  })

  // Sort wars within each decade by start date (newest first)
  Object.keys(decadeMap).forEach(decade => {
    decadeMap[decade].sort((a, b) => {
      const dateA = a.start_date || '0000'
      const dateB = b.start_date || '0000'
      return dateB.localeCompare(dateA)
    })
  })

  // Return decades sorted newest first
  return Object.keys(decadeMap)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .map(label => ({ label, wars: decadeMap[label] }))
})

function openModal(war) {
  selectedWar.value = war
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  selectedWar.value = null
  document.body.style.overflow = ''
}

function resetFilters() {
  selectedRegion.value = 'all'
  selectedType.value = 'all'
  selectedMajorOnly.value = false
  selectedCasualtyScale.value = 'all'
}
</script>

<style scoped>
/* ---- Hero ---- */
.hero {
  padding: var(--space-16) 0 var(--space-12);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 70% 50%, var(--accent-primary-dim) 0%, transparent 60%);
  opacity: 0.08;
  pointer-events: none;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-12);
  align-items: center;
}

.hero-eyebrow {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--accent-primary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1.1;
  letter-spacing: 0.02em;
  margin-bottom: var(--space-5);
  animation: fadeInUp 0.6s ease both;
}

.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: var(--space-8);
  animation: fadeInUp 0.6s 0.1s ease both;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  animation: fadeInUp 0.6s 0.2s ease both;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-number {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--accent-primary);
  line-height: 1;
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-default);
}

/* Decoration */
.hero-decoration {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  opacity: 0.3;
  animation: fadeIn 1s 0.3s ease both;
}

.deco-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, transparent, var(--accent-primary), transparent);
}

.deco-year {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  color: var(--accent-primary);
  letter-spacing: 0.1em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.deco-year--mid {
  font-size: var(--text-xs);
  opacity: 0.6;
}

/* ---- Timeline ---- */
.timeline-section {
  padding: var(--space-12) 0 var(--space-20);
}

/* Decade block */
.decade-block {
  margin-bottom: var(--space-12);
}

.decade-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.decade-line {
  flex: 1;
  height: 1px;
  background: var(--timeline-line);
}

.decade-label {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 900;
  color: var(--decade-label);
  white-space: nowrap;
  letter-spacing: 0.05em;
}

.decade-count {
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 2px var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-weight: 600;
  flex-shrink: 0;
}

/* Wars grid */
.wars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-4);
}

/* Card animation */
.war-card-animate {
  animation: fadeInUp 0.4s ease both;
}

/* No results */
.no-results {
  text-align: center;
  padding: var(--space-20);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }
  .hero-decoration {
    display: none;
  }
  .wars-grid {
    grid-template-columns: 1fr;
  }
  .hero-stats {
    gap: var(--space-4);
  }
}
</style>
