import 'dotenv/config'

import express from 'express';
import configViewEngine from './config/configEngine';
import { initWebRouter } from './routes/web';
import { cronJobGame1p } from './controllers/cronJobContronler';
import path from 'path';
import { sendMessageAdmin } from './controllers/socketIoController';
require('dotenv').config();
let cookieParser = require('cookie-parser');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 7000;

app.use(cookieParser());
// app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup viewEngine
configViewEngine(app);
// // init Web Routes
initWebRouter(app);

// // Cron game 1 Phut 
cronJobGame1p(io);

// // Check xem ai connect vào sever 
sendMessageAdmin(io);

// app.all('*', (req, res) => {
//     return res.render("404.ejs"); 
// });
// app.get('/',(req, res)=>{
//     res.send('hellow or')
// })
app.set('view engine', 'ejs');

// Set the views directory to src/views
// app.set('views', path.join(__dirname, '../src/views')); // Adjust path as necessary

// Your other app configurations...

// Error handling middleware for 404
// app.use((req, res, next) => {
//     res.status(404).render('home'); // This will now look for src/views/404.ejs
// });


server.listen(port, () => {
    console.log("Connected success port: " + port);
});

