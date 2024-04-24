import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { errorHandler } from './middlewares/error.middleware'
import { roomHandler } from './libs/roomHandler'
import authRoutes from './routes/auth.route'
import cookieParser from 'cookie-parser'


const PORT = 8080; // Setting the port number for the server

// Create an express application
const app = express();

// This enables us to read the content of the .env file
dotenv.config();

// this middleware helps the backend receive json data from the frontend
app.use(express.json());
app.use(express.urlencoded({extended: true}));;

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

// Enable CORS for all routes
app.use(cors());

// Create an HTTP server using the express app
const server = http.createServer(app);

// connect to the database
mongoose.connect(process.env.MONGO_URL!, {autoIndex:true})
.then(() => {
    console.log('connected to database');

    // listen for requests after connections has been made to the database
    server.listen(PORT, () => {
        console.log(`server started listening on port ${PORT}`);
    })
})
.catch(err => console.log('error', err));

// Initialize a web socket server with the created server
const io = new Server(server, {
    cors: {
        origin: '*', // Allow requests from all origins
        methods: ["GET","POST"] // Allow GET and POST methods
    }
});

app.use('/api/auth', authRoutes);



// Handle client connections to the web signalling server
io.on('connection', (socket) => {
    console.log('A user is connected');

    // Handle all login-related actions for a room
    roomHandler(socket, io);

    // Handle when a client closes the webpage or application
    socket.on('disconnect', () => {
        console.log('User is disconnected...');
    });
});

// Apply the errorHandler middleware to the express app
app.use(errorHandler);


