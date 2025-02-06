"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_client_1 = require("../database/data-client");
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Login Request Received');
    const { username, password } = req.body;
    const user = { username, password, firstName: '', lastName: '' }; // firstName & lastName are not needed for login
    try {
        const isVerified = yield (0, data_client_1.verifyUserCredentials)(user);
        if (isVerified) {
            const token = jsonwebtoken_1.default.sign({ username }, process.env.SECRET_KEY, { expiresIn: "1m" });
            const refreshToken = jsonwebtoken_1.default.sign({ username }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
            res.json({ accessToken: token, refreshToken: refreshToken });
        }
        else {
            console.log("Invalid credentials! Try again.");
            res.status(403).json({ message: "Invalid credentials! Try again." }); // Send JSON response
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Register Request Received", req.body);
    const { firstName, lastName, username, password } = req.body;
    const user = { firstName, lastName, username, password };
    try {
        const registration = yield (0, data_client_1.createUser)(user);
        res.status(201).json(registration);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
}));
router.post("/refresh-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const refresh_token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (!refresh_token)
        res.status(401).send('No token provided');
    try {
        const payload = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        const token = jsonwebtoken_1.default.sign({ username: payload.username }, process.env.SECRET_KEY, { expiresIn: "1m" });
        res.json({ accessToken: token });
    }
    catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
}));
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    console.log(token);
    if (!token)
        res.status(401).send('No token provided');
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        console.log(payload.username);
        req.body.username = payload.username;
        next();
    }
    catch (err) {
        res.status(401).send(err);
    }
}
exports.default = router;
