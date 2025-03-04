// Toggle between Login and Register pages
document.getElementById("show-register").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("login-page").style.display = "none";
  document.getElementById("register-page").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("register-page").style.display = "none";
  document.getElementById("login-page").style.display = "block";
});

// Handle Login
async function login(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
    const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert(data.message);
    }
}

document.getElementById("login-form").addEventListener("submit", login);

// Handle Registration
async function register(event) {
    event.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    
    const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Registration successful!");
        window.location.href = "dashboard.html";
    } else {
        alert(data.message);
    }
}

document.getElementById("register-form").addEventListener("submit", register);

// Google OAuth Login
document.getElementById("google-login").addEventListener("click", function () {
    window.location.href = "http://localhost:5000/auth/google";
});

document.getElementById("google-register").addEventListener("click", function () {
    window.location.href = "http://localhost:5000/auth/google";
});