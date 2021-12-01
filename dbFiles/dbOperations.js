const config = require('./dbConfig')
const sql = require('mssql')

const executeQuery = async(query) => {
    try {
        let pool = await sql.connect(config)
        let result = pool.request().query(query)
        return (await result).recordset
    } catch (error) {
        console.log(error)
    }
}

const executeProcedure = async(procedure) => {
    try {
        let pool = await sql.connect(config)
        let result = pool.request().execute(procedure)
        return await result
    } catch (error) {
        console.log(error)
    }
}

const getTipoContratos = async() => {
    return await executeQuery(`SELECT IdTipoContrato,TipoContrato FROM CTO_TipoContrato`)
} 

module.exports = {getTipoContratos}