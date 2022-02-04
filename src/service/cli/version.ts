import packageJsonFile from "../../../package.json";

const version = {
  name: `--version`,
  run() {
    const currentVersion = packageJsonFile.version;
    console.info(currentVersion);
  }
};

export default version;
