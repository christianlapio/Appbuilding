"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = (req, res, next) => {
    const start = Date.now();
    // Log request
    console.log(`📥 ${req.method} ${req.url} - ${req.ip}`);
    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? '🔴' : '🟢';
        console.log(`📤 ${statusColor} ${res.statusCode} ${req.method} ${req.url} - ${duration}ms`);
    });
    next();
};
exports.logger = logger;
//# sourceMappingURL=logger.js.map