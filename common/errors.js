class MethodIncorrectError extends Error {
    constructor(message) {
        super(message)
        this.name = 'Method Incorrect'
        this.httpStatus = 405
    }
}

class BadRequestError extends Error {
    constructor(message) {
        super(message)
        this.name = 'Bad Request'
        this.httpStatus = 400
    }
}

class PageNotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'Page Not Found'
        this.httpStatus = 404
    }
}

class InternalServerError extends Error {
    constructor(message) {
        super(message)
        this.name = 'Internal Server'
        this.httpStatus = 500
    }
}

module.exports = { MethodIncorrectError, BadRequestError, PageNotFoundError, InternalServerError }