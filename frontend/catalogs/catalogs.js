const API_URL = "http://localhost:3003/catalogs";

document.getElementById("catalogForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const categoria = document.getElementById("categoria").value;
  const descricao = document.getElementById("descricao").value;
  const estoque = parseInt(document.getElementById("estoque").value, 10);
  let preco = document.getElementById("preco").value;

  // Converte o preço para o formato correto
  preco = parseFloat(preco.replace(",", "."));

  if (isNaN(preco) || preco < 0 || isNaN(estoque) || estoque < 0 || !categoria || !descricao) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, autor, categoria, descricao, estoque, preco }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Livro adicionado com sucesso!");
    } else {
      alert(`Erro: ${data.error || 'Erro ao adicionar livro.'}`);
    }
  } catch (error) {
    console.error("Erro ao adicionar livro:", error);
    alert("Erro ao adicionar livro. Tente novamente mais tarde.");
  }
});