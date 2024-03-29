const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const session = require("express-session");
const flash = require('connect-flash')
const dotenv = require('dotenv')

app.set('view engine', 'ejs');

app.set('views', 'views/Pages');

app.use(function(req, res, next) {
    let staticPath;
    if (req.url === '/') {
        console.log("HOME " + req.url)
        staticPath = 'views/Pages/home';
    } else if (req.url.includes('img')){
        staticPath = "public";
    }else {
        console.log("ADMIN " + req.url)
        staticPath = `views/Pages/${req.url}`;
    }
    app.use(express.static(staticPath));
    next();
});



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser("$2a$10$otMKbi0cL.kXBb/lfth21e4M7pjWkNOEEP8mePiLjEF0jMx30.tgm"))
app.use(session({
    secret: "$2a$10$otMKbi0cL.kXBb/lfth21e4M7pjWkNOEEP8mePiLjEF0jMx30.tgm", cookie: {maxAge: 604800000}
}))
app.use(flash())

dotenv.config();

//Data Base connection
const connection = require("./database/database");
connection.authenticate() .then(() =>{
    console.log(`Connected to ${process.env.DATA_BASE}!`);
}).catch((error) => {
    console.log(error);
});

//Controllers
const AdminController = require("./controllers/Admin/AdminController");
app.use("/", AdminController);

const AdsController = require("./controllers/Ads/AdsController");
app.use("/", AdsController);

const ClientsController = require("./controllers/Clients/ClientController");
app.use("/", ClientsController);

const HomeController = require("./controllers/Home/HomeController");
app.use("/", HomeController);

const ResultsController = require("./controllers/Results/ResultsController");
app.use("/", ResultsController);

app.listen(80, () =>{
    console.log('Aplicação rodando na porta 80')
})
