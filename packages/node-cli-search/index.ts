#!/usr/bin/env node

import cliArgs from "command-line-args";
import cliUsage from "command-line-usage";
import { Options, searchRecursive } from "./node-cli-search";

type _Options = Options & {
  ignore: string;
};

type OptionDefinition = {
  name: string;
  description: string;
  alias: string;
  type: StringConstructor | BooleanConstructor;
  isRequired?: boolean;
};

const optionList: Array<OptionDefinition> = [
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
    description:
      "Required: comma separated list of folders you don't want to search in, e.g., if you put node_modules node-cli-search will not search in node_modules. This is case-sensitive.",
    type: String,
    isRequired: true,
  },
  {
    name: "context",
    alias: "c",
    description:
      "The folder you want to start searching in. By default, this will search the current directory.",
    type: String,
    isRequired: true,
  },
  {
    name: "sensitive",
    alias: "s",
    description:
      "If you want the search to be case-sensitive. By default it is case-insensitive. This does not affect ignore option.",
    type: Boolean,
  },
  {
    name: "help",
    alias: "h",
    description: "Display this help info.",
    type: Boolean,
  },
];

const argv = cliArgs(optionList) as _Options;

if (argv.help) {
  const usage = cliUsage([
    {
      header: "node-search-cli",
      content:
        "A CLI tool written in TypeScript that allows you to search a whole directory for a file or folder",
    },
    {
      header: "Options",
      optionList,
    },
  ]);

  console.log(usage);
} else {
  const options: Options = {
    ...argv,
    context: argv.context || process.cwd(),
    query: argv.sensitive ? argv.query : argv.query.toLocaleLowerCase(),
    ignore: (argv.ignore || "").split(",").map((ignore) => ignore.trim()),
  };

  if (!options.query) throw new Error("Please provide the query option");

  searchRecursive(options);
}
