
const flagContainer = document.querySelector('#flagContainer');
const timerTime = document.querySelector('.timerTime');
const punkteAnzeige = document.querySelector('.punkteAnzeige');
const eingabe = document.querySelector('#eingabe');
const pruefeAntwort = document.querySelector('.pruefen-btn');
const hinweis = document.querySelector('.hinweis-btn');
const abbrechen = document.querySelector('.abbrechen-btn');

const modalWin = document.querySelector('.modal-win');
const modalLose = document.querySelector('.modal-lose');
const hintSnackbar = document.querySelector('#hintSnackbar');






let randomFlag;
let timer;
let punkte = 0;
let currentFlagId;
let tipAnzeigen = '';
let levelCounter = 0;

const startGame = () => {

    // Ist der Tipp angezeigt?
    hintVisible = false;

    // bei jeder neuen Runde - Timer löschen & Neustart
    clearInterval(timer);
    eingabe.classList.remove('form-control', 'is-valid', 'is-invalid');


    // wenn 15 Runden gespielt wurden
    if (levelCounter >= 15) {
        clearInterval(timer);
        if (punkteAnzeige.textContent >= 1) {
            modalWin.style.display = 'block'
            modalLose.style.display = 'none'

            // Datum erzeugen, so wie wir es kennen
            const currentDate = new Date().toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Sammle die Userdaten zum speichern
            let gameData = {
                user: localStorage.getItem('username'),
                date: currentDate,
                points: punkteAnzeige.textContent
            };

            fetch('/userOnHighscore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameData)
            })
                .then(response => response.json());

            return
        } else {
            modalLose.style.display = 'block'
            modalWin.style.display = 'none'
            return
        };

    };



    // zähle die Runden mit
    levelCounter++

    // zufällige Flagge
    fetch('/flag',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: localStorage.getItem("type") })
    })
        .then(response => response.json())
        // erzeuge die Flagge im Flaggencontainer
        .then(randomFlag => {

            currentFlagId = randomFlag.id;

            const createImage = document.createElement('img');
            createImage.src = `${randomFlag.image}`;

            flagContainer.innerHTML = '';
            flagContainer.appendChild(createImage);
        })
        .catch(error => {
            throw new Error(error)

        })
    startTimer()


    eingabe.value = '';
    eingabe.focus();
    timerTime.style.color = 'black';
}

// Eventhandler für Prüfen der Antwort
pruefeAntwort.addEventListener('click', pruefen);
eingabe.addEventListener('keydown', (press) => {
    if (press.key === 'Enter') {
        pruefen()
    }

});

// Funktion zur Überprüfung
function pruefen() {
    let input = eingabe.value.trim().toLowerCase();
    
    
    fetch('/checkAnswer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: input, idcorrect: currentFlagId })
    })
        .then(response => response.json())
        .then(correctAnswer => {
            if (correctAnswer.isCorrect) {

                // 5Pkt für unter 10s und 2Pkt für Rest
                if (timerTime.textContent >= '0:20') {
                    punkte += 5
                } else if (timerTime.textContent <= '0:19') {
                    punkte += 2
                };

                // Zähle Punkte
                punkteAnzeige.textContent = punkte;
                eingabe.classList.add('form-control', 'is-valid');
                clearInterval(timer);
                setTimeout(startGame, 2000);

            } else if (!correctAnswer.isCorrect || input === '') {
                console.log('Falsch')
                tipAnzeigen = correctAnswer.tip
                punkte--
                punkteAnzeige.textContent = punkte
                eingabe.classList.add('form-control', 'is-invalid')
                clearInterval(timer)
                setTimeout(startGame, 2000)
            };

        })

        .catch(err => {
            console.log('Fehler', err)


        });

};


// Timer-Funktion
function startTimer() {
    let newTimer = 30;

    timer = setInterval(() => {

        newTimer--
        timerTime.textContent = `0:${newTimer.toString().padStart(2, '0')}`

        if (newTimer <= 0) {
            clearInterval(timer)
            timerTime.style.color = 'red';
            showAnswer()

        }
    }, 1000);

};

// Antwort anzeigen, wenn Timer abgelaufen ist
function showAnswer() {

    fetch('/getTip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: currentFlagId })
    })
        .then(response => response.json())
        .then(resp => {
            hintSnackbar.textContent = resp.tip


            if (timerTime.textContent === '0:00') {
                eingabe.value = resp.country
                eingabe.classList.add('form-control', 'is-invalid')
                punkte--
                punkteAnzeige.textContent = punkte
                setTimeout(startGame, 2000)
            };


        })


        .catch(err => {
            console.log('Fehler', err)
        })
};

// keine Punkte mehr abziehen, wenn Hinweis-Btn bereits geklickt worden
let hintVisible = false;
hinweis.addEventListener('click', () => {


    if (!hintVisible) {
        punkte--
        punkteAnzeige.textContent = punkte;
        hintSnackbar.className = 'show';


        setTimeout(function () { hintSnackbar.className = hintSnackbar.className.replace('show', '') }, 10000);
        showAnswer()
        hintVisible = true;
    }



})

// "nicht gespeicherte Fortschritte gehen verloren"
abbrechen.addEventListener('click', () => {
    localStorage.removeItem('username');
    location.href = '/start';
});

// Modal wenn User gewinnt
if (modalWin) {
    modalWin.querySelector('.btn-success').addEventListener('click', () => {
        levelCounter = 0;
        punkte = 0;
        punkteAnzeige.textContent = 0;
        modalWin.style.display = 'none';
        startGame()
    });

    modalWin.querySelector('.btn-danger').addEventListener('click', () => {
        modalWin.style.display = 'none';
        localStorage.removeItem('username');
        location.href = '/start';
    });

    modalWin.querySelector('.btn-info').addEventListener('click', () => {
        location.href = '/highscore'
    });
};

// Modal wenn User verliert
if (modalLose) {
    modalLose.querySelector('.btn-success').addEventListener('click', () => {
        levelCounter = 0;
        punkte = 0;
        punkteAnzeige.textContent = 0;
        modalLose.style.display = 'none';
        startGame()
    });

    modalLose.querySelector('.btn-danger').addEventListener('click', () => {
        modalLose.style.display = 'none';
        localStorage.removeItem('username');
        location.href = '/start';
    });

    modalLose.querySelector('.btn-info').addEventListener('click', () => {
        location.href = '/highscore'
    });
};


// Überprüfe die ID des Landes mit der angeklickten Area des SVG
let worldmap = document.querySelectorAll('path');

worldmap.forEach(country => {
    country.addEventListener('click', (e) => {
        eingabe.value = e.target.id;
        
        pruefen()
        
    });
});

document.addEventListener('DOMContentLoaded', startGame);