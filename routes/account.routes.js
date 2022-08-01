import express from "express"
import {promises as fs} from "fs"
import AccountController from "../controllers/account.controller.js"

const router = express.Router()

global.fileName = "accounts.json"

router.post("/", AccountController.createAccount)

router.get("/", AccountController.getAccounts)

router.get("/:id",AccountController.getAccount)

router.delete("/:id", AccountController.deleteAccount)

//put é utilizado para atualizar o recurso de forma integral
router.put("/", AccountController.updateAccount)

//patch é utilizado para atualizar o recurso de forma parcial
router.patch("/updateBalance", AccountController.updateBalnace)

router.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.baseUrl} ${err.message}`)
    res.status(400).send({ error: err.message })
})

export default router