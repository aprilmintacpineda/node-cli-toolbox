import { promises as fs } from "fs";
import path from "path";

export type Options = {
  query: string;
  file: string;
  value: string;
  ignore: Array<string>;
  context: string;
  help: boolean;
};

function shouldIgnore(filePath: string, list: Array<string>) {
  return Boolean(
    list.find((item) => filePath.includes(item) || item.includes(filePath))
  );
}

export async function replaceRecursive(options: Options) {
  const filePaths = await fs.readdir(
    path.resolve(process.cwd(), options.context)
  );

  await Promise.all(
    filePaths.map(async (filePath) => {
      if (shouldIgnore(filePath, options.ignore)) return;

      let fullPath = path.resolve(options.context, filePath);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        await replaceRecursive({
          ...options,
          context: fullPath,
        });
      } else {
        if (!new RegExp(options.file, "gm").test(fullPath)) return;

        let contents = await fs.readFile(fullPath, "utf-8");

        contents = contents.replace(
          new RegExp(options.query, "gm"),
          options.value
        );

        await fs.writeFile(fullPath, contents);

        console.log("WROTE in:", fullPath);
      }
    })
  );
}
