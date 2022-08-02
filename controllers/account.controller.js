import AccountService from "../services/account.service.js"

async function createAccount(req, res, next) {
    try{
        let account = req.body

        if(!account.name || account.balance == null) throw new Error("Name and Balance are required!")

        account = await AccountService.createAccount(account)

        res.send(account)
        logger.info(`POST /account - ${JSON.stringify(account)}`)

    } catch(err) {
        next(err)

    }

    res.end()
}

async function getAccounts(_, res, next) {
    try {
        res.send(await AccountService.getAccounts())
        logger.info("GET /account success called!")

    } catch(err) {
        next(err)

    }
}

async function getAccount(req, res, next) {
    try {
        const id = req.params.id
        const account = await AccountService.getAccount(id)

        account != false ? res.send(account) : res.status(404).send({ error: "User Not Found!" }) 

        logger.info("GET /account/:id success called!")

    } catch(err) {
        next(err)

    }
}

async function deleteAccount(req, res, next) {
    try {
        await AccountService.deleteAccount(req.params.id)

        res.end()
        logger.info(`DELETE /account success called! deleting the ${req.params.id} object`)

    } catch(err) {
        next(err)
        
    }
}

async function updateAccount(req, res, next) {
    try {
        let account = req.body
        account = await AccountService.updateAccount(account)

        res.send(account)

        logger.info(`POST /account - ${JSON.stringify(account)}`)
        
    } catch (err) {
        next(err)
    }
}

async function updateBalnace(req, res, next) {
    try {
        const account = req.body
        account = await AccountService.updateBalance(account)

        res.send(account)

        logger.info(`POST /account - ${JSON.stringify(account)}`)
        
    } catch (err) {
        next(err)
    }
}

export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    updateAccount,
    updateBalnace

}