const menu = document.querySelector(".btn-mobile");
const navigation = document.querySelector(".desktop-nav");
const mobileIcon = document.querySelectorAll(".icon-mobile");
const bookmark = document.querySelector(".bookmark");
const closeModal = document.querySelector(".closeModal");
const modal = document.querySelector(".modal");
const modalButton = document.querySelectorAll(".select");
const selction = document.querySelectorAll(".selection");
const pledges = document.querySelectorAll(".input-pledge");
let total = document.querySelector("#totalRaised");
let backers = document.querySelector("#totalBackers");
const continueButtons = document.querySelectorAll(".selection button");
const inputConditions = { option1: 0, option2: 25, option3: 75, option4: 200 };
const confirmation = document.querySelector("#confirmation");
const finalizeButton = document.querySelector("#confirmation button");
const numberSection = document.querySelector(".numbers");
const progressBar = document.querySelector(".progressBar div");
const openButtons = document.querySelectorAll(".about button, .back");
const specificButtons = {
  button1: "#bamboo",
  button2: "#black",
  button3: "#mahogany",
};
const check = document.querySelectorAll(".left input");

let pledge = 0;

function toggleModal() {
  modal.classList.toggle("active");
}

function clear() {
  selction.forEach(s => s.classList.remove("active"));
}

menu.addEventListener("click", function () {
  navigation.classList.toggle("nav-open");
  mobileIcon.forEach(i => i.classList.toggle("nav-open"));
});

bookmark.addEventListener("click", function () {
  bookmark.classList.toggle("active");
});

openButtons.forEach(b => {
  b.addEventListener("click", () => {
    toggleModal();
    if (b.classList.contains("specific")) {
      const inputID = specificButtons[b.id];
      const checkedOption = document.querySelector(inputID);
      checkedOption.checked = true;
      checkedOption.parentElement.parentElement.parentElement.classList.add(
        "active"
      );
    }
  });
});

closeModal.addEventListener("click", function () {
  modal.classList.remove("active");
  clear();
});

for (let i = 0; i < modalButton.length; i++) {
  modalButton[i].addEventListener("click", function () {
    clear();
    selction[i].classList.add("active");
    pledges[i].focus();
  });
}

function updateStock() {
  const selector = document
    .querySelector(".selection.active .select input")
    .getAttribute("value");
  const options = document.querySelectorAll(`.option.${selector}`);
  const stock = document.querySelectorAll(`.option.${selector} h6`);
  if (selector !== "noReward") {
    const newStock = Number(stock[0].innerHTML) - 1;
    stock.forEach(s => {
      s.innerHTML = newStock.toString();
    });
    if (newStock === 0) {
      options.forEach(o => {
        o.classList.add("inactive");
        document
          .querySelectorAll(".option.inactive button")
          .forEach(b => (b.innerHTML = "Out of Stock"));
      });
    }
  }
}

continueButtons.forEach(b => {
  b.addEventListener("click", event => {
    event.preventDefault();
    const input = document.querySelector(".selection.active .amount input");
    const inputID = input.id;
    pledge = Number(input.value);
    if (!pledge || pledge < inputConditions[inputID]) {
      input.parentElement.parentElement.classList.add("error");
    } else {
      input.parentElement.parentElement.classList.remove("error");
      updateStock();
      modal.classList.toggle("active");
      setTimeout(() => {
        confirmation.classList.toggle("active");
      }, 1000);
    }
  });
});

finalizeButton.addEventListener("click", () => {
  confirmation.classList.toggle("active");
  const newTotal = Math.round(
    parseFloat(total.innerHTML.replace(",", "")) + pledge
  );
  let totalString = newTotal.toString();
  const newBackers = (
    parseFloat(backers.innerHTML.replace(",", "")) + 1
  ).toString();
  let backersString = newBackers.toString();
  for (let i = 3; i < totalString.length; i += 4) {
    totalString = totalString.slice(0, -i) + "," + totalString.slice(-i);
  }
  for (let i = 3; i < backersString.length; i += 3) {
    backersString = backersString.slice(0, -i) + "," + backersString.slice(-i);
  }
  setTimeout(() => {
    numberSection.scrollIntoView({ behavior: "smooth" });
    progressBar.style.transition = "width 0s ease-out";
    progressBar.style.maxWidth = 0;
    progressBar.style.width = 0;
    setTimeout(() => {
      totalRaised.innerHTML = totalString;
      totalBackers.innerHTML = backersString;
      numberSection.classList.toggle("loading");
      progressBar.style.maxWidth = "100%";
      let newWidth = (newTotal * 100) / 100000;
      if (newWidth < 100) {
        progressBar.style.transition = `width ${newWidth * 0.01 * 2}s ease-out`;
        progressBar.style.width = newWidth + "%";
      } else {
        progressBar.style.transition = "width 2s ease-out";
        progressBar.style.width = "100%";
      }
    }, 500);
    numberSection.classList.toggle("loading");
  }, 500);
  clear();
  check.forEach(c => (c.checked = false));
});
