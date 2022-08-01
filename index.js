import express from "express"
import winston from "winston"
import accountsRouter from "./routes/accounts.js"
import {promises as fs} from "fs"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { swaggerDocument } from "./doc.js"

const app = express()
const port = 3000
const {readFile, writeFile, copyFile} = fs
const {combine, timestamp, label, printf} = winston.format
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] - ${level}: ${message}`
})

//configurando os logs da nossa aplicação
global.fileName = "accounts.json"
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console),
        new(winston.transports.File)({ 
            filename: 'my-bank-api.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880,
            maxFiles: 10,
            colorize: true
        })
    ],
    format: combine(
        label({ label: "my-bank-api" }),
        timestamp(),
        myFormat
    )
})

//servindo arquivo fake para teste de cors
app.use(express.static("public"))

// para que o express utilize json
app.use(express.json())

//para evitar erros de cors
app.use(cors())

//servindo documentação via swagger 
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//importando rotas principais da api
app.use("/account", accountsRouter)




/**
 * armazenaremos as informações das nossas contas em um arquivo json
 * utilizar aremos rotas com roteadores
 * gravaremos logs
 */
app.listen(port, async () => {
    /**
     * Iremos definir que quando a aplicação suba, caso não exista um arquivo
     * accounts.json, a função irá criar um arquivo default
     * 
     * utilizaremos o nextId para incrementarmos um valor único para simular um sistema
     * de ID de um banco de dados
     */
    
    try {
        await readFile("accounts.json")
        logger.info(`API Started! listen on http://localhost:${port}`)

    } catch(err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }

        writeFile("accounts.json", JSON.stringify(initialJson)).then(() => {
            copyFile("accounts-lock.json", "accounts.json").then(() => {
                logger.info(`API Started! listen on http://localhost:${port}, FIle Created!`)
            }).catch(err => {
                logger.error(err)
            })
        }).catch(err => {
            logger.error(err)
        })
    }
    
})