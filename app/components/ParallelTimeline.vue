<template>
  <div class="parallel-timeline-container">
    <!-- Header Legend & Controls -->
    <div class="timeline-legend">
      <div class="legend-title">Region Lines Legend</div>
      <div class="legend-items">
        <div v-for="r in regionLegend" :key="r.key" class="legend-item">
          <span class="legend-dot" :class="`dot--${r.key}`"></span>
          <span class="legend-text">{{ r.label }}</span>
        </div>
      </div>
    </div>

    <!-- Main Vertical Stream Canvas -->
    <div class="timeline-canvas" ref="canvasRef">
      <!-- Time Grid Axis (Decades & Years) -->
      <div class="time-axis">
        <div
          v-for="yearMark in decadeMarkers"
          :key="yearMark.year"
          class="decade-grid-row"
          :style="{ top: `${yearMark.top}px` }"
        >
          <div class="decade-marker-label">
            <span class="marker-year">{{ yearMark.year }}</span>
          </div>
          <div class="decade-grid-line"></div>
        </div>
      </div>

      <!-- Parallel Tracks Columns Layer -->
      <div class="tracks-wrapper" :style="{ height: `${totalCanvasHeight}px` }">
        <div
          v-for="item in processedWars"
          :key="item.war.id"
          class="war-stream-item"
          :class="[
            `region--${item.war.region}`,
            { 'is-hovered': hoveredWarId === item.war.id },
            { 'is-ongoing': item.war.status === 'ongoing' },
            { 'is-major': item.war.is_major }
          ]"
          :style="{
            top: `${item.top}px`,
            height: `${item.height}px`,
            left: `calc(${item.trackIndex * 210}px + 90px)`
          }"
          @mouseenter="hoveredWarId = item.war.id"
          @mouseleave="hoveredWarId = null"
          @click="$emit('select', item.war)"
          tabindex="0"
          role="button"
          :aria-label="`${item.war.name} (${item.dateLabel})`"
          @keyup.enter="$emit('select', item.war)"
        >
          <!-- Vertical Colored Line / Bar -->
          <div class="stream-line-bar" :style="{ backgroundColor: getRegionColor(item.war.region) }">
            <span v-if="item.war.status === 'ongoing'" class="stream-pulse-dot"></span>
            <span v-else class="stream-cap-dot"></span>
          </div>

          <!-- Label Card -->
          <div class="stream-card-content">
            <div class="stream-war-header">
              <span class="stream-region-tag" :style="{ color: getRegionColor(item.war.region) }">
                {{ regionLabel(item.war.region) }}
              </span>
              <span class="stream-dates">{{ item.dateLabel }}</span>
            </div>
            <div class="stream-war-title">
              <span v-if="item.war.is_major" class="stream-star" title="Major Conflict">⭐</span>
              {{ item.war.name }}
            </div>
          </div>

          <!-- Hover Tooltip Popover -->
          <Transition name="popover-fade">
            <div v-if="hoveredWarId === item.war.id" class="stream-tooltip">
              <div class="tooltip-header">
                <span v-if="item.war.is_major" class="status-badge status-badge--major">⭐ Major</span>
                <span class="region-badge" :class="`region-badge--${item.war.region}`">
                  {{ regionLabel(item.war.region) }}
                </span>
                <span class="type-badge">{{ item.war.type }}</span>
                <span v-if="item.war.status === 'ongoing'" class="status-badge status-badge--ongoing">
                  <span class="status-dot"></span> Ongoing
                </span>
              </div>
              <h4 class="tooltip-title">{{ item.war.name }}</h4>
              <div class="tooltip-dates">📅 {{ item.dateLabel }}</div>
              <p class="tooltip-desc">{{ truncate(item.war.short_description, 140) }}</p>
              <div v-if="item.war.casualties?.total_estimate" class="tooltip-casualties">
                💀 Est. Casualties: <strong>{{ item.war.casualties.total_estimate }}</strong>
              </div>
              <div class="tooltip-cta">Click for full record & events →</div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  wars: {
    type: Array,
    required: true
  }
})
defineEmits(['select'])

const hoveredWarId = ref(null)

const START_YEAR = 1900
const END_YEAR = 2026
const YEAR_PX = 32 // 32px per year

const totalCanvasHeight = computed(() => (END_YEAR - START_YEAR + 2) * YEAR_PX)

const regionLegend = [
  { key: 'middle-east', label: 'Middle East' },
  { key: 'europe', label: 'Europe' },
  { key: 'asia-pacific', label: 'Asia-Pacific' },
  { key: 'africa', label: 'Africa' },
  { key: 'americas', label: 'Americas' },
  { key: 'central-asia', label: 'Central Asia' },
  { key: 'multi-regional', label: 'Multi-Regional' }
]

const decadeMarkers = computed(() => {
  const markers = []
  for (let yr = END_YEAR; yr >= START_YEAR; yr -= 5) {
    const top = (END_YEAR - yr) * YEAR_PX
    markers.push({ year: yr, top })
  }
  return markers
})

// Helper to convert date string "YYYY-MM-DD" to fractional year
function parseDecimalYear(dateStr, fallbackYear) {
  if (!dateStr) return fallbackYear
  const parts = dateStr.split('-')
  const yr = parseInt(parts[0]) || fallbackYear
  const mo = parts[1] ? (parseInt(parts[1]) - 1) / 12 : 0
  return yr + mo
}

// Process wars, calculate top/height, and assign non-overlapping parallel tracks
const processedWars = computed(() => {
  if (!props.wars || !props.wars.length) return []

  // Map wars to time bounds
  const mapped = props.wars.map(war => {
    const startYr = parseDecimalYear(war.start_date, 1900)
    const endYr = war.status === 'ongoing' || !war.end_date
      ? END_YEAR
      : parseDecimalYear(war.end_date, startYr + 0.5)

    // Calculate Y pixel bounds (top = distance from END_YEAR)
    const top = Math.max(0, (END_YEAR - endYr) * YEAR_PX)
    const rawHeight = (endYr - startYr) * YEAR_PX
    const height = Math.max(rawHeight, 48) // Minimum height so short wars are clearly visible

    const startYearStr = war.start_date ? war.start_date.split('-')[0] : '1950'
    const endYearStr = war.end_date ? war.end_date.split('-')[0] : (war.status === 'ongoing' ? 'present' : startYearStr)
    const dateLabel = startYearStr === endYearStr ? startYearStr : `${startYearStr}–${endYearStr}`

    return {
      war,
      startYr,
      endYr,
      top,
      height,
      dateLabel,
      trackIndex: 0
    }
  })

  // Sort by startYr ascending (oldest to newest) or top ascending
  mapped.sort((a, b) => b.startYr - a.startYr)

  // Track assignment algorithm for parallel columns
  const tracks = [] // stores end position (bottom Y) of last item in each track

  mapped.forEach(item => {
    const itemTop = item.top
    const itemBottom = item.top + item.height

    let assignedTrack = -1

    // Find the first track where previous item's bottom is higher than itemTop (no overlap)
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i] <= itemTop + 4) { // 4px margin
        assignedTrack = i;
        break;
      }
    }

    if (assignedTrack === -1) {
      assignedTrack = tracks.length
      tracks.push(itemBottom)
    } else {
      tracks[assignedTrack] = itemBottom
    }

    item.trackIndex = assignedTrack
  })

  return mapped
})

function getRegionColor(region) {
  const colors = {
    'middle-east': '#e07b3a',
    'europe': '#4a7fcf',
    'asia-pacific': '#3aad6e',
    'africa': '#d4a017',
    'americas': '#c0392b',
    'central-asia': '#9b59b6',
    'multi-regional': '#7f8c8d'
  }
  return colors[region] || '#c9a84c'
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

function truncate(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '…'
}
</script>

<style scoped>
.parallel-timeline-container {
  position: relative;
  width: 100%;
  padding-top: var(--space-4);
}

/* Legend */
.timeline-legend {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  padding: var(--space-3) var(--space-5);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-6);
}

.legend-title {
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.legend-items {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot--middle-east { background: #e07b3a; }
.dot--europe { background: #4a7fcf; }
.dot--asia-pacific { background: #3aad6e; }
.dot--africa { background: #d4a017; }
.dot--americas { background: #c0392b; }
.dot--central-asia { background: #9b59b6; }
.dot--multi-regional { background: #7f8c8d; }

/* Canvas */
.timeline-canvas {
  position: relative;
  width: 100%;
  overflow-x: auto;
  min-height: 800px;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-6) 0;
}

/* Time Axis Grid */
.time-axis {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decade-grid-row {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-left: var(--space-4);
}

.decade-marker-label {
  width: 60px;
  flex-shrink: 0;
}

.marker-year {
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--accent-primary-dim);
  letter-spacing: 0.05em;
  background: var(--bg-base);
  padding: 2px 4px;
  border-radius: 4px;
}

.decade-grid-line {
  flex: 1;
  height: 1px;
  background: rgba(201, 168, 76, 0.08);
}

/* Tracks Layer */
.tracks-wrapper {
  position: relative;
  min-width: 1100px;
}

/* War Stream Item */
.war-stream-item {
  position: absolute;
  width: 195px;
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  cursor: pointer;
  z-index: var(--z-base);
  transition: transform var(--transition-fast), z-index 0.1s;
  outline: none;
}

.war-stream-item:hover,
.war-stream-item.is-hovered {
  z-index: var(--z-dropdown);
}

/* Vertical Bar Line */
.stream-line-bar {
  width: 6px;
  height: 100%;
  border-radius: 3px;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
  transition: width var(--transition-fast), box-shadow var(--transition-fast);
}

.war-stream-item:hover .stream-line-bar {
  width: 10px;
  box-shadow: 0 0 16px currentColor;
}

.stream-cap-dot {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.stream-pulse-dot {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 10px #4ade80;
  animation: pulse 1.8s infinite;
}

/* Card Content */
.stream-card-content {
  flex: 1;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  transition: all var(--transition-fast);
  backdrop-filter: blur(8px);
}

.war-stream-item:hover .stream-card-content {
  background: var(--bg-surface-2);
  border-color: var(--border-strong);
  transform: translateX(2px);
  box-shadow: var(--shadow-md);
}

.stream-war-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: 2px;
}

.stream-region-tag {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.stream-dates {
  font-family: var(--font-heading);
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.stream-war-title {
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  word-break: break-word;
}

/* Tooltip Popover */
.stream-tooltip {
  position: absolute;
  top: max(-10px, 0px);
  left: calc(100% + 12px);
  width: 280px;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-xl);
  z-index: var(--z-modal);
  pointer-events: none;
  backdrop-filter: blur(12px);
}

.tooltip-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  margin-bottom: var(--space-2);
}

.status-badge--major {
  color: #fef08a;
  background: rgba(202, 138, 4, 0.2);
  border: 1px solid rgba(234, 179, 8, 0.4);
}

.stream-star {
  font-size: 11px;
  margin-right: 2px;
}

.tooltip-title {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.tooltip-dates {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: var(--space-3);
}

.tooltip-desc {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-3);
}

.tooltip-casualties {
  font-size: var(--text-xs);
  color: var(--accent-secondary-bright);
  padding-top: var(--space-2);
  border-top: 1px solid var(--border-subtle);
  margin-bottom: var(--space-2);
}

.tooltip-cta {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
