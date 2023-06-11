const AppError = (errors, status) => {
    return {
        error: true,
        status,
        message: errors
    }
}

module.exports = AppError