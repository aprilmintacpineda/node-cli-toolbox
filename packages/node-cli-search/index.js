#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_args_1 = __importDefault(require("command-line-args"));
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const node_cli_search_1 = require("./node-cli-search");
const optionList = [
    {
        name: "query",
        alias: "q",
        description: "Required: The string you want to search",
        type: String,
        isRequired: true,
    },
    {
        name: "ignore",
        alias: "i",
        description: "Required: comma separated list of folders you don't want to search in, e.g., if you put node_modules node-cli-search will not search in node_modules. This is case-sensitive.",
        type: String,
        isRequired: true,
    },
    {
        name: "context",
        alias: "c",
        description: "The folder you want to start searching in. By default, this will search the current directory.",
        type: String,
        isRequired: true,
    },
    {
        name: "sensitive",
        alias: "s",
        description: "If you want the search to be case-sensitive. By default it is case-insensitive. This does not affect ignore option.",
        type: Boolean,
    },
    {
        name: "help",
        alias: "h",
        description: "Display this help info.",
        type: Boolean,
    },
];
const argv = (0, command_line_args_1.default)(optionList);
if (argv.help) {
    const usage = (0, command_line_usage_1.default)([
        {
            header: "node-search-cli",
            content: "A CLI tool written in TypeScript that allows you to search a whole directory for a file or folder",
        },
        {
            header: "Options",
            optionList,
        },
    ]);
    console.log(usage);
}
else {
    const options = Object.assign(Object.assign({}, argv), { context: argv.context || process.cwd(), query: argv.sensitive ? argv.query : argv.query.toLocaleLowerCase(), ignore: (argv.ignore || "").split(",").map((ignore) => ignore.trim()) });
    if (!options.query)
        throw new Error("Please provide the query option");
    (0, node_cli_search_1.searchRecursive)(options);
}
