const server = require('./app')
const { connection } = require('./database')
const {
    server: { port },
} = require('./config')

connection().catch((err) => {
    console.log(err)
})

server.listen(port, () => {
    console.log(`server is running on ${port}`)
})
