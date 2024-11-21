document.addEventListener("DOMContentLoaded", function () {
  const hpBarFill = document.getElementById("hp-bar-fill");
  const manaBarFill = document.getElementById("mana-bar-fill");
  const inventoryContainer = document.getElementById("inventory-container");

  let hp = 100;
  let mana = 100;
  let maxMana = 100; // Definindo o valor máximo de mana como 100 por padrão
  let items = [];

  const hpDecreaseButton = document.getElementById("hp-decrease");
  const hpIncreaseButton = document.getElementById("hp-increase");
  const manaDecreaseButton = document.getElementById("mana-decrease");
  const manaIncreaseButton = document.getElementById("mana-increase");

  const itemTitleInput = document.getElementById("item-title");
  const itemDescriptionInput = document.getElementById("item-description");
  const itemImageInput = document.getElementById("item-image");
  const itemConsumableInput = document.getElementById("item-consumable");
  const createItemButton = document.getElementById("create-item-button");

  // Adiciona uma caixa de entrada para o ajuste de mana total do personagem
  const manaTotalInput = document.getElementById("mana-total");

  // Função para carregar dados salvos no localStorage
  function loadSavedData() {
    const savedHp = localStorage.getItem("hp");
    const savedMana = localStorage.getItem("mana");
    const savedMaxMana = localStorage.getItem("maxMana");
    const savedItems = localStorage.getItem("items");

    if (savedHp !== null) hp = parseInt(savedHp);
    if (savedMana !== null) mana = parseInt(savedMana);
    if (savedMaxMana !== null) maxMana = parseInt(savedMaxMana);
    if (savedItems !== null) items = JSON.parse(savedItems);

    updateBars();
    loadInventory();
  }

  // Função para salvar os dados no localStorage
  function saveData() {
    localStorage.setItem("hp", hp);
    localStorage.setItem("mana", mana);
    localStorage.setItem("maxMana", maxMana);
    localStorage.setItem("items", JSON.stringify(items));
  }

  // Atualiza as barras de HP e Mana
  function updateBars() {
    hpBarFill.style.width = `${hp}%`;
    manaBarFill.style.width = `${(mana / maxMana) * 100}%`;

    // Atualiza os textos das barras
    hpBarFill.setAttribute("data-value", `${hp} / 100`);
    manaBarFill.setAttribute("data-value", `${mana} / ${maxMana}`);
  }

  // Atualiza a mana total do personagem com base na entrada
  manaTotalInput.addEventListener("input", () => {
    maxMana = parseInt(manaTotalInput.value);
    if (mana < 0) mana = 0; // Impede valores negativos
    if (mana > maxMana) mana = maxMana; // Garante que a mana não ultrapasse o valor máximo
    updateBars();
    saveData(); // Salva após a alteração
  });

  // Manipula a diminuição e aumento de HP e Mana
  hpDecreaseButton.addEventListener("click", () => {
    if (hp > 0) {
      hp--;
      updateBars();
      saveData(); // Salva após a alteração
    }
  });

  hpIncreaseButton.addEventListener("click", () => {
    if (hp < 100) {
      hp++;
      updateBars();
      saveData(); // Salva após a alteração
    }
  });

  manaDecreaseButton.addEventListener("click", () => {
    if (mana > 0) {
      mana--;
      updateBars();
      saveData(); // Salva após a alteração
    }
  });

  manaIncreaseButton.addEventListener("click", () => {
    if (mana < maxMana) {
      mana++;
      updateBars();
      saveData(); // Salva após a alteração
    }
  });

  // Funcionalidade de criar e adicionar item ao inventário
  createItemButton.addEventListener("click", () => {
    const title = itemTitleInput.value;
    const description = itemDescriptionInput.value;
    const image = itemImageInput.files[0]; // Verifica se há uma imagem
    const consumable = itemConsumableInput.checked;

    // Caso a imagem não tenha sido escolhida, usar uma imagem padrão
    const imageUrl = image ? URL.createObjectURL(image) : 'placeholder.jpg'; // Verifique o caminho da imagem padrão

    if (title && description) {  // Verifica se todos os campos necessários foram preenchidos
      const newItem = {
        title,
        description,
        image: imageUrl, // Imagem padrão se não houver imagem
        consumable,
      };

      items.push(newItem);
      addItemToInventory(newItem);
      saveData(); // Salva após a criação do item

      // Limpa os campos após adicionar o item
      itemTitleInput.value = '';
      itemDescriptionInput.value = '';
      itemImageInput.value = '';
      itemConsumableInput.checked = false;
    } else {
      alert('Por favor, preencha todos os campos necessários!');
    }
  });

  function addItemToInventory(item) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("inventory-item");

    itemElement.innerHTML = `
      <img class="item-image" src="${item.image}" alt="${item.title}">
      <div class="item-details">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;

    inventoryContainer.appendChild(itemElement);
  }

  loadSavedData(); // Carrega os dados salvos ao carregar a página
});

