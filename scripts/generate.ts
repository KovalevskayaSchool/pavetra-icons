import * as path from "node:path";
import * as fs from "node:fs";
import { stat } from "node:fs";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import { transform } from "@svgr/core";

const readFile = (file: string): Promise<string> =>
  new Promise((resolve, reject) =>
    fs.readFile(file, "utf8", (err, data) =>
      err ? reject(err) : resolve(data)
    )
  );

function clearAndUpper(text: string) {
  return text.replace(/-/, "").toUpperCase();
}

function toPascalCase(text: string) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

async function createIfNotExistsFolderByName(
  directory: string
): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    stat(directory, async (err, stats) => {
      if (err) {
        await mkdir(directory);
      }

      return resolve(stats);
    });
  });
}

const renderTemplate = (
  { imports, interfaces, componentName, props, jsx, exports }: any,
  { tpl }: any
) => {
  return tpl`
  ${imports}
  ${interfaces}

  export const ${componentName} = (${props}) => {
    return ${jsx};
  }
  ${componentName}.displayName = '${componentName}';
  ${exports}
  `;
};

function getFolders(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const folderIconPath = path.resolve(__dirname, `../src/svgs`);

    fs.readdir(folderIconPath, { withFileTypes: true }, (err, files) => {
      const folders = files
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      return resolve(folders || []);
    });
  });
}

const generateIcons = async (): Promise<void> => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const folders = await getFolders();

  folders.forEach(async (folder) => {
    const folderIconPath = path.resolve(__dirname, `../src/svgs/${folder}`);
    const outputIconPath = path.join(__dirname, `../src/lib`, folder);
    await createIfNotExistsFolderByName(outputIconPath);
    fs.readdir(folderIconPath, async (err, files) => {
      files.forEach(async (file) => {
        if (!file.includes(".svg")) {
          return;
        }

        const svgCode: string = await readFile(path.join(folderIconPath, file));

        const componentName = toPascalCase(file.replace(".svg", ""));
        const hasFillNone = svgCode.includes('fill="none"');
        const jsCode = await transform.sync(
          svgCode,
          {
            icon: true,
            template: renderTemplate,
            replaceAttrValues: {
              stroke: "currentColor", // if fill none - replace it
            },
            svgProps: {
              fill: hasFillNone ? "none" : "currentColor",
            },
          },
          { componentName }
        );

        fs.writeFile(
          path.join(outputIconPath, componentName + ".tsx"),
          jsCode,
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      });
    });
  });

  generateInputFile();
};

const generateInputFile = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const folders = await getFolders();
  folders.forEach((folder) => {
    const folderIconPath = path.resolve(__dirname, `../src/lib/${folder}`);
    const inputFilePath = path.resolve(__dirname, `../src/lib/index.ts`);

    fs.readdir(folderIconPath, async (err, files) => {
      const templateCode = files.reduce((acc, file) => {
        if (!file.includes(".tsx")) {
          return acc;
        }

        const component = file.replace(".tsx", "");

        return (
          acc + `\nexport { ${component} } from './${folder}/${component}';`
        );
      }, "");

      fs.writeFile(inputFilePath, templateCode, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
  });
};

generateIcons();
