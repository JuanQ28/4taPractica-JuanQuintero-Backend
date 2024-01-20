import { program } from "commander";

program
    .option("-m --mode <mode>", "Ambiente de ejecución", "dev")
    .option("-p --port <port>", "Puerto", 8080)
    .parse()

export const Arg = program.opts()