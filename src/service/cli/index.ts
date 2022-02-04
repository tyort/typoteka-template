import generate from "./generate";
import version from "./version";
import help from "./help";

type cliModule = {
  name: string;
  run: (args?: string[]) => void;
}

export const Cli = {
  [generate.name]: generate as cliModule,
  [help.name]: help as cliModule,
  [version.name]: version as cliModule,
};
