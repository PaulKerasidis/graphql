export const createProfileView = (
  { identity, xpSummary, progressSummary, lineChart, donutChart },
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

  const recentMarkup =
    progressSummary.recent.length > 0
      ? progressSummary.recent
          .map(
            (item) => `
                <li>
                  <div>
                    <p>${item.name}</p>
                    <p class="muted">${item.dateLabel}</p>
                  </div>
                  <span class="pill ${item.grade >= 1 ? 'success' : 'danger'}">
                    ${item.grade >= 1 ? 'PASS' : 'FAIL'}
                  </span>
                </li>
              `,
          )
          .join('')
      : '<li class="muted">No recent progress available.</li>';

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

    <section class="card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Statistics</p>
          <h2>XP progression</h2>
        </div>
      </div>
      <div class="chart" data-line-chart></div>
    </section>

    <section class="card responsive-grid">
      <div>
        <div class="section-heading">
          <p class="eyebrow">Outcomes</p>
          <h2>Pass vs Fail</h2>
        </div>
        <div class="chart" data-donut-chart></div>
      </div>
      <div>
        <div class="section-heading">
          <p class="eyebrow">Latest progress</p>
          <h2>Recent grades</h2>
        </div>
        <ul class="recent-list">
          ${recentMarkup}
        </ul>
      </div>
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
  section.querySelector('[data-donut-chart]')?.appendChild(donutChart);

  section.querySelector('[data-logout]')?.addEventListener('click', () => onLogout?.());
  section.querySelector('[data-refresh]')?.addEventListener('click', () => onRefresh?.());

  return section;
};
