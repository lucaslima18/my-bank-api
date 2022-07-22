import express from "express"
import {promises as fs} from "fs"

const {readFile, writeFile} = fs
const router = express.Router()

global.fileName = "accounts.json"

router.post("/", async (req, res, next) => {
    try{
        let account = req.body

        if(!account.name || account.balance == null) throw new Error("Name and Balance are required!")

        const data = JSON.parse(await readFile(global.fileName))
        
        account = { id: data.nextId++, name: account.name, balance: account.balance }

        data.accounts.push(account)
        //null, 2 no stringfy servem para formatar o documento
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        account.status = "success"
        res.send(account)

        logger.info(`POST /account - ${JSON.stringify(account)}`)

    } catch(err) {
        next(err)

    }

    res.end()
})


router.get("/", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName))
        delete data.nextId

        res.send(data)

        logger.info("GET /account success called!")

    } catch(err) {
        next(err)

    }
})


router.get("/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName))
        const userById = data.accounts.find(account => account.id === parseInt(req.params.id))
        const account = userById || res.status(404).send({ error: "User Not Found!" })

        res.send(account)

        logger.info("GET /account/:id success called!")

    } catch(err) {
        next(err)

    }
})


router.delete("/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName))
        const account_exist = data.accounts.find(account => account.id == req.params.id)
        if(!account_exist) throw new Error("Object not found!")
        
        data.accounts = data.accounts.filter(
            account => account.id !== parseInt(req.params.id)
        )

        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        res.end()
        logger.info(`DELETE /account success called! deleting the ${req.params.id} object`)

    } catch(err) {
        next(err)
        
    }

})


//put é utilizado para atualizar o recurso de forma integral
router.put("/", async (req, res, next) => {
    try {
        const account = req.body
        const data = JSON.parse(await readFile(global.fileName))
        const index = data.accounts.findIndex(content => content.id === account.id)
        
        if(!account.name || account.balance == null || account.id == null) throw new Error("Id, Name and Balance are required!")
        if(index === -1) throw new Error("This object not exists!")

        data.accounts[index].name = account.name
        data.account[index].balance = account.balance

        await writeFile(global.fileName, JSON.stringify(data))

        res.send(account)

        logger.info(`POST /account - ${JSON.stringify(account)}`)
        
    } catch (err) {
        next(err)
    }
})


//patch é utilizado para atualizar o recurso de forma parcial
router.patch("/updateBalance", async (req, res, next) => {
    try {
        const account = req.body
        const data = JSON.parse(await readFile(global.fileName))
        const index = data.accounts.findIndex(content => content.id === account.id)
        
        if(account.balance == null || account.id == null) throw new Error("Id and Balance are required!")
        if(index === -1) throw new Error("This object not exists!")

        data.accounts[index].balance = account

        await writeFile(global.fileName, JSON.stringify(data))

        res.send(account)

        logger.info(`POST /account - ${JSON.stringify(account)}`)
        
    } catch (err) {
        next(err)
    }
})


router.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.baseUrl} ${err.message}`)
    res.status(400).send({ error: err.message })
})




export default router