module.exports = (Function) => (req, res, next) => {
    Function(req, res, next).catch(next)
}
