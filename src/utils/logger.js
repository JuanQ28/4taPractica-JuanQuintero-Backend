import winston from "winston";
import { Arg } from "../config/commander.js";

export let logger

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "red",
        warning: "yellow",
        info: "cyan",
        http: "gray",
        debug: "white"
    }
}

if(Arg.mode === "prod"){
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevels.colors}),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                level: "error",
                filename: "errors.log",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint()
                )
            })
        ]
    })
}else{
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console({
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevels.colors}),
                    winston.format.simple()
                )
            })
        ]
    })
}