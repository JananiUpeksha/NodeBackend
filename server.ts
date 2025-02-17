import express from 'express';
import authRoutes, {authenticateToken} from "./routes/auth-routes";
import dotenv from 'dotenv';
import cors from 'cors';
import flowerRoutes from "./routes/flower-routes";
import customerRoutes from "./routes/customer-routes";

dotenv.config();
const app = express();

app.use(express.json());

/*app.use(cors({
    origin: 'http://localhost:5175',
    methods: ['GET', 'POST'],
    credentials: true,
}));*/
const allowedOrigins = ["http://localhost:5173", "http://localhost:5175"];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(<string>origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

console.log("Loaded SECRET_KEY:", process.env.SECRET_KEY);

app.use('/auth', authRoutes);
app.use('/flower', flowerRoutes);
app.use('/customer',customerRoutes)

app.use(authenticateToken);

/*app.get('/customers', async (req: express.Request, res: express.Response) => {
    const customer = {'id' : '1', 'name' : 'ramindu'}
    const username = req.body.username;
    console.log(username);
    res.json(customer);

})*/
app.listen(3003,()=>{
    console.log("Server running on port 3003");
})