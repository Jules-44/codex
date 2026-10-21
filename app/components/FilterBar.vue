<template>
  <div class="filter-bar" role="search" aria-label="Filter conflicts">
    <div class="filter-bar-inner container">
      <!-- Stats summary & View mode toggle -->
      <div class="filter-stats-mode">
        <div class="filter-stats">
          <span class="stats-count">{{ resultCount }}</span>
          <span class="stats-label">{{ resultCount === 1 ? 'conflict' : 'conflicts' }}</span>
        </div>

        <div class="view-mode-toggle" role="radiogroup" aria-label="Timeline view layout">
          <button
            id="view-mode-parallel"
            class="mode-btn"
            :class="{ active: viewMode === 'parallel' }"
            @click="$emit('update:viewMode', 'parallel')"
            title="Parallel Lines Timeline (Stream view)"
          >
            <span class="mode-icon">║║</span>
            <span class="mode-text">Parallel Lines</span>
          </button>
          <button
            id="view-mode-cards"
            class="mode-btn"
            :class="{ active: viewMode === 'cards' }"
            @click="$emit('update:viewMode', 'cards')"
            title="Card Grid by Decade"
          >
            <span class="mode-icon">▤</span>
            <span class="mode-text">Cards</span>
          </button>
        </div>
      </div>

      <!-- Region filter -->
      <div class="filter-group" role="group" aria-label="Filter by region">
        <span class="filter-label">Region</span>
        <div class="filter-chips" role="listbox" aria-label="Region filter options">
          <button
            id="filter-region-all"
            class="filter-chip"
            :class="{ active: selectedRegion === 'all' }"
            role="option"
            :aria-selected="selectedRegion === 'all'"
            @click="$emit('update:region', 'all')"
          >
            All
          </button>
          <button
            v-for="region in regions"
            :id="`filter-region-${region.value}`"
            :key="region.value"
            class="filter-chip filter-chip--region"
            :class="[`chip--${region.value}`, { active: selectedRegion === region.value }]"
            role="option"
            :aria-selected="selectedRegion === region.value"
            @click="$emit('update:region', region.value)"
          >
            <span class="chip-dot" :class="`dot--${region.value}`"></span>
            {{ region.label }}
          </button>
        </div>
      </div>

      <!-- Type filter -->
      <div class="filter-group" role="group" aria-label="Filter by conflict type">
        <span class="filter-label">Type</span>
        <div class="filter-chips" role="listbox" aria-label="Conflict type filter options">
          <button
            id="filter-type-all"
            class="filter-chip"
            :class="{ active: selectedType === 'all' }"
            role="option"
            :aria-selected="selectedType === 'all'"
            @click="$emit('update:type', 'all')"
          >
            All
          </button>
          <button
            v-for="type in conflictTypes"
            :id="`filter-type-${type.value}`"
            :key="type.value"
            class="filter-chip"
            :class="{ active: selectedType === type.value }"
            role="option"
            :aria-selected="selectedType === type.value"
            @click="$emit('update:type', type.value)"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- Major filter & Casualties scale -->
      <div class="filter-group filter-group--secondary" role="group" aria-label="Additional filters">
        <!-- Major toggle -->
        <button
          id="filter-major-toggle"
          class="filter-chip filter-chip--major"
          :class="{ active: selectedMajorOnly }"
          @click="$emit('update:majorOnly', !selectedMajorOnly)"
          title="Filter to major, world-altering conflicts"
        >
          <span class="major-star">⭐</span>
          Major Only
        </button>

        <!-- Casualty scale select -->
        <div class="casualty-select-wrapper">
          <span class="filter-label">Casualties</span>
          <select
            id="filter-casualties-select"
            class="filter-select"
            :value="selectedCasualtyScale"
            @change="$emit('update:casualtyScale', $event.target.value)"
          >
            <option value="all">All Tolls</option>
            <option value="under10k">&lt; 10,000</option>
            <option value="10k-100k">10,000 – 100,000</option>
            <option value="100k-1m">100,000 – 1,000,000</option>
            <option value="over1m">&gt; 1 Million</option>
          </select>
        </div>
      </div>

      <!-- Reset -->
      <button
        v-if="selectedRegion !== 'all' || selectedType !== 'all' || selectedMajorOnly || selectedCasualtyScale !== 'all'"
        id="filter-reset-btn"
        class="reset-btn"
        @click="$emit('reset')"
      >
        ✕ Reset
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedRegion: { type: String, default: 'all' },
  selectedType: { type: String, default: 'all' },
  selectedMajorOnly: { type: Boolean, default: false },
  selectedCasualtyScale: { type: String, default: 'all' },
  viewMode: { type: String, default: 'parallel' },
  resultCount: { type: Number, default: 0 }
})
defineEmits(['update:region', 'update:type', 'update:majorOnly', 'update:casualtyScale', 'update:viewMode', 'reset'])

const regions = [
  { value: 'middle-east', label: 'Middle East' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia-pacific', label: 'Asia-Pacific' },
  { value: 'africa', label: 'Africa' },
  { value: 'americas', label: 'Americas' },
  { value: 'central-asia', label: 'Central Asia' },
  { value: 'multi-regional', label: 'Multi-Regional' }
]

const conflictTypes = [
  { value: 'interstate', label: 'Interstate' },
  { value: 'civil', label: 'Civil War' },
  { value: 'insurgency', label: 'Insurgency' },
  { value: 'genocide', label: 'Genocide' },
  { value: 'colonial-independence', label: 'Independence' },
  { value: 'coup', label: 'Coup' }
]
</script>

<style scoped>
.filter-bar {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  padding: var(--space-4) 0;
  position: sticky;
  top: 64px;
  z-index: var(--z-dropdown);
  transition: background var(--transition-slow);
}

.filter-bar-inner {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex-wrap: wrap;
}

/* Stats & View Mode */
.filter-stats-mode {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-shrink: 0;
}

.filter-stats {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  flex-shrink: 0;
}

.stats-count {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--accent-primary);
  line-height: 1;
}

.stats-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-weight: 500;
}

.view-mode-toggle {
  display: flex;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 2px;
  gap: 2px;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px var(--space-3);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.mode-btn:hover {
  color: var(--text-primary);
}

.mode-btn.active {
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-weight: 600;
}

.mode-icon {
  font-weight: 700;
}

/* Filter groups */
.filter-group {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.filter-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Chips */
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px var(--space-3);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.filter-chip:hover {
  background: var(--bg-surface-3);
  color: var(--text-primary);
  border-color: var(--border-default);
}

.filter-chip.active {
  background: var(--accent-primary);
  color: var(--text-inverse);
  border-color: var(--accent-primary);
  font-weight: 600;
}

/* Region dots */
.chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot--middle-east { background: var(--region-middle-east); }
.dot--europe { background: var(--region-europe); }
.dot--asia-pacific { background: var(--region-asia-pacific); }
.dot--africa { background: var(--region-africa); }
.dot--americas { background: var(--region-americas); }
.dot--central-asia { background: var(--region-central-asia); }
.dot--multi-regional { background: var(--region-multi-regional); }

/* Major Chip */
.filter-chip--major {
  border-color: rgba(234, 179, 8, 0.4);
}
.filter-chip--major:hover {
  border-color: #eab308;
  color: #fef08a;
}
.filter-chip--major.active {
  background: linear-gradient(135deg, #ca8a04 0%, #a16207 100%);
  color: #ffffff;
  border-color: #eab308;
  box-shadow: 0 0 12px rgba(234, 179, 8, 0.3);
}
.major-star {
  font-size: 11px;
}

/* Casualty Select */
.casualty-select-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.filter-select {
  padding: 4px var(--space-3);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  outline: none;
  transition: all var(--transition-fast);
}

.filter-select:hover, .filter-select:focus {
  background: var(--bg-surface-3);
  color: var(--text-primary);
  border-color: var(--border-default);
}

/* Reset btn */
.reset-btn {
  padding: 4px var(--space-3);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-left: auto;
}

.reset-btn:hover {
  color: var(--accent-secondary-bright);
  border-color: var(--accent-secondary-bright);
}

@media (max-width: 768px) {
  .filter-bar-inner {
    gap: var(--space-3);
  }
  .filter-stats {
    display: none;
  }
}
</style>
