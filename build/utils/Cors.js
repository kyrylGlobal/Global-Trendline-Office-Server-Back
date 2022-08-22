"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cors {
    allowDevCors(req, callBack) {
        const options = {};
        const allowDevOrigins = ['http://localhost:3000', 'http://192.168.1.230:3000'];
        if (allowDevOrigins.includes(req.header("Origin"))) {
            options.origin = true;
        }
        else {
            options.origin = false;
        }
        return callBack(null, options);
    }
}
exports.default = new Cors();
