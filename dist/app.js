"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes/"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = __importDefault(require("knex"));
const path_1 = __importDefault(require("path"));
const objection_1 = require("objection");
const knexfile_1 = __importDefault(require("./knexfile"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
// import rateLimit from "./middleware/rateLimit";
const app = (0, express_1.default)();
// Initialize knex
const knex = (0, knex_1.default)(knexfile_1.default[process.env.NODE_ENV]);
objection_1.Model.knex(knex);
// Middleware
app.use((0, cors_1.default)({ origin: '*' }));
app.use(body_parser_1.default.json({ limit: '5mb' }));
app.use(express_1.default.json({ limit: '5mb' })); // <<== Correctly use express.json
// app.use(rateLimit);
// Serve uploaded images statically (MOUNT before routes)
app.use('/public', express_1.default.static(path_1.default.join(process.cwd(), 'public')));
// API routes
app.use(routes_1.default);
app.use(errorHandler_1.default); // must come after all routes
exports.default = app;
//# sourceMappingURL=app.js.map