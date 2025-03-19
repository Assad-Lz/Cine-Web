document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  // Função para carregar o conteúdo da página
  function loadPage(route) {
    app.style.opacity = 0; // Inicia a transição de fade-out
    setTimeout(() => {
      fetch(`${route}.html`)
        .then((response) => response.text())
        .then((html) => {
          app.innerHTML = html;
          app.style.opacity = 1; // Completa a transição de fade-in
          if (route === "reservas") {
            initReservas(); // Inicializa a lógica de reservas
          } else if (route === "home") {
            initHome(); // Inicializa a lógica da homepage
          }
        })
        .catch((err) => {
          app.innerHTML = "<h1>Página não encontrada</h1>";
          app.style.opacity = 1;
        });
    }, 300); // Tempo da transição
  }

  // Função para inicializar a lógica da homepage
  function initHome() {
    const movieCards = document.querySelectorAll(".movie-card");
    movieCards.forEach((card) => {
      card.addEventListener("click", () => {
        const filmeId = card.getAttribute("data-filme");
        window.location.hash = `#/reservas?filme=${filmeId}`;
      });
    });
  }

  // Função para inicializar a lógica de reservas
  function initReservas() {
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const filmeId = urlParams.get("filme");

    const movieCards = document.querySelectorAll(".movie-card");
    const typeButtons = document.querySelectorAll(".type-button");
    const confirmarFilmeButton = document.getElementById("confirmar-filme");
    const cinemaContainer = document.getElementById("cinema-container");

    let selectedFilme = null;
    let selectedTipo = null;

    // Selecionar filme
    movieCards.forEach((card) => {
      card.addEventListener("click", () => {
        // Remove a classe 'selected' de todos os cards
        movieCards.forEach((c) => c.classList.remove("selected"));

        // Adiciona a classe 'selected' ao card clicado
        card.classList.add("selected");

        // Define o filme selecionado
        selectedFilme = card.getAttribute("data-filme");
      });
    });

    // Selecionar tipo
    typeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        typeButtons.forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        selectedTipo = button.getAttribute("data-tipo");
      });
    });

    // Confirmar seleção
    confirmarFilmeButton.addEventListener("click", () => {
      if (!selectedFilme || !selectedTipo) {
        alert("Selecione um filme e um tipo!");
        return;
      }

      cinemaContainer.style.display = "block";
      initCinema(selectedFilme, selectedTipo);
    });

    // Definir o filme selecionado, se houver
    if (filmeId) {
      const filmeCard = document.querySelector(
        `.movie-card[data-filme="${filmeId}"]`
      );
      if (filmeCard) {
        filmeCard.click(); // Simula o clique no card do filme
      }
    }
  }

  // Função para inicializar a sala de cinema
  function initCinema(filme, tipo) {
    const seatsContainer = document.getElementById("seats-container");
    const popup = document.getElementById("popup");
    const popupSeats = document.getElementById("popup-seats");
    const popupTotal = document.getElementById("popup-total");
    const closePopupButton = document.getElementById("close-popup");
    const finalizarCompraButton = document.getElementById("finalizar-compra");

    const pricePerSeat = tipo === "2D" ? 20 : 30; // Preço por assento
    let selectedSeats = [];
    let totalPrice = 0;

    // Gerar 78 assentos
    function generateSeats() {
      seatsContainer.innerHTML = ""; // Limpar assentos anteriores
      for (let i = 1; i <= 78; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat", "livre");
        seat.dataset.seatId = i;
        seat.textContent = i;
        seat.addEventListener("click", () => selectSeat(seat));
        seatsContainer.appendChild(seat);
      }

      // Simular alguns assentos ocupados
      const occupiedSeats = [3, 7, 12, 25, 30, 45, 50, 65, 70];
      occupiedSeats.forEach((seatId) => {
        const seat = document.querySelector(`[data-seat-id="${seatId}"]`);
        seat.classList.remove("livre");
        seat.classList.add("ocupado");
      });
    }

    // Selecionar assento
    function selectSeat(seat) {
      if (seat.classList.contains("ocupado")) return;

      const seatId = seat.dataset.seatId;
      if (selectedSeats.includes(seatId)) {
        selectedSeats = selectedSeats.filter((id) => id !== seatId);
        seat.classList.remove("selecionado");
        seat.classList.add("livre");
      } else {
        selectedSeats.push(seatId);
        seat.classList.remove("livre");
        seat.classList.add("selecionado");
      }

      updateInfo();
    }

    // Atualizar informações
    function updateInfo() {
      popupSeats.textContent = selectedSeats.join(", ");
      totalPrice = selectedSeats.length * pricePerSeat;
      popupTotal.textContent = totalPrice.toFixed(2);
    }

    // Exibir pop-up ao finalizar compra
    finalizarCompraButton.addEventListener("click", () => {
      if (selectedSeats.length === 0) {
        alert("Selecione pelo menos um assento!");
        return;
      }

      popup.classList.add("visible");
    });

    // Fechar pop-up
    closePopupButton.addEventListener("click", () => {
      popup.classList.remove("visible");
    });

    generateSeats();
  }

  // Roteamento inicial
  function handleRoute() {
    const hash = window.location.hash;
    let route = "home"; // Rota padrão

    if (hash) {
      route = hash.split("/")[1] || "home";
    }

    loadPage(route);
  }

  // Atualizar rota ao mudar o hash
  window.addEventListener("hashchange", handleRoute);

  // Inicializar roteamento
  handleRoute();
});
