export class BaseException extends Error {
    status: number;
    message: string;
}

export class NotFoundException extends BaseException {
    status = 404;

    constructor(msg?: string) {
        super();
        this.message = msg || 'content does not exist';
    }
}

export class UnauthorizedException extends BaseException {
    status = 401;

    constructor(msg?: string) {
        super();
        this.message = msg || 'please login';
    }
}

export class ForbiddenException extends BaseException {
    status = 403;

    constructor(msg?: string) {
        super();
        this.message = msg || 'no permission';
    }
}