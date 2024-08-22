"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const copy = (src, dest) => {
    const exists = fs_1.default.existsSync(src);
    const stats = fs_1.default.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (['~', '#'].some(it => dest.includes(it)))
        return;
    dest = dest.replace("template", "");
    if (isDirectory) {
        if (!fs_1.default.existsSync(dest)) {
            fs_1.default.mkdirSync(dest);
        }
        fs_1.default.readdirSync(src).forEach(function (childItemName) {
            copy(path_1.default.join(src, childItemName), path_1.default.join(dest, childItemName));
        });
    }
    else {
        if (!fs_1.default.existsSync(dest)) {
            fs_1.default.copyFileSync(src, dest);
        }
    }
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    commander_1.program
        .version("1.0.0")
        .description("Plicit Starter Template Generator")
        .argument("<project-directory>", "Directory to create the project in")
        .action((projectDirectory) => {
        const projectPath = path_1.default.resolve(process.cwd(), projectDirectory);
        if (fs_1.default.existsSync(projectPath)) {
            console.error(`Error: Directory ${projectDirectory} already exists.`);
            process.exit(1);
        }
        fs_1.default.mkdirSync(projectPath, { recursive: true });
        console.info(`Creating a new Plicit project in ${projectPath}.`);
        const templateDir = path_1.default.resolve(__dirname, "template");
        fs_1.default.readdirSync(templateDir).forEach((file) => {
            if (!file.includes("~")) {
                const src = path_1.default.resolve(templateDir, file);
                const dest = path_1.default.resolve(projectPath, file);
                copy(src, dest);
            }
        });
        console.info(`Project setup complete!`);
        console.log(`You can now navigate to your project and type "npm run dev" to start coding!`);
        console.log(`\n  cd ${projectDirectory} && npm i && npm run dev`);
    });
    commander_1.program.parse(process.argv);
});
main().catch((e) => console.error(e));
//# sourceMappingURL=index.js.map