const safeJsonParse = (value) => {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return {};
  }
};

const formatDateLabel = (isoString) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (error) {
    return isoString;
  }
};

export const buildIdentitySummary = (user, featuredProject) => {
  if (!user) {
    return {
      displayName: 'Unknown student',
      login: 'n/a',
      userId: null,
      featuredProject: null,
    };
  }

  const attrs = safeJsonParse(user.attrs);
  const displayName = [attrs.firstName, attrs.lastName].filter(Boolean).join(' ') || attrs.fullName;

  return {
    displayName: displayName || user.login,
    login: user.login,
    userId: user.id,
    featuredProject,
  };
};

export const summarizeXp = (transactions = []) => {
  const totalXp = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const timelineMap = new Map();
  const projectMap = new Map();

  transactions.forEach((tx) => {
    if (!tx) return;
    const dateKey = tx.createdAt?.slice(0, 10);
    if (dateKey) {
      timelineMap.set(dateKey, (timelineMap.get(dateKey) || 0) + tx.amount);
    }

    const projectLabel = tx.object?.name || tx.path || `Object #${tx.objectId}`;
    projectMap.set(projectLabel, (projectMap.get(projectLabel) || 0) + tx.amount);
  });

  const timeline = Array.from(timelineMap.entries())
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, value]) => ({ label: formatDateLabel(date), value }));

  const xpByProject = Array.from(projectMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return {
    totalXp,
    timeline,
    xpByProject,
  };
};

export const summarizeProgress = (progress = []) => {
  let pass = 0;
  let fail = 0;

  progress.forEach((item) => {
    if (item.grade >= 1) pass += 1;
    else fail += 1;
  });

  return {
    pass,
    fail,
    total: pass + fail,
    chartData: [
      { label: 'Pass', value: pass, color: 'var(--green-500)' },
      { label: 'Fail', value: fail, color: 'var(--red-500)' },
    ],
    recent: progress.slice(0, 5).map((item) => ({
      id: item.id,
      grade: item.grade,
      name: item.object?.name || `Object #${item.objectId}`,
      dateLabel: formatDateLabel(item.createdAt),
    })),
  };
};
