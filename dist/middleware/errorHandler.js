"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    var _a;
    // Fallbacks
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";
    const logPrefix = err.logPrefix || "[GLOBAL:ERROR]";
    // Prevent leaking full message in production
    const isProduction = process.env.NODE_ENV === "production";
    const responseMessage = statusCode === 500 && isProduction ? "Something went wrong" : err.message;
    // Log full error details
    console.error(`${logPrefix} ${err.message}`, {
        message: err.message,
        stack: err.stack,
        route: req.originalUrl,
        method: req.method,
        ip: req.ip,
        user: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null,
    });
    return res.status(statusCode).json({
        status,
        message: responseMessage,
        errors: err.errors || [],
        data: {},
    });
}
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map