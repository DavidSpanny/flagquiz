import express from 'express';
import fs from 'fs';
import path from 'path';
import favicon from 'serve-favicon';
import { fileURLToPath } from 'url';


const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.listen(PORT, () => {
    console.log(`Server running at http://localhost${PORT}`)
});

app.use((req, res, next) => {
    res.header({ 'Access-Control-Allow-Origin': '*' })
    next()
});

app.use(express.static('www'));
app.use(express.static('data'));
app.use(express.static('images'));
app.use(express.static('node_modules/bootstrap/dist'));

app.use(favicon(path.join(__dirname, 'www', 'favicon.ico')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// rufe die Startseite auf
app.get('/start', (req, res) => {
    fs.readFile('www/start.html', (err, data) => {
        if (!err) {
            res.send(data.toString())
        }
    });
});

// rufe die Hauptseite auf
app.get('/main', (req, res) => {
    fs.readFile('www/main.html', (err, data) => {
        if (!err) {
            res.send(data.toString())
        }
    });
});

// lese die JSON-Datei mit den Flaggenobjekten
app.get('/flags.json', (req, res) => {
    fs.readFile('data/flags.json', (err, data) => {
        if (!err) {
            res.setHeader('Content-Type', 'application/json')
            res.send(data)
        }
    });
});

let randomFlag;

const usedFlags = [];

// schicke dem Client eine zufällige Flagge
app.post('/flag', (req, res) => {
    let type = req.body.type
    fs.readFile('data/flags.json', (err, data) => {

        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            let jsonFlags = JSON.parse(data);

            // aber nur die, die noch nicht in dem Spiel angezeigt wurden
            const displayedFlags = jsonFlags.filter(elem => !usedFlags.includes(elem.id));

            if (displayedFlags === 0) {
                usedFlags.length = 0
            };

            // im Map-Game gewisse Flaggen ausblenden
            // zufällige Flagge aus dem flags.json auswählen
            let mapFlags = false;
            while (mapFlags == false) {
                let randomId = Math.floor(Math.random() * displayedFlags.length);
                randomFlag = displayedFlags[randomId];
                if (type == "map" && displayedFlags[randomId].map == true) {
                    mapFlags = true;
                } else if (type != "map") {
                    mapFlags = true;
                }
            }
            
            // bereits angezeigte Flaggen in ein Array stecken
            usedFlags.push(randomFlag.id);

            // lösche den Namen des Landes, damit User nicht schummeln kann
            delete randomFlag.country;

            res.send(randomFlag);
        }
    });
});

// überprüfe die Antwort des Users und schick ihm eine Antwort
app.post('/checkAnswer', (req, res) => {
    let answer = req.body.answer;
    let idcorrect = req.body.idcorrect;
    fs.readFile('./data/flags.json', (err, data) => {

        let flags = JSON.parse(data);

        let validAnswer = '';

        for (let i = 0; i < flags.length; i++) {

            let flag = flags[i];
            if (idcorrect == flag.id) {
                if (typeof flag.country === 'object' && Array.isArray(flag.country)) {
                    if (flag.country.includes(answer)) {
                        validAnswer = true
                    }
                } else {
                    if (flag.country === answer) {
                        validAnswer = true
                    }
                };
            };

        };
        res.json({ isCorrect: validAnswer });
    });


});

// finde den passenden Tipp
app.post('/getTip', (req, res) => {
    const id = req.body.id;

    fs.readFile('./data/flags.json', (err, data) => {
        let flags = JSON.parse(data);
        let currentFlag = flags.find(flag => flag.id === id);

        if (currentFlag) {
            const resp = {
                tip: currentFlag.hint,
                country: currentFlag.country
            }

            res.json(resp)

        }
    });


});

// schreibe die Userdaten auf die Bestenliste
app.post('/userOnHighscore', async (req, res) => {
    const newUser = {
        user: req.body.user,
        date: req.body.date,
        points: req.body.points
    };

    let newHighscore = [];

    let content = await fs.promises.readFile('data/highscore.json');
    newHighscore = JSON.parse(content);

    // die höchsten Punkte stehen ganz oben
    newHighscore.unshift(newUser);

    newHighscore.sort((a, b) => {
        if (b.points === a.points) {
            return new Date(b.date) - new Date(a.date)
        } else {
            return b.points - a.points
        };
    });

    // Top Ten
    newHighscore = newHighscore.slice(0, 10);

    await fs.promises.writeFile('data/highscore.json', JSON.stringify(newHighscore));

    res.json()
})

app.get('/highscoreJSON', (req, res) => {
    fs.readFile('./data/highscore.json', (err, data) => {
        try {
            const highscoreEntry = JSON.parse(data);
            res.json(highscoreEntry);
        } catch (error) {
            throw new Error (error)
        }
    });
});

// rufe die Bestenliste-HTML auf
app.get('/highscore', (req, res) => {
    fs.readFile('www/highscore.html', (err, data) => {
        if (!err) {
            res.setHeader('Content-Type', 'text/html');
            res.send(data.toString());
        }
    });
});

// rufe die Map-Game auf
app.get('/mapgame', (req, res) => {
    fs.readFile('www/mapgame.html', (err, data) => {
        if (!err) {
            res.send(data.toString())
        }
    });
});