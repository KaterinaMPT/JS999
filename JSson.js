class Kitten {
  constructor(image, name, age, color) {
    this.image = image;
    this.name = name;
    this.age = age;
    this.color = color;
  }

  isValid() {
    return this.age > 0 && this.name && this.color && this.image;
  }
}

const kittens = [
  new Kitten("https://i.postimg.cc/vHRbqFZv/1628685519-21-p-kotyata-foto-milashki-23.jpg", "Мочалка", 2, "Белый"),
  new Kitten("https://i.postimg.cc/5NGvktFR/142110-kot-bakenbardy-koshki-malogo-i-srednego-razmera-trava-koshachih-1920x1080.jpg","Мухоморчик", 3, "Рыжий")
];

function displayCollection(collection, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  collection.forEach((kitten, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("col-md-4", "mb-4");

    const info = `
      <div class="card">
        <img src="${kitten.image}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${kitten.name}</h5>
          <p class="card-text">Возраст: ${kitten.age}</p>
          <p class="card-text">Окрас: ${kitten.color}</p>
          <button class="btn btn-light" onclick="startRedact(${index})">Редактировать</button>
          <button class="btn btn-secondary" onclick="deleteKitten(${index})">Удалить</button>
        </div>
      </div>
    `;

    cardElement.innerHTML = info;
    container.appendChild(cardElement);
  });
}

function addKitten(event) {
  event.preventDefault();

  const form = event.target;
  const image = form.elements.image.files[0];
  const imageUrl = URL.createObjectURL(image);
  const name = form.elements.name.value;
  const ageStr = form.elements.age.value.trim();
  const color = form.elements.color.value;

  if (!name) {
    displayErrorMessage("Пожалуйста, введите имя котенка.");
  } 
  else if (!ageStr) {
    displayErrorMessage("Пожалуйста, введите возраст котенка.");
  } 
  else if (!color) {
    displayErrorMessage("Пожалуйста, введите цвет котенка.");
  } 
  else if (!image) {
    displayErrorMessage("Пожалуйста, выберите изображение котенка.");
  } 
  else {
    const age = parseInt(ageStr);
    if (isNaN(age) || age <= 0) {
      displayErrorMessage("Пожалуйста, введите корректный возраст (больше нуля).");
    } 
    else {
      const newKitten = new Kitten(imageUrl, name, age, color);
      kittens.push(newKitten);
      form.reset(); 
      displayCollection(kittens, "collection");
      clearErrorMessage();
    }
  }
}

function displayErrorMessage(message) {
  const errorMessageDiv = document.getElementById("error-message");
  errorMessageDiv.textContent = message;
}

function clearErrorMessage() {
  const errorMessageDiv = document.getElementById("error-message");
  errorMessageDiv.textContent = "";
}


function saveRedact(event) {
  event.preventDefault();

  const form = event.target;
  const index = parseInt(form.dataset.index);
  const newName = form.elements.redactName.value;
  const newAge = parseInt(form.elements.redactAge.value);
  const newColor = form.elements.redactColor.value;
  const newImage = form.elements.redactImage.files[0];

  const age = parseInt(newAge);
  if (isNaN(age) || age <= 0) {
    displayErrorMessage("Пожалуйста, введите корректный возраст (больше нуля).");
  } else {
    const kitten = kittens[index];
    kitten.name = newName;
    kitten.age = newAge;
    kitten.color = newColor;

    if (newImage) {
      const imageUrl = URL.createObjectURL(newImage);
      kitten.image = imageUrl;
    }

    displayCollection(kittens, "collection");

    clearErrorMessage();
    cancelRedact();
  }
}

function cancelRedact() {
  document.getElementById("redactContainer").style.display = "none";
}

window.onload = function() {
  displayCollection(kittens, "collection");

  document.getElementById("dobavl").addEventListener("submit", addKitten);

  document.getElementById("redact").addEventListener("submit", saveRedact);
};

function deleteKitten(index) {
  kittens.splice(index, 1);
  displayCollection(kittens, "collection");
  showNotification("Котенок успешно удален", "success");
}

function startRedact(index) {
  const kitten = kittens[index];
  document.getElementById("redactImage").src = kitten.image;
  document.getElementById("redactName").value = kitten.name;
  document.getElementById("redactAge").value = kitten.age;
  document.getElementById("redactColor").value = kitten.color;

  document.getElementById("redactContainer").style.display = "block";
  document.getElementById("redact").dataset.index = index;
}
