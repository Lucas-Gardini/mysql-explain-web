import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import { subtle } from "node:crypto";
import { spawn } from "node:child_process";

const DEFAULT_DIR = "./temp/";
const EXPLAIN_COMMAND = `mysql_visual_explain_cli {JSON_PATH} {IMAGE_PATH}`;

async function generateFileHash(content: string): Promise<string> {
  const hashBuffer = await subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

async function ensureDirectoryExists(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

async function saveFileToDisk(
  content: string,
  filename: string
): Promise<string> {
  await ensureDirectoryExists(DEFAULT_DIR);
  const filePath = `${DEFAULT_DIR}${filename}`;
  await writeFile(filePath, content, "utf-8");
  return filePath;
}

async function generateExplainImage(explainPath: string): Promise<Buffer> {
  const command = EXPLAIN_COMMAND.replace(
    "{JSON_PATH}",
    `${explainPath}.json`
  ).replace("{IMAGE_PATH}", `${explainPath}.png`);

  return new Promise<Buffer>((resolve, reject) => {
    console.log("Executando comando:", command);

    const process = spawn(command, { shell: true });

    process.on("error", (err) => {
      reject(err);
    });

    process.on("exit", async (code) => {
      if (code === 0) {
        try {
          const imageBuffer = await readFile(`${explainPath}.png`);
          resolve(imageBuffer);
        } catch (readErr) {
          reject(readErr);
        }
      } else {
        reject(new Error(`Processo finalizado com código ${code}`));
      }

      await unlink(`${explainPath}.json`);
      await unlink(`${explainPath}.png`);
    });
  });
}

function validateAndParseJson(jsonString: string): object | null {
  try {
    return JSON.parse(jsonString);
  } catch {
    throw new Error("JSON inválido");
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ explain: string }>(event);
  const explain = validateAndParseJson(body.explain);
  const filename = await generateFileHash(JSON.stringify(explain));
  const filePath = await saveFileToDisk(
    JSON.stringify(explain, null, 4),
    `${filename}.json`
  );

  const imageBuffer = await generateExplainImage(filePath.replace(".json", ""));

  return {
    image: imageBuffer.toString("base64"),
  };
});
