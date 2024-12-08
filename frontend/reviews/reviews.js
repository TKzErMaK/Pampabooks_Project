const API_URL = "http://localhost:3001/reviews";

document.getElementById("reviewForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const livroId = document.getElementById("livroId").value;
  const userId = document.getElementById("userId").value;
  const comentario = document.getElementById("comentario").value;
  const nota = document.getElementById("nota").value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ livroId, userId, comentario, nota }),
    });

    const data = await response.json();
    alert(response.ok ? "Avaliação enviada com sucesso!" : `Erro: ${data.error}`);
  } catch (error) {
    console.error("Erro ao enviar avaliação:", error);
  }
});