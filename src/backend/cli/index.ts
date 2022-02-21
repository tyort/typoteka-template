import generate from "./generate";
import version from "./version";
import help from "./help";
import server from "./server";

type cliModule = {
  name: string;
  run: (args?: string[]) => void;
}

export const Cli = {
  [generate.name]: generate as cliModule,
  [help.name]: help as cliModule,
  [version.name]: version as cliModule,
  [server.name]: server as cliModule,
};
