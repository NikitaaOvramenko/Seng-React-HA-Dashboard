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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_scp_1 = require("node-scp");
var dotenv = require("dotenv");
var path_1 = require("path");
var chalk_1 = require("chalk");
var promises_1 = require("fs/promises");
var prompts_1 = require("prompts");
// intentionally only loading the main .env so we're not using the token at all here.
dotenv.config();
var HA_URL = process.env.VITE_HA_URL;
var HA_TOKEN = process.env.VITE_HA_TOKEN;
var USERNAME = process.env.VITE_SSH_USERNAME;
var PASSWORD = process.env.VITE_SSH_PASSWORD;
var HOST_OR_IP_ADDRESS = process.env.VITE_SSH_HOSTNAME;
var PORT = 22;
var REMOTE_FOLDER_NAME = process.env.VITE_FOLDER_NAME;
var LOCAL_DIRECTORY = './dist';
var REMOTE_PATH = "/www/".concat(REMOTE_FOLDER_NAME);
function confirmDeploymentWithHaToken() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!HA_TOKEN) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, prompts_1.default)({
                            type: 'confirm',
                            name: 'value',
                            message: chalk_1.default.yellow("\nWARN: You are about to deploy to Home Assistant with VITE_HA_TOKEN set in .env.\n\nREAD MORE - https://shannonhochkins.github.io/ha-component-kit/?path=/docs/introduction-deploying--docs#important;\n\nWould you like to continue?"),
                            initial: true,
                        })];
                case 1:
                    response = (_a.sent());
                    if (response.value !== true) {
                        process.exit();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function checkDirectoryExists() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, promises_1.access)(LOCAL_DIRECTORY, promises_1.constants.F_OK)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deploy() {
    return __awaiter(this, void 0, void 0, function () {
        var exists, client, directories, matched, _i, directories_1, dir, remote, exists_1, e_1, url, e_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 12, , 13]);
                    if (!HA_URL) {
                        throw new Error('Missing VITE_HA_URL in .env file');
                    }
                    if (!REMOTE_FOLDER_NAME) {
                        throw new Error('Missing VITE_FOLDER_NAME in .env file');
                    }
                    if (!USERNAME) {
                        throw new Error('Missing VITE_SSH_USERNAME in .env file');
                    }
                    if (!PASSWORD) {
                        throw new Error('Missing VITE_SSH_PASSWORD in .env file');
                    }
                    if (!HOST_OR_IP_ADDRESS) {
                        throw new Error('Missing VITE_SSH_HOSTNAME in .env file');
                    }
                    return [4 /*yield*/, checkDirectoryExists()];
                case 1:
                    exists = _b.sent();
                    if (!exists) {
                        throw new Error('Missing ./dist directory, have you run `npm run build`?');
                    }
                    return [4 /*yield*/, (0, node_scp_1.Client)({
                            host: HOST_OR_IP_ADDRESS,
                            port: PORT,
                            username: USERNAME,
                            password: PASSWORD,
                        })];
                case 2:
                    client = _b.sent();
                    directories = ['config', 'homeassistant'];
                    matched = false;
                    _i = 0, directories_1 = directories;
                    _b.label = 3;
                case 3:
                    if (!(_i < directories_1.length)) return [3 /*break*/, 11];
                    dir = directories_1[_i];
                    remote = "/".concat(dir).concat(REMOTE_PATH);
                    return [4 /*yield*/, client.exists("/".concat(dir))];
                case 4:
                    exists_1 = _b.sent();
                    if (!exists_1) return [3 /*break*/, 10];
                    matched = true;
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, client.rmdir(remote)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    e_1 = _b.sent();
                    return [3 /*break*/, 8];
                case 8:
                    console.info(chalk_1.default.blue('Uploading', "\"".concat(LOCAL_DIRECTORY, "\""), 'to', "\"".concat(remote, "\"")));
                    // upload the folder to your home assistant server
                    return [4 /*yield*/, client.uploadDir(LOCAL_DIRECTORY, remote)];
                case 9:
                    // upload the folder to your home assistant server
                    _b.sent();
                    client.close(); // remember to close connection after you finish
                    console.info(chalk_1.default.green('\nSuccessfully deployed!'));
                    url = (0, path_1.join)(HA_URL, '/local', REMOTE_FOLDER_NAME, '/index.html');
                    console.info(chalk_1.default.blue("\n\nVISIT the following URL to preview your dashboard:\n"));
                    console.info(chalk_1.default.bgCyan(chalk_1.default.underline(url)));
                    console.info(chalk_1.default.yellow('\n\nAlternatively, follow the steps in the ha-component-kit repository to install the addon for Home Assistant so you can load your dashboard from the sidebar!\n\n'));
                    console.info('\n\n');
                    return [3 /*break*/, 11];
                case 10:
                    _i++;
                    return [3 /*break*/, 3];
                case 11:
                    if (!matched) {
                        throw new Error('Could not find a config/homeassistant directory in the root of your home assistant installation.');
                    }
                    return [3 /*break*/, 13];
                case 12:
                    e_2 = _b.sent();
                    if (e_2 instanceof Error) {
                        console.error(chalk_1.default.red('Error:', (_a = e_2.message) !== null && _a !== void 0 ? _a : 'unknown error'));
                    }
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
await confirmDeploymentWithHaToken();
deploy();
