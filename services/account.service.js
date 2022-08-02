import {promises as fs} from "fs"

const {readFile, writeFile} = fs

async function createAccount(account) {
    const data = JSON.parse(await readFile(global.fileName))
        
    account = { id: data.nextId++, name: account.name, balance: account.balance }

    data.accounts.push(account)

    //null, 2 no stringfy servem para formatar o documento
    await writeFile(global.fileName, JSON.stringify(data, null, 2))
    account.status = "success"

    return account
}

async function getAccounts() {
    const data = JSON.parse(await readFile(global.fileName))
    delete data.nextId

    return data
}

async function getAccount(id) {
    const data = JSON.parse(await readFile(global.fileName))
    const userById = data.accounts.find(account => account.id === parseInt(id))

    return userById || false
}

async function deleteAccount(id) {
    
    const data = JSON.parse(await readFile(global.fileName))
    const account_exist = data.accounts.find(account => account.id == id)
    
    if(!account_exist) throw new Error("Object not found!")
    
    data.accounts = data.accounts.filter(
        account => account.id !== parseInt(id)
    )

    await writeFile(global.fileName, JSON.stringify(data, null, 2))

}

async function updateAccount(account) {
    const data = JSON.parse(await readFile(global.fileName))
    const index = data.accounts.findIndex(content => content.id == account.id)
    
    if(!account.name || account.balance == null || account.id == null) throw new Error("Id, Name and Balance are required!")
    if(index === -1) throw new Error("This object not exists!")

    data.accounts[index].name = account.name
    data.accounts[index].balance = account.balance

    await writeFile(global.fileName, JSON.stringify(data))

    return account
}

async function updateBalance(account) {
    const data = JSON.parse(await readFile(global.fileName))
    const index = data.accounts.findIndex(content => content.id === account.id)
    
    if(account.balance == null || account.id == null) throw new Error("Id and Balance are required!")
    if(index === -1) throw new Error("This object not exists!")

    data.accounts[index].balance = account.balance

    await writeFile(global.fileName, JSON.stringify(data))
    return account
}

export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    updateAccount,
    updateBalance
    
}