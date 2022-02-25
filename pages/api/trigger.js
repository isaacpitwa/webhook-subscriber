// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Redis = require("ioredis");
const redis = new Redis();

export default function handler(req, res) {
  const channel = 'PUSHES'
  const message = req.body

  redis.publish(channel, JSON.stringify(message));

  console.log("Published %s to %s", message, channel);

  res.status(200).json({ message: 'success' })
}
