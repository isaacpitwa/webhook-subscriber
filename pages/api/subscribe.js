// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Server } from 'socket.io'

const Redis = require("ioredis");
const redis = new Redis();
const channel = 'PUSHES'

export default function handler(req, res) {
    let io = res.socket.server.io
    if (res.socket.server.io) {
    console.log('Socket is already running')
    } else {
    console.log('Socket is initializing')
    io = new Server(res.socket.server)
    res.socket.server.io = io
    }
    redis.subscribe(channel, (err, count) => {
        if (err) {
            // Just like other commands, subscribe() can fail for some reasons,
            // ex network issues.
            console.error("Failed to subscribe: %s", err.message);
        } else {
            // `count` represents the number of channels this client are currently subscribed to.
            console.log(
            `Subscribed successfully! This client is currently subscribed to ${count} channels.`
            );
        }
    })
    io.on("connection", (socket) => {
        redis.on("message", (channel, message) => {
            console.log(`Received ${message} from ${channel}`);
            socket.emit(channel, message);
        });
    });
    res.status(200).json({ message: 'success' })
}