import connectDatabase from './config/db.js'
import app from './app.js'

const port = process.env.PORT || 5000
connectDatabase()
  .then(() => app.listen(port, () => console.log(`API listening on port ${port}`)))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  })
