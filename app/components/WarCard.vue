<template>
  <div class="war-card" :class="`war-card--${war.region}`" @click="$emit('select', war)" role="button" tabindex="0" :aria-label="`${war.name} - Click for details`" @keyup.enter="$emit('select', war)">
    <!-- Region color accent bar -->
    <div class="card-accent-bar" :class="`accent-bar--${war.region}`"></div>

    <div class="card-content">
      <!-- Header row -->
      <div class="card-header-row">
        <div class="card-badges">
          <span class="region-badge" :class="`region-badge--${war.region}`">
            {{ regionLabel(war.region) }}
          </span>
          <span class="type-badge">{{ typeLabel(war.type) }}</span>
          <span v-if="war.status === 'ongoing'" class="status-badge status-badge--ongoing">
            <span class="status-dot"></span>
            Ongoing
          </span>
        </div>
        <span class="card-dates">{{ formatDates(war.start_date, war.end_date) }}</span>
      </div>

      <!-- War name -->
      <h3 class="card-title">{{ war.name }}</h3>

      <!-- Countries summary -->
      <p class="card-countries">
        <span class="countries-label">Parties: </span>
        {{ formatCountries(war.countries) }}
      </p>

      <!-- Description preview -->
      <p class="card-description">{{ truncate(war.short_description, 120) }}</p>

      <!-- Footer row -->
      <div class="card-footer">
        <span v-if="war.casualties?.total_estimate" class="casualties-label">
          <svg class="casualties-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          {{ war.casualties.total_estimate }}
        </span>
        <span v-if="war.sub_events?.length" class="sub-events-label">
          {{ war.sub_events.length }} {{ war.sub_events.length === 1 ? 'event' : 'events' }}
        </span>
        <span class="card-cta">View details →</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  war: {
    type: Object,
    required: true
  }
})
defineEmits(['select'])

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
    'interstate': 'Interstate',
    'civil': 'Civil War',
    'insurgency': 'Insurgency',
    'genocide': 'Genocide',
    'colonial-independence': 'Independence War',
    'coup': 'Coup'
  }
  return labels[type] || type
}

function formatDates(start, end) {
  const startYear = start ? start.split('-')[0] : '?'
  if (!end) return `${startYear}–present`
  const endYear = end.split('-')[0]
  if (startYear === endYear) return startYear
  return `${startYear}–${endYear}`
}

function formatCountries(countries) {
  if (!countries) return ''
  const sideA = countries.side_a?.slice(0, 2).join(', ') || ''
  const sideB = countries.side_b?.slice(0, 2).join(', ') || ''
  let result = sideA
  if (sideB) result += ` vs. ${sideB}`
  const totalA = countries.side_a?.length || 0
  const totalB = countries.side_b?.length || 0
  const extra = (totalA + totalB) - 4
  if (extra > 0) result += ` +${extra} more`
  return result
}

function truncate(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '…'
}
</script>

<style scoped>
.war-card {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  will-change: transform;
}

.war-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-default);
  box-shadow: var(--shadow-lg);
}

.war-card:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* Accent bar */
.card-accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}
.accent-bar--middle-east { background: var(--region-middle-east); }
.accent-bar--europe { background: var(--region-europe); }
.accent-bar--asia-pacific { background: var(--region-asia-pacific); }
.accent-bar--africa { background: var(--region-africa); }
.accent-bar--americas { background: var(--region-americas); }
.accent-bar--central-asia { background: var(--region-central-asia); }
.accent-bar--multi-regional { background: var(--region-multi-regional); }

.card-content {
  padding: var(--space-5);
  padding-top: var(--space-4);
}

/* Header row */
.card-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.card-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}

.card-dates {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
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

/* Title */
.card-title {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.01em;
  margin-bottom: var(--space-2);
  line-height: 1.3;
  transition: color var(--transition-fast);
}

.war-card:hover .card-title {
  color: var(--accent-primary);
}

/* Countries */
.card-countries {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-3);
  line-height: 1.4;
}

.countries-label {
  font-weight: 600;
  color: var(--text-secondary);
}

/* Description */
.card-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-4);
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}

.casualties-label,
.sub-events-label {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-weight: 500;
}

.casualties-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.card-cta {
  margin-left: auto;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--accent-primary);
  letter-spacing: 0.05em;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.war-card:hover .card-cta {
  opacity: 1;
}
</style>
