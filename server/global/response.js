const AppResponse = (status, message, data) => {
    return {
        error: false,
        status,
        message,
        data
    }
}

module.exports = AppResponse