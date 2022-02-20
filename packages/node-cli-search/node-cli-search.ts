import { promises as fs } from "fs";
import path from "path";

export type Options = {
  query: string;
  ignore: Array<string>;
  context: string;
  sensitive: boolean;
  help: boolean;
};

function shouldIgnore(filePath: string, list: Array<string>) {
  return Boolean(
    list.find((item) => filePath.includes(item) || item.includes(filePath))
  );
}

export async function searchRecursive(options: Options) {
  const filePaths = await fs.readdir(
    path.resolve(process.cwd(), options.context)
  );

  await Promise.all(
    filePaths.map(async (filePath) => {
      if (shouldIgnore(filePath, options.ignore)) return;

      let fullPath = path.resolve(options.context, filePath);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        await searchRecursive({
          ...options,
          context: fullPath,
        });
      } else {
        if (!options.sensitive) fullPath = fullPath.toLocaleLowerCase();

        if (fullPath.includes(options.query)) console.log(fullPath);
      }
    })
  );
}
