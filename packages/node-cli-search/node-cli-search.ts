import { promises as fs } from "fs";
import path from "path";

export type Options = {
  query: string;
  ignore: Array<string>;
  context: string;
  sensitive: boolean;
  help: boolean;
};

function shouldIgnore(needle: string, list: Array<string>) {
  return Boolean(list.find((item) => item.includes(needle)));
}

export async function searchRecursive(options: Options) {
  const results = await fs.readdir(
    path.resolve(process.cwd(), options.context)
  );

  await Promise.all(
    results.map(async (result) => {
      if (shouldIgnore(result, options.ignore)) return;

      let fullPath = path.resolve(options.context, result);
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
