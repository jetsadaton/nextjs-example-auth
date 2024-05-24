import oracledb from 'oracledb'

import Oracle from '@/libs/oracle'
import type { InOutParamsType } from '@/types/oracleType'

export const useGetUsers = () => {
  const oracle = new Oracle('OPPNAUD.KIMPAI.COM')

  const getAllUsers = async () => {
    const sql = 'SELECT * FROM users where user_id = :user_id'
    const sql2 = 'SELECT ols_id FROM users where user_id = :user_id'

    const users = await oracle.queries([
      { sql, params: ['sysadm'] },
      { sql: sql, params: ['itpool'] },
      { sql: sql2, params: ['itpool'] }
    ])

    return users
  }

  const createTest = async () => {
    const sql = 'INSERT INTO kpdba.ton_test (id, test1, test2) VALUES (:id, :test1, :test3)'

    const id = () => Math.random().toString(36).substring(7)

    const bindDefs = [
      { type: oracledb.STRING, maxSize: 255 },
      { type: oracledb.STRING, maxSize: 255 },
      { type: oracledb.STRING, maxSize: 255 }
    ]

    const users = await oracle.commandMany(
      sql,
      [
        [id(), 'test4', 'test4'],
        [id(), 'test5', 'test5']
      ],
      bindDefs
    )

    return users
  }

  const exSp = async () => {
    const spName = `KPDBA.PACK_COSTING.SP_GET_COST_ID2`

    const input: InOutParamsType = {
      AN_YEAR: {
        type: oracledb.NUMBER,
        dir: oracledb.BIND_IN,
        value: 2023
      },
      AN_MONTH: {
        type: oracledb.NUMBER,
        dir: oracledb.BIND_IN,
        value: 10
      }
    }

    const out: InOutParamsType = {
      V_NEW_COST_ID: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
    }

    type SpOutputType = { V_NEW_COST_ID: string }

    const res = await oracle.commandSp<SpOutputType>({
      spName,
      output: out,
      input: input
    })

    console.log(res)

    return res
  }

  return { getAllUsers, createTest, exSp }
}
