const { connection: mongoConnection } = require('mongoose')
const server = require('./app')
const { connection } = require('./database')
const {
    server: { port },
} = require('./config')

server.listen(port, () => {
    console.log(`server is running on PORT: ${port}`)
    connection()
})

server.on('close', () => console.log('Server is closed!'))
server.on('error', (e) => console.log(e))

process.on('SIGINT', () => {
    server.close(async () => {
        await mongoConnection.close(false)
        process.exit(0)
    })
})

process.on('SIGTERM', () => {
    server.close(async () => {
        await mongoConnection.close(false)
        process.exit(0)
    })
})
