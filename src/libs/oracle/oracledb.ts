import oracledb from 'oracledb'

import { getConfig } from '@/libs/oracle/config'

export type IOracleDB = ReturnType<typeof oracleDB>

async function oracleDB(mode: string) {
  const config = await getConfig()

  if (!config[mode]) throw new Error('Oracle connection string not found')

  return oracledb.getConnection({
    user: process.env.ORACLE_USER || 'kprusr',
    password: process.env.ORACLE_PWD || 'kprusr',
    connectString: config[mode]
  })
}

export async function oracleConnection(mode: string, callback: (connection: oracledb.Connection) => Promise<any>) {
  const connection = await oracleDB(mode)

  try {
    return await callback(connection)
  } catch (error) {
    console.error(error)
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error(err)
      }
    }
  }
}
