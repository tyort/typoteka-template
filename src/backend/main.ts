import { Cli } from "./cli";
import { ExitCode } from "../const";

// Все параметры, которые ввёл пользователь, доступны в массиве process.argv.
// process.argv[0] - записан путь к интерпретатору, то есть к Node.js.
// process.argv[1] - хранит путь к нашему сценарию.
// А параметры, введённые пользователем начинаются с process.argv[2].
const userArguments = process.argv.slice(2);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[`--help`].run();
  process.exit(ExitCode.Success);
}

Cli[userCommand].run(userArguments.slice(1));
