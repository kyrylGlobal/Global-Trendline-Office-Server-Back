"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Errors {
    errorHandler(error, req, res, next) {
        const message = error.message || "Somesing went wrong";
        console.log(error);
        res.status(500).send({ message });
    }
}
exports.default = new Errors();
