
let modal = document.querySelector("#anleitung");

let btn = document.querySelector("#openAnleitung");

let span = document.getElementsByClassName("close")[0];

let username = document.querySelector('#username');

let bestenliste = document.querySelector('#bestenliste');

btn.onclick = function () {
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//--------------------------------------------------------------------------------



let starten = document.querySelector('#spielStarten');

starten.addEventListener('click', () => {

  // setze im Localstorage den eingegebenen Usernamen und setze fest welcher Spielmodus es ist
  if (username.value != '') {
    localStorage.setItem('username', username.value);
    localStorage.setItem('type', "classic");
    location.href = '/main';
  } else {
    username.classList.add('form-control', 'is-invalid');
  }

});

let mapgame = document.querySelector('#mapgame');

mapgame.addEventListener('click', () => {
  if (username.value != '') {
    localStorage.setItem('username', username.value);
    localStorage.setItem('type', "map");
    location.href = '/mapgame';
  } else {
    username.classList.add('form-control', 'is-invalid');
  }
})
bestenliste.addEventListener('click', () => {
  location.href = '/highscore'
});