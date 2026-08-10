<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="backdrop-fade">
      <div
        v-if="war"
        id="war-modal-backdrop"
        class="modal-backdrop"
        aria-hidden="true"
        @click="$emit('close')"
      ></div>
    </Transition>

    <!-- Slide-over panel -->
    <Transition name="panel-slide">
      <aside
        v-if="war"
        id="war-modal-panel"
        class="war-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Details: ${war.name}`"
        @keyup.esc="$emit('close')"
        tabindex="-1"
      >
        <!-- Accent bar -->
        <div class="modal-accent-bar" :class="`accent-bar--${war.region}`"></div>

        <!-- Header -->
        <div class="modal-header">
          <div class="modal-badges">
            <span class="region-badge" :class="`region-badge--${war.region}`">
              {{ regionLabel(war.region) }}
            </span>
            <span class="type-badge">{{ typeLabel(war.type) }}</span>
            <span v-if="war.status === 'ongoing'" class="status-badge status-badge--ongoing">
              <span class="status-dot"></span>
              Ongoing
            </span>
          </div>
          <button
            id="war-modal-close-btn"
            class="modal-close"
            aria-label="Close panel"
            @click="$emit('close')"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable body -->
        <div class="modal-body">
          <!-- Title & dates -->
          <div class="modal-title-section">
            <h2 class="modal-title">{{ war.name }}</h2>
            <p v-if="war.alternate_names?.length" class="modal-alt-names">
              Also known as: {{ war.alternate_names.join(' · ') }}
            </p>
            <div class="modal-meta">
              <div class="meta-item">
                <span class="meta-label">Period</span>
                <span class="meta-value">{{ formatFullDates(war.start_date, war.end_date) }}</span>
              </div>
              <div v-if="war.casualties?.total_estimate" class="meta-item">
                <span class="meta-label">Est. Casualties</span>
                <span class="meta-value meta-value--casualties">{{ war.casualties.total_estimate }}</span>
              </div>
            </div>
          </div>

          <!-- Tab navigation -->
          <div class="modal-tabs" role="tablist">
            <button
              v-for="tab in tabs"
              :id="`modal-tab-${tab.id}`"
              :key="tab.id"
              class="modal-tab"
              :class="{ active: activeTab === tab.id }"
              role="tab"
              :aria-selected="activeTab === tab.id"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab: Overview -->
          <div v-if="activeTab === 'overview'" class="tab-content" role="tabpanel">
            <p class="modal-description">{{ war.short_description }}</p>

            <div v-if="war.outcome" class="modal-section">
              <h3 class="section-title">Outcome</h3>
              <p class="section-text">{{ war.outcome }}</p>
            </div>

            <div v-if="war.tags?.length" class="modal-section">
              <h3 class="section-title">Tags</h3>
              <div class="tag-list">
                <span v-for="tag in war.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- Tab: Countries -->
          <div v-if="activeTab === 'countries'" class="tab-content" role="tabpanel">
            <div v-if="war.countries?.side_a?.length" class="countries-section">
              <h3 class="section-title countries-title--a">Side A</h3>
              <ul class="countries-list">
                <li v-for="country in war.countries.side_a" :key="country" class="country-item country-item--a">
                  {{ country }}
                </li>
              </ul>
            </div>

            <div v-if="war.countries?.side_b?.length" class="countries-section">
              <h3 class="section-title countries-title--b">Side B</h3>
              <ul class="countries-list">
                <li v-for="country in war.countries.side_b" :key="country" class="country-item country-item--b">
                  {{ country }}
                </li>
              </ul>
            </div>

            <div v-if="war.countries?.neutral?.length" class="countries-section">
              <h3 class="section-title">Third Parties / Neutral</h3>
              <ul class="countries-list">
                <li v-for="country in war.countries.neutral" :key="country" class="country-item">
                  {{ country }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Tab: Casualties -->
          <div v-if="activeTab === 'casualties'" class="tab-content" role="tabpanel">
            <div class="casualties-grid">
              <div v-if="war.casualties?.total_estimate" class="casualty-card">
                <span class="casualty-number">{{ war.casualties.total_estimate }}</span>
                <span class="casualty-label">Total estimated</span>
              </div>
              <div v-if="war.casualties?.military" class="casualty-card">
                <span class="casualty-number">{{ war.casualties.military }}</span>
                <span class="casualty-label">Military</span>
              </div>
              <div v-if="war.casualties?.civilian" class="casualty-card">
                <span class="casualty-number">{{ war.casualties.civilian }}</span>
                <span class="casualty-label">Civilian</span>
              </div>
            </div>
            <p class="casualties-note">
              * Casualty figures are estimates from historical sources and may vary significantly. All figures include killed and, in many cases, wounded and missing.
            </p>
          </div>

          <!-- Tab: Events -->
          <div v-if="activeTab === 'events'" class="tab-content" role="tabpanel">
            <div v-if="war.sub_events?.length" class="events-list">
              <div v-for="event in war.sub_events" :key="event.id" class="event-item">
                <div class="event-header">
                  <div class="event-meta">
                    <span class="event-type-badge">{{ event.type }}</span>
                    <span class="event-date">{{ formatEventDate(event.date, event.end_date) }}</span>
                  </div>
                </div>
                <h4 class="event-name">{{ event.name }}</h4>
                <p v-if="event.location" class="event-location">📍 {{ event.location }}</p>
                <p class="event-description">{{ event.short_description }}</p>
              </div>
            </div>
            <div v-else class="no-events">
              <p>Detailed battle and campaign records for this conflict are coming in a future update.</p>
            </div>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  war: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['close'])

const activeTab = ref('overview')
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'countries', label: 'Countries' },
  { id: 'casualties', label: 'Casualties' },
  { id: 'events', label: 'Events' }
]

// Reset tab when war changes
watch(() => props.war, () => {
  activeTab.value = 'overview'
})

// Handle keyboard escape
onMounted(() => {
  document.addEventListener('keydown', handleKey)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKey)
})

function handleKey(e) {
  if (e.key === 'Escape' && props.war) emit('close')
}

function regionLabel(region) {
  const labels = {
    'middle-east': 'Middle East',
    'europe': 'Europe',
    'asia-pacific': 'Asia-Pacific',
    'africa': 'Africa',
    'americas': 'Americas',
    'central-asia': 'Central Asia',
    'multi-regional': 'Multi-Regional'
  }
  return labels[region] || region
}

function typeLabel(type) {
  const labels = {
    'interstate': 'Interstate War',
    'civil': 'Civil War',
    'insurgency': 'Insurgency',
    'genocide': 'Genocide',
    'colonial-independence': 'Independence War',
    'coup': 'Coup'
  }
  return labels[type] || type
}

function formatFullDates(start, end) {
  if (!start) return 'Unknown'
  const s = new Date(start)
  const startStr = s.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
  if (!end) return `${startStr} – present`
  const e = new Date(end)
  const endStr = e.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
  return `${startStr} – ${endStr}`
}

function formatEventDate(start, end) {
  if (!start) return ''
  const s = new Date(start).getFullYear()
  if (!end) return String(s)
  const e = new Date(end).getFullYear()
  return s === e ? String(s) : `${s}–${e}`
}
</script>

<style scoped>
/* Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--modal-backdrop);
  z-index: var(--z-overlay);
  backdrop-filter: blur(2px);
}

/* Panel */
.war-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(620px, 100vw);
  background: var(--modal-bg);
  border-left: 1px solid var(--border-default);
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: -8px 0 48px rgba(0, 0, 0, 0.5);
}

/* Accent bar */
.modal-accent-bar {
  height: 4px;
  flex-shrink: 0;
}
.accent-bar--middle-east { background: linear-gradient(90deg, var(--region-middle-east), transparent); }
.accent-bar--europe { background: linear-gradient(90deg, var(--region-europe), transparent); }
.accent-bar--asia-pacific { background: linear-gradient(90deg, var(--region-asia-pacific), transparent); }
.accent-bar--africa { background: linear-gradient(90deg, var(--region-africa), transparent); }
.accent-bar--americas { background: linear-gradient(90deg, var(--region-americas), transparent); }
.accent-bar--central-asia { background: linear-gradient(90deg, var(--region-central-asia), transparent); }
.accent-bar--multi-regional { background: linear-gradient(90deg, var(--region-multi-regional), transparent); }

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.modal-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: var(--bg-surface-3);
  color: var(--text-primary);
}

.modal-close svg {
  width: 18px;
  height: 18px;
}

/* Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
}

/* Title section */
.modal-title-section {
  margin-bottom: var(--space-6);
}

.modal-title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: var(--space-2);
  letter-spacing: 0.01em;
}

.modal-alt-names {
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: var(--space-4);
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.meta-value {
  font-size: var(--text-base);
  color: var(--text-primary);
  font-weight: 500;
}

.meta-value--casualties {
  color: var(--accent-secondary-bright);
  font-family: var(--font-heading);
}

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.status-badge--ongoing {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.25);
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

/* Tabs */
.modal-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: var(--space-6);
  gap: 0;
}

.modal-tab {
  padding: var(--space-3) var(--space-5);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: -1px;
}

.modal-tab:hover {
  color: var(--text-secondary);
}

.modal-tab.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
  font-weight: 600;
}

/* Tab content */
.tab-content {
  animation: fadeInUp 0.2s ease;
}

/* Overview */
.modal-description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--space-6);
}

.modal-section {
  margin-bottom: var(--space-6);
}

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

.section-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.7;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag {
  padding: 3px var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-weight: 500;
}

/* Countries tab */
.countries-section {
  margin-bottom: var(--space-6);
}

.countries-title--a { color: var(--region-americas); }
.countries-title--b { color: var(--region-europe); }

.countries-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.country-item {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-left: 3px solid;
}

.country-item--a { border-left-color: var(--region-americas); }
.country-item--b { border-left-color: var(--region-europe); }
.country-item:not(.country-item--a):not(.country-item--b) {
  border-left-color: var(--border-default);
}

/* Casualties tab */
.casualties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.casualty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-6) var(--space-4);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  text-align: center;
}

.casualty-number {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--accent-secondary-bright);
}

.casualty-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.casualties-note {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-style: italic;
  line-height: 1.6;
  padding: var(--space-4);
  background: var(--bg-surface-2);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

/* Events tab */
.events-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.event-item {
  padding: var(--space-4) var(--space-5);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--accent-primary);
}

.event-header {
  margin-bottom: var(--space-2);
}

.event-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.event-type-badge {
  display: inline-block;
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent-primary);
  background: var(--bg-surface-3);
  border: 1px solid var(--border-subtle);
}

.event-date {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-heading);
}

.event-name {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.event-location {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}

.event-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}

.no-events {
  text-align: center;
  padding: var(--space-12);
  color: var(--text-muted);
  font-style: italic;
}

/* Transitions */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity var(--transition-base);
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform var(--transition-slide), opacity 0.3s ease;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 640px) {
  .war-modal {
    width: 100vw;
    border-left: none;
    border-top: 1px solid var(--border-default);
  }
  .modal-title {
    font-size: var(--text-2xl);
  }
}
</style>
