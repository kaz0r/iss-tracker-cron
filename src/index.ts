import Redis from 'ioredis'
import * as cron from 'node-cron'
import dotenv from 'dotenv'

dotenv.config()

interface IssData {
  message: string,
  iss_position: {
    latitude: string,
    longitude: string,
  }
  timestamp: number
}

const getRedisClient = () => {
  const REDIS_HOST = process.env.REDIS_HOST
  const REDIS_PORT = process.env.REDIS_PORT
  const REDIS_PASSWORD = process.env.REDIS_PASSWORD

  const redis = new Redis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    password: REDIS_PASSWORD
  })

  return redis
}

const main = async () => {
  try {
    const response = await fetch("http://api.open-notify.org/iss-now.json")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const body = await response.json() as IssData
    const redis = getRedisClient()
    const timestamp = Date.now()

    // Store the latest position with 24h TTL
    await redis.setex("iss:latest", 86400, JSON.stringify({
      ...body.iss_position,
      timestamp
    }))

    // Store position in a list for path tracking (keep last 4000 positions)
    await redis.lpush("iss:path", JSON.stringify({
      ...body.iss_position,
      timestamp
    }))

    // Trim the list to keep only last 4000 positions
    await redis.ltrim("iss:path", 0, 4000)

    console.log(`ISS position updated: ${body.iss_position.latitude}, ${body.iss_position.longitude}`)

    await redis.quit()
  } catch (error) {
    console.error('Error updating ISS position:', error)
  }
}

// Schedule cron job to run every 5 seconds
cron.schedule('*/5 * * * * *', () => {
  console.log('Running ISS tracker at:', new Date().toISOString())
  main()
})

console.log('ISS Tracker cron job started - running every 5 seconds')