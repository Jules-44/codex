<template>
  <div class="filter-bar" role="search" aria-label="Filter conflicts">
    <div class="filter-bar-inner container">
      <!-- Stats summary -->
      <div class="filter-stats">
        <span class="stats-count">{{ resultCount }}</span>
        <span class="stats-label">{{ resultCount === 1 ? 'conflict' : 'conflicts' }}</span>
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

      <!-- Reset -->
      <button
        v-if="selectedRegion !== 'all' || selectedType !== 'all'"
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
  resultCount: { type: Number, default: 0 }
})
defineEmits(['update:region', 'update:type', 'reset'])

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

/* Stats */
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
