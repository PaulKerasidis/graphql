import './styles.css';
import { APP_TITLE } from './constants.js';
import { loadSession, saveSession, clearSession } from './state.js';
import { signin } from './services/auth.js';
import { fetchCurrentUser, fetchProfileDataset } from './services/profile.js';
import { buildIdentitySummary, summarizeXp, summarizeProgress } from './dataTransforms.js';
import { createLineChart, createDonutChart } from './charts.js';
import { createLoginView } from './ui/loginView.js';
import { createProfileView } from './ui/profileView.js';

const root = document.getElementById('app');
let session = loadSession();
let currentView = null;

document.title = APP_TITLE;

const swapView = (element) => {
  root.innerHTML = '';
  currentView = element;
  root.appendChild(element);
};

const renderLoading = (message = 'Loading…') => {
  const card = document.createElement('section');
  card.className = 'card auth-card';
  card.innerHTML = `<h2>${message}</h2>`;
  swapView(card);
};

const renderError = (message, actionLabel, actionHandler) => {
  const card = document.createElement('section');
  card.className = 'card auth-card';
  card.innerHTML = `
    <h2>Something went wrong</h2>
    <p class="muted">${message}</p>
    ${actionLabel ? `<button type="button">${actionLabel}</button>` : ''}
  `;

  const button = card.querySelector('button');
  if (button) {
    button.addEventListener('click', () => actionHandler?.());
  }

  swapView(card);
};

const handleLogout = () => {
  session = { token: null, userId: null, login: null };
  clearSession();
  renderLogin();
};

const loadDashboard = async () => {
  renderLoading('Fetching your profile…');
  try {
    const currentUser = await fetchCurrentUser(session.token);
    if (!currentUser?.id) {
      throw new Error('Unable to identify the authenticated user.');
    }

    session = { ...session, userId: currentUser.id, login: currentUser.login };
    saveSession(session);

    const dataset = await fetchProfileDataset({ userId: currentUser.id, token: session.token });
    const identity = buildIdentitySummary(currentUser, dataset.featuredProject);
    const xpSummary = summarizeXp(dataset.xpTransactions);
    const progressSummary = summarizeProgress(dataset.progress);
    const lineChart = createLineChart(xpSummary.timeline);
    const donutChart = createDonutChart(progressSummary.chartData);

    const profileView = createProfileView(
      { identity, xpSummary, progressSummary, lineChart, donutChart },
      { onLogout: handleLogout, onRefresh: loadDashboard },
    );

    swapView(profileView);
  } catch (error) {
    console.error(error);
    renderError(error.message, 'Back to login', handleLogout);
  }
};

const handleLogin = async ({ identifier, password }) => {
  const auth = await signin(identifier, password);
  session = {
    token: auth.token,
    userId: auth.payload?.id ?? auth.payload?.user_id ?? null,
    login: auth.payload?.login ?? identifier,
  };
  saveSession(session);
  await loadDashboard();
};

const renderLogin = () => {
  const loginView = createLoginView({ onSubmit: handleLogin });
  swapView(loginView);
};

const bootstrap = async () => {
  if (session?.token) {
    await loadDashboard();
  } else {
    renderLogin();
  }
};

bootstrap();
