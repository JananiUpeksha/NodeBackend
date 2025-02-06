import express from "express";
import {User} from "../model/user";
import jwt, {Secret} from 'jsonwebtoken';
import dotenv from 'dotenv';
import {createUser, verifyUserCredentials} from "../database/data-client";

dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
    console.log('Login Request Received');

    const { username, password } = req.body;
    const user: User = { username, password, firstName: '', lastName: '' }; // firstName & lastName are not needed for login

    try{
        const isVerified =  await verifyUserCredentials(user);

        if(isVerified){
            const token = jwt.sign({ username }, process.env.SECRET_KEY as Secret, {expiresIn: "1m"});
            const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN as Secret, {expiresIn: "7d"});
            res.json({accessToken : token, refreshToken : refreshToken});
        }else{
            console.log("Invalid credentials! Try again.");
            res.status(403).json({ message: "Invalid credentials! Try again." }); // Send JSON response
        }
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }

})

router.post("/register", async (req, res) => {
    console.log("Register Request Received", req.body);

    const { firstName, lastName, username, password } = req.body;
    const user: User = { firstName, lastName, username, password };

    try {
        const registration = await createUser(user);
        res.status(201).json(registration);
    } catch (err: any) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
});

router.post("/refresh-token", async (req, res) => {
    const authHeader = req.headers.authorization;
    const refresh_token = authHeader?.split(' ')[1];

    if(!refresh_token)res.status(401).send('No token provided');

    try{
        const payload = jwt.verify(refresh_token as string, process.env.REFRESH_TOKEN as Secret) as {username: string, iat: number};
        const token = jwt.sign({ username: payload.username }, process.env.SECRET_KEY as Secret, {expiresIn: "1m"});
        res.json({accessToken : token});
    }catch(err){
        console.log(err);
        res.status(401).json(err);
    }
})

export function authenticateToken(req : express.Request, res : express.Response, next : express.NextFunction){
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    console.log(token);
    if(!token)res.status(401).send('No token provided');

    try{
        const payload = jwt.verify(token as string, process.env.SECRET_KEY as Secret) as {username: string, iat: number};
        console.log(payload.username);
        req.body.username = payload.username;
        next();
    }catch(err){
        res.status(401).send(err);
    }
}

export default router;