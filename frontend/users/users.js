const API_URL = "http://localhost:3000/users";

// Funções para exibir e ocultar mensagens
function showMessage(message, type, formId) {
  const userMessage = document.querySelector(`${formId} #userMessage`);
  userMessage.style.display = "block";
  userMessage.textContent = message;
  userMessage.className = `message ${type}`;
}

function hideMessage(formId) {
  const userMessage = document.querySelector(`${formId} #userMessage`);
  userMessage.style.display = "none";
  userMessage.textContent = "";
  userMessage.className = "";
}

// Aguarda o DOM carregar antes de adicionar os eventos
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Alterna para o formulário de cadastro
  document.getElementById("showRegister").addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    hideMessage("#loginForm");
  });

  // Alterna para o formulário de login
  document.getElementById("showLogin").addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    hideMessage("#registerForm");
  });

  // Login
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage("#loginForm");

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salva o token no localStorage
        localStorage.setItem("token", data.token);

        // Exibe mensagem de sucesso
        showMessage(`Login bem-sucedido! Bem-vindo, ${data.name}.`, "success", "#loginForm");

        // Redireciona após o login bem-sucedido
        setTimeout(() => {
          window.location.href = "../catalogs/catalogs.html"; // Altere para a página desejada
        }, 2000);
      } else {
        // Exibe mensagem de erro
        showMessage(data.message || "Falha no login.", "error", "#loginForm");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      showMessage("Erro interno no servidor.", "error", "#loginForm");
    }
  });

  // Cadastro
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage("#registerForm");

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Exibe mensagem de sucesso
        showMessage("Cadastro realizado com sucesso! Faça login.", "success", "#registerForm");

        // Alterna para o formulário de login
        setTimeout(() => {
          registerForm.style.display = "none";
          loginForm.style.display = "block";
          hideMessage("#registerForm");
        }, 2000);
      } else {
        // Exibe mensagem de erro
        showMessage(data.message || "Falha no cadastro.", "error", "#registerForm");
      }
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      showMessage("Erro interno no servidor.", "error", "#registerForm");
    }
  });
});