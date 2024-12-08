const API_URL = "http://localhost:3002/requests";

document.getElementById("orderForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const userId = document.getElementById("userId").value;
  const livroId = document.getElementById("livroId").value;
  const quantidade = document.getElementById("quantidade").value;
  const total = document.getElementById("total").value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, itens: [{ livroId, quantidade }], total }),
    });

    const data = await response.json();
    alert(response.ok ? "Pedido criado com sucesso!" : `Erro: ${data.error}`);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
  }
});