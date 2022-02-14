"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRecursive = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function shouldIgnore(needle, list) {
    return Boolean(list.find((item) => item.includes(needle)));
}
function searchRecursive(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield fs_1.promises.readdir(path_1.default.resolve(process.cwd(), options.context));
        yield Promise.all(results.map((result) => __awaiter(this, void 0, void 0, function* () {
            if (shouldIgnore(result, options.ignore))
                return;
            let fullPath = path_1.default.resolve(options.context, result);
            const stat = yield fs_1.promises.stat(fullPath);
            if (stat.isDirectory()) {
                yield searchRecursive(Object.assign(Object.assign({}, options), { context: fullPath }));
            }
            else {
                if (!options.sensitive)
                    fullPath = fullPath.toLocaleLowerCase();
                if (fullPath.includes(options.query))
                    console.log(fullPath);
            }
        })));
    });
}
exports.searchRecursive = searchRecursive;
