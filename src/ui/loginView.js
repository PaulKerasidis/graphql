export const createLoginView = ({ onSubmit }) => {
  const section = document.createElement('section');
  section.className = 'card auth-card';
  section.innerHTML = `
    <h1>Zone01 Journey</h1>
    <p class="muted">Sign in with your campus credentials to explore your stats.</p>
    <form class="auth-form" novalidate>
      <label>
        Identifier (login or email)
        <input name="identifier" type="text" autocomplete="username" required placeholder="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" autocomplete="current-password" required placeholder="password" />
      </label>
      <button type="submit">Sign in</button>
      <p class="form-error" data-error hidden></p>
    </form>
  `;

  const form = section.querySelector('form');
  const submitButton = section.querySelector('button[type="submit"]');
  const errorBox = section.querySelector('[data-error]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.hidden = true;
    const formData = new FormData(form);
    const identifier = formData.get('identifier')?.trim();
    const password = formData.get('password');

    if (!identifier || !password) {
      errorBox.hidden = false;
      errorBox.textContent = 'Both fields are required.';
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Signing in…';

    try {
      await onSubmit({ identifier, password });
    } catch (error) {
      errorBox.hidden = false;
      errorBox.textContent = error.message;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Sign in';
    }
  });

  return section;
};
