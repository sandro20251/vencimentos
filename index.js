const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const path = require('path');
const os = require('os');
const db = require('./db/conn');

const app = express();
const porta = 3000;

// middlewares

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(session({
    name: "session",
    secret: "san200hum300",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function () { },
        path: path.join(os.tmpdir(), 'sessions'),
    }),
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    }
}));

app.use(flash());

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }

    next();
})

//  rotas

app.use('/', require('./routes/userRoutes'));

db.sync()
    .then(() => {
        app.listen(porta, () => {
            console.log(`O express está escutando a porta ${porta}`);
        })
    })