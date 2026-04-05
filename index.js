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

db.sync()
    .then(() => {
        app.listen(porta, () => {
            console.log(`O express está escutando a porta ${porta}`);
        })
    })