<template>
  <div class="about-page">
    <div class="container">
      <div class="about-inner">
        <div class="about-header">
          <div class="about-eyebrow">About this project</div>
          <h1 class="about-title">Chronicle of War</h1>
          <p class="about-lead">
            A comprehensive, living archive of every documented armed conflict since 1950 — from the wars that
            defined the Cold War era to the forgotten insurgencies that shaped nations the world rarely notices.
          </p>
        </div>

        <div class="about-content">
          <section class="about-section">
            <h2 class="section-heading">Mission</h2>
            <p>
              Chronicle of War exists to document the full scope of human conflict in the modern era.
              War is not just the story of great powers — it is the story of every nation,
              every people, every family caught in the machinery of armed conflict.
            </p>
            <p>
              This archive covers interstate wars, civil wars, insurgencies, colonial independence struggles,
              genocides, and proxy conflicts. If there were organised armed forces and documented casualties,
              it belongs here.
            </p>
          </section>

          <section class="about-section">
            <h2 class="section-heading">What's in scope</h2>
            <ul class="about-list">
              <li>Interstate wars (nation vs. nation)</li>
              <li>Civil wars and internal armed conflicts</li>
              <li>Colonial independence and liberation wars</li>
              <li>Insurgencies and guerrilla conflicts</li>
              <li>Proxy wars and covert conflicts</li>
              <li>Genocides and mass atrocities with military involvement</li>
              <li>Coups with significant armed conflict</li>
              <li>UN peacekeeping operations that became active conflicts</li>
            </ul>
          </section>

          <section class="about-section">
            <h2 class="section-heading">Phased development</h2>
            <p>This archive is being built in phases:</p>
            <div class="phase-list">
              <div class="phase-item phase-item--complete">
                <span class="phase-badge">Phase 1</span>
                <div>
                  <strong>Major conflicts (1950–present)</strong>
                  <p>The 27 most significant armed conflicts of the modern era, with countries, casualties, key events, and outcomes.</p>
                </div>
              </div>
              <div class="phase-item">
                <span class="phase-badge phase-badge--upcoming">Phase 2</span>
                <div>
                  <strong>Minor and regional conflicts</strong>
                  <p>Expanding to 100+ conflicts — guerrilla wars, smaller civil conflicts, and regional disputes.</p>
                </div>
              </div>
              <div class="phase-item">
                <span class="phase-badge phase-badge--upcoming">Phase 3</span>
                <div>
                  <strong>Obscure conflicts</strong>
                  <p>Full global exhaustiveness — every documented armed conflict since 1950, including those most of the world has never heard of.</p>
                </div>
              </div>
              <div class="phase-item">
                <span class="phase-badge phase-badge--upcoming">Phase 4</span>
                <div>
                  <strong>Full enrichment</strong>
                  <p>Detailed narratives, key figures, political context, aftermath, and source citations for every conflict.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="about-section">
            <h2 class="section-heading">Casualty figures</h2>
            <p>
              All casualty figures are estimates drawn from historical scholarship and may vary significantly
              between sources. Wars, particularly civil conflicts and genocides, often lack accurate records.
              Where ranges are reported, we use approximate totals clearly marked as estimates.
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'About',
  meta: [
    { name: 'description', content: 'About Chronicle of War — a comprehensive archive of every documented armed conflict since 1950.' }
  ]
})
</script>

<style scoped>
.about-page {
  padding: var(--space-16) 0 var(--space-20);
}

.about-inner {
  max-width: 720px;
  margin: 0 auto;
}

.about-eyebrow {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--accent-primary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}

.about-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: 0.02em;
  margin-bottom: var(--space-5);
  animation: fadeInUp 0.5s ease both;
}

.about-lead {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--space-12);
  animation: fadeInUp 0.5s 0.1s ease both;
}

.about-header {
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: var(--space-10);
  margin-bottom: var(--space-10);
}

.about-section {
  margin-bottom: var(--space-10);
}

.section-heading {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--accent-primary);
  display: inline-block;
}

.about-section p {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--space-4);
}

.about-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.about-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  border-left: 3px solid var(--accent-primary);
}

/* Phase list */
.phase-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.phase-item {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
  padding: var(--space-4) var(--space-5);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  opacity: 0.6;
}

.phase-item--complete {
  opacity: 1;
  border-color: var(--accent-primary);
}

.phase-badge {
  display: inline-block;
  padding: 4px var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--accent-primary);
  color: var(--text-inverse);
  flex-shrink: 0;
  margin-top: 2px;
}

.phase-badge--upcoming {
  background: var(--bg-surface-3);
  color: var(--text-muted);
}

.phase-item strong {
  display: block;
  color: var(--text-primary);
  font-size: var(--text-base);
  margin-bottom: var(--space-1);
}

.phase-item p {
  font-size: var(--text-sm) !important;
  color: var(--text-secondary) !important;
  margin: 0 !important;
}
</style>
