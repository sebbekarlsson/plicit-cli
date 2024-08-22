import { program } from "commander";
import path from "path";
import fs from "fs";

const copy = (src: string, dest: string) => {
  const exists = fs.existsSync(src);
  const stats = fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (["~", "#"].some((it) => dest.includes(it))) return;

  dest = dest.replace("template", "");

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(function (childItemName) {
      copy(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  }
};

const main = async () => {
  program
    .version("1.0.0")
    .description("Plicit Starter Template Generator")
    .argument("<project-directory>", "Directory to create the project in")
    .action((projectDirectory) => {
      const projectPath = path.resolve(process.cwd(), projectDirectory);

      if (fs.existsSync(projectPath)) {
        console.error(`Error: Directory ${projectDirectory} already exists.`);
        process.exit(1);
      }

      fs.mkdirSync(projectPath, { recursive: true });
      console.info(`Creating a new Plicit project in ${projectPath}.`);

      const templateDir = path.resolve(__dirname, "template");
      fs.readdirSync(templateDir).forEach((file) => {
        if (!file.includes("~")) {
          const src = path.resolve(templateDir, file);
          const dest = path.resolve(projectPath, file);

          copy(src, dest);
        }
      });

      console.info(`Project setup complete!`);
      console.log(
        `You can now navigate to your project and type "npm run dev" to start coding!`,
      );
      console.log(`\n  cd ${projectDirectory} && npm i && npm run dev`);
    });

  program.parse(process.argv);
};

main().catch((e) => console.error(e));
