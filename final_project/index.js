const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const jwtSecret = '244d0b97c61cb978567e348a15fc8cd5c3c5791af982ccae88db48383bc3c273';

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if(req.session.authorization) {
        let token = req.session.authenticated["accessToken"] ?? res.status(401).json({ message: "No token provided" });

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const tokenHeader = authHeader.split(' ')[1];

        jwt.verify(token, "access", (err, user) => {
            if(!err) {
                req.user = user;
                next()
            }
            else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        })
    }
    else {
        return res.status(403).json({ message: "User not logged in." });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
