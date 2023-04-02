const rain_container = document.querySelector("div.rain");
const waterdrops_container = document.querySelector("div.waterdrops");
const login_button = document.getElementById("loginButton");
const signup_button = document.getElementById("signUpButton");

const cityContainer = document.querySelector(".city-container");

function dropRange(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}
function createRain(dropNum, rain_container) {
  for (let i = 1; i <= dropNum; i++) {
    let drop_div = document.createElement("div");
    drop_div.classList.add("drop");
    drop_div.setAttribute("id", `drop${i}`);
    rain_container.append(drop_div);
    drop_div.style.left = `${dropRange(1, 1500)}px`;
    drop_div.style.top = `${dropRange(-2000, 1400)}px`;
  }
}

if (rain_container) {
  const dropNum = 800;
  createRain(dropNum, rain_container);
}

if (login_button) {
  login_button.onclick = () => {
    login_button.style.transform = "translateY(5px)";
  };
}
if (signup_button) {
  signup_button.onclick = () => {
    signup_button.style.transform = "translateY(5px)";
  };
}

if (
  document.querySelector(".city-sub-container") &&
  document.querySelector(".city-sub-container").innerHTML.trim() !== ""
) {
  cityContainer.classList.add("city-no-background");
  cityContainer.classList.remove("city-background");
} else {
  cityContainer.classList.add("city-background");
  cityContainer.classList.remove("city-no-background");
}
