#!/usr/bin/env node

import cliArgs from "command-line-args";
import cliUsage from "command-line-usage";
import { Options, replaceRecursive } from "./node-cli-replace";

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
    description:
      "Required: What you want to be replaced. This will be used in regex as case-sensitive.",
    type: String,
    isRequired: true,
  },
  {
    name: "value",
    alias: "v",
    description:
      "The value that you want to put in place of what you wanted to be replaced. If you don't provide a value, the matching strings will effectively be removed.",
    type: String,
  },
  {
    name: "file",
    alias: "f",
    description:
      "Required: The specific file that you want to be processed. This will be used in regex as case-sensitive. If provided, it will look for the file in the current directory, or in the directory provided in context parameter, and only process that one file.",
    type: String,
  },
  {
    name: "files",
    alias: "d",
    description:
      "Required: The files that you want to be processed. This will be used in regex as case-sensitive. If provided, it will look for ALL FILES WITH MATCHING FILE NAME in the current directory, or in the directory provided in context parameter, and process ALL matching files.",
    type: String,
  },
  {
    name: "line",
    alias: "l",
    description:
      "If you want it to behave in a line-by-line manner. This is useful when you want to remove or replace the whole line with something else.",
    type: Boolean,
  },
  {
    name: "ignore",
    alias: "i",
    description:
      "comma separated list of folders you don't want to search in, e.g., if you put node_modules node-cli-replace will not search in node_modules. This is case-sensitive.",
    type: String,
  },
  {
    name: "context",
    alias: "c",
    description:
      "The folder you want to start searching in. By default, this will search the current directory.",
    type: String,
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
      header: "node-cli-replace",
      content:
        "A CLI tool written in TypeScript that allows you to replace a string in a specific file or all files that matches your filter.",
    },
    {
      header: "Options",
      optionList,
    },
  ]);

  console.log(usage);
} else {
  // validation required fields
  if (!argv.query) throw new Error("Please provide the query option.");

  if (!argv.file && !argv.files)
    throw new Error("Please provide the file or files option.");

  if (argv.file && argv.files)
    throw new Error("Please only provide file or files option but not both.");

  const start = performance.now();

  const options: Options = {
    ...argv,
    context: argv.context || process.cwd(),
    ignore: (argv.ignore || "").split(",").map((ignore) => ignore.trim()),
    value: argv.value || "",
  };

  replaceRecursive(options)
    .then(() => {
      console.log("Completed in", Math.ceil(performance.now() - start), "ms");
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
