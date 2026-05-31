const API_URL = 'http://localhost:5000/api';

function switchTab(tabName) {
  const forms = document.querySelectorAll('.form-group');
  const buttons = document.querySelectorAll('.tab-btn');
  
  forms.forEach(form => form.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('active'));

  if (tabName === 'login') {
    document.getElementById('loginForm').classList.add('active');
    buttons[0].classList.add('active');
  } else if (tabName === 'signup') {
    document.getElementById('signupForm').classList.add('active');
    buttons[1].classList.add('active');
  }
}

function showMessage(message, type) {
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = message;
  messageBox.className = `message-box ${type}`;
  setTimeout(() => {
    messageBox.className = 'message-box';
  }, 5000);
}

function showForgotPassword() {
  document.querySelectorAll('.form-group').forEach(form => form.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('forgotPasswordForm').classList.add('active');
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Login failed', 'error');
      return;
    }

    localStorage.setItem('token', data.token);
    showMessage('Login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = '/marketplace';
    }, 2000);
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('signupFullName').value;
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.errors?.[0]?.msg || data.message || 'Signup failed', 'error');
      return;
    }

    localStorage.setItem('token', data.token);
    showMessage('Account created! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = '/marketplace';
    }, 2000);
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  }
});

document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('forgotEmail').value;

  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Error sending reset email', 'error');
      return;
    }

    showMessage(data.message, 'success');
    setTimeout(() => {
      switchTab('login');
    }, 3000);
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  }
});
