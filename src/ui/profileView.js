export const createProfileView = (
  {
    identity,
    xpSummary,
    progressSummary,
    skillSummary,
    lineChart,
    barChart,
    radarChart,
    skillProgressChart,
    auditChart,
  },
  { onLogout, onRefresh },
) => {
  const section = document.createElement('section');
  section.className = 'profile-shell';
  const featured = identity.featuredProject
    ? `${identity.featuredProject.name} (${identity.featuredProject.type})`
    : 'Pending';

  const passRate = progressSummary.total
    ? Math.round((progressSummary.pass / progressSummary.total) * 100)
    : 0;

  const xpListMarkup =
    xpSummary.xpByProject.length > 0
      ? xpSummary.xpByProject
          .slice(0, 6)
          .map(
            (item) => `
              <li>
                <span>${item.label}</span>
                <span>${item.value.toLocaleString()} XP</span>
              </li>
            `,
          )
          .join('')
      : '<li class="muted">No XP recorded yet.</li>';

  section.innerHTML = `
    <header class="profile-header card">
      <div>
        <p class="eyebrow">Logged in as</p>
        <h1>${identity.displayName}</h1>
        <p class="muted">@${identity.login} · ID ${identity.userId ?? 'n/a'}</p>
      </div>
      <div class="header-actions">
        <button type="button" data-refresh>Refresh data</button>
        <button type="button" class="ghost" data-logout>Log out</button>
      </div>
    </header>

    <div class="stats-grid">
      <article class="card">
        <p class="eyebrow">Total XP</p>
        <p class="stat">${xpSummary.totalXp.toLocaleString()} XP</p>
      </article>
      <article class="card">
        <p class="eyebrow">Pass rate</p>
        <p class="stat">${passRate}%</p>
      </article>
      <article class="card">
        <p class="eyebrow">Featured project</p>
        <p>${featured}</p>
      </article>
    </div>

    <section class="card responsive-grid">
      <div>
        <div class="section-heading">
          <p class="eyebrow">Audits</p>
          <h2>Done vs Received</h2>
          <p class="muted">Audit workload balance and ratio</p>
        </div>
        <div class="chart chart-progress" data-audit-chart></div>
      </div>
      <div>
        <div class="section-heading">
          <p class="eyebrow">Timeline</p>
          <h2>XP progression</h2>
          <p class="muted">Cumulative XP growth across your activity</p>
        </div>
        <div class="chart" data-line-chart></div>
      </div>
    </section>

    <section class="card responsive-grid">
      <div>
        <div class="section-heading">
          <p class="eyebrow">Projects</p>
          <h2>XP by project</h2>
          <p class="muted">Top contributors to your total XP</p>
        </div>
        <div class="chart chart-bar" data-bar-chart></div>
      </div>
      <div>
        <div class="section-heading">
          <p class="eyebrow">Skills</p>
          <h2>Technical radar</h2>
          <p class="muted">
            Relative strengths across your top ${skillSummary.topSkills.length || 0} skills
          </p>
        </div>
        <div class="chart chart-radar" data-radar-chart></div>
      </div>
    </section>

    <section class="card">
      <div class="section-heading">
        <p class="eyebrow">Skills</p>
        <h2>Depth by skill</h2>
        <p class="muted">Normalized XP across your leading technologies</p>
      </div>
      <div class="chart chart-progress" data-progress-chart></div>
    </section>

    <section class="card">
      <div class="section-heading">
        <p class="eyebrow">Breakdown</p>
        <h2>XP by project</h2>
      </div>
      <ul class="xp-list">
        ${xpListMarkup}
      </ul>
    </section>
  `;

  section.querySelector('[data-line-chart]')?.appendChild(lineChart);
  section.querySelector('[data-bar-chart]')?.appendChild(barChart);
  section.querySelector('[data-radar-chart]')?.appendChild(radarChart);
  section.querySelector('[data-progress-chart]')?.appendChild(skillProgressChart);
  section.querySelector('[data-audit-chart]')?.appendChild(auditChart);

  section.querySelector('[data-logout]')?.addEventListener('click', () => onLogout?.());
  section.querySelector('[data-refresh]')?.addEventListener('click', () => onRefresh?.());

  return section;
};
