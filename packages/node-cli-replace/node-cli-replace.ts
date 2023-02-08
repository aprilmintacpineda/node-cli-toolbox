import { promises as fs } from "fs";
import path from "path";

export type Options = {
  query: string;
  files: string;
  file: string;
  value: string;
  ignore: Array<string>;
  context: string;
  help: boolean;
  line: boolean;
};

function shouldIgnore(filePath: string, list: Array<string>) {
  return Boolean(
    list.find((item) => filePath.includes(item) || item.includes(filePath))
  );
}

async function replaceContents(fullPath: string, options: Options) {
  const { line, value, query } = options;
  let originalContents = await fs.readFile(fullPath, "utf-8");

  if (!line) {
    let contents = originalContents.replace(new RegExp(query, "gm"), value);
    await fs.writeFile(fullPath, contents);
  } else {
    const lines = originalContents.split("\n");
    const rule = new RegExp(query, "gm");

    let contents = lines.reduce((result, currentLine) => {
      if (rule.test(currentLine)) {
        if (!value) return result;
        return `${result}${value}\n`;
      }

      return `${result}${currentLine}\n`;
    }, "");

    await fs.writeFile(fullPath, contents);
  }

  console.log("WROTE in:", fullPath);
}

export async function replaceRecursive(options: Options) {
  const { context, file, files, ignore } = options;

  if (file) {
    const fullPath = path.resolve(process.cwd(), context, file);
    await replaceContents(fullPath, options);
  } else {
    const filePaths = await fs.readdir(path.resolve(process.cwd(), context));

    await Promise.all(
      filePaths.map(async (filePath) => {
        if (shouldIgnore(filePath, ignore)) return;

        let fullPath = path.resolve(context, filePath);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          await replaceRecursive({
            ...options,
            context: fullPath,
          });
        } else {
          if (!new RegExp(files, "gm").test(fullPath)) return;
          await replaceContents(fullPath, options);
        }
      })
    );
  }
}
