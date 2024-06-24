const notFound = (req, res) => {
    res.status(404).json('Not Found Route!')
}

module.exports = notFound