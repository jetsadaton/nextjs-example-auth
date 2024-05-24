import type { Result } from 'oracledb'
import oracledb from 'oracledb'

import { StopWatch } from 'stopwatch-node'

import moment from 'moment'

import { oracleConnection } from './oracledb'
import type { CommandsSpType, ErrorType } from '@/types/oracleType'
import { convertSQL } from '@/utils/sqlHelper'
import Tracker from '../tracker'
import { convertSqlToBody } from '@/utils/tracker'

class Oracle {
  dbName: string
  options = {
    autoCommit: false,
    outFormat: oracledb.OUT_FORMAT_OBJECT
  }
  optionExecuteMany = {
    autoCommit: false,
    batchErrors: true
  }
  constructor(dbName: string) {
    this.dbName = dbName
  }

  /*
  For Function query, queries, command, and commands

  Read on => https://node-oracledb.readthedocs.io/en/latest/user_guide/sql_execution.html
  Example:
  const sql = `SELECT * FROM mytab WHERE id = :id`
  const params = { id: 101 }
  const result = await command(sql, params, options)
  */
  async query<T>(sql: string, params?: oracledb.BindParameters): Promise<T[] | ErrorType> {
    return await oracleConnection(this.dbName, async connection => {
      const header = moment().toLocaleString() + ' => Query' + ' DataBase Host : ' + this.dbName
      const body = convertSqlToBody(sql, params)
      const tracker = await Tracker.getInstance()

      try {
        const sw = new StopWatch()

        sw.start()
        const result = await connection.execute<T>(sql, params || [], this.options)

        sw.stop()

        if (tracker)
          tracker.sendMessages({
            Header: header,
            Body: body,
            Footer: '',
            TimeStamp: (sw.getTotalTime() / 1000).toString()
          })

        return result.rows ? result.rows : []
      } catch (error: any) {
        console.error(error)

        if (tracker)
          tracker.sendMessages({
            Header: `Error ${header}`,
            Body: body,
            Footer: error.message,
            TimeStamp: '0'
          })

        return { Error: error.message || 'Error querying Oracle database' }

        // throw new Error(error.message || 'Error querying Oracle database')
      }
    })
  }

  async queries<T>(queries: { sql: string; params?: oracledb.BindParameters }[]): Promise<T[][] | ErrorType> {
    return await oracleConnection(this.dbName, async connection => {
      const header = moment().toLocaleString() + ' => Queries' + ' DataBase Host : ' + this.dbName
      const tracker = await Tracker.getInstance()

      const results = await Promise.all(
        queries.map(async query => {
          const sw = new StopWatch()

          sw.start()

          const body = convertSqlToBody(query.sql, query.params)

          try {
            const result = await connection.execute<T>(query.sql, query.params || [], this.options)

            sw.stop()

            if (tracker)
              tracker.sendMessages({
                Header: header,
                Body: body,
                Footer: '',
                TimeStamp: (sw.getTotalTime() / 1000).toString()
              })

            return result.rows ? result.rows : []
          } catch (error: any) {
            if (tracker)
              tracker.sendMessages({
                Header: `Error ${header}`,
                Body: body,
                Footer: error.message,
                TimeStamp: '0'
              })

            return { Error: error.message || 'Error querying Oracle database' }

            // throw new Error(error.message || 'Error executing Oracle command')
          }
        })
      )

      if (results.some(result => 'Error' in result)) {
        return results.find(result => 'Error' in result)
      }

      return results
    })
  }

  async command<T>(sql: string, params?: oracledb.BindParameters): Promise<Result<T> | ErrorType> {
    return await oracleConnection(this.dbName, async connection => {
      const header = moment().toLocaleString() + ' => Command' + ' DataBase Host : ' + this.dbName
      const body = convertSqlToBody(sql, params)
      const tracker = await Tracker.getInstance()

      try {
        const sw = new StopWatch()

        sw.start()
        const result = await connection.execute<T>(sql, params || [], this.options)

        if (result.rowsAffected && result.rowsAffected > 0) {
          await connection.commit()
        }

        sw.stop()

        if (tracker)
          tracker.sendMessages({
            Header: header,
            Body: body,
            Footer: '',
            TimeStamp: (sw.getTotalTime() / 1000).toString()
          })

        return result
      } catch (error: any) {
        console.error(error)

        if (tracker)
          tracker.sendMessages({
            Header: `Error ${header}`,
            Body: body,
            Footer: error.message,
            TimeStamp: '0'
          })

        return { Error: error.message || 'Error executing Oracle command' }

        // throw new Error(error.message || 'Error executing Oracle command')
      }
    })
  }

  async commands<T>(commands: { sql: string; params: oracledb.BindParameters }[]): Promise<Result<T> | ErrorType> {
    const header = moment().toLocaleString() + ' => Commands' + ' DataBase Host : ' + this.dbName
    const tracker = await Tracker.getInstance()

    return await oracleConnection(this.dbName, async connection => {
      const results = await Promise.all(
        commands.map(async command => {
          const sw = new StopWatch()

          const body = convertSqlToBody(command.sql, command.params)

          try {
            sw.start()
            const result = await connection.execute<T>(command.sql, command.params, this.options)

            sw.stop()

            if (tracker)
              tracker.sendMessages({
                Header: header,
                Body: body,
                Footer: '',
                TimeStamp: (sw.getTotalTime() / 1000).toString()
              })

            return result
          } catch (error: any) {
            if (tracker)
              tracker.sendMessages({
                Header: `Error ${header}`,
                Body: body,
                Footer: error.message,
                TimeStamp: '0'
              })
            await connection.rollback()

            return { Error: error.message || 'Error executing Oracle command' }

            // throw new Error(error.message || 'Error executing Oracle command')
          }
        })
      )

      const checked = results.every(result => result !== undefined)

      if (checked) {
        await connection.commit()
      }

      if (results.some(result => 'Error' in result)) {
        return results.find(result => 'Error' in result)
      } else {
        return results
      }
    })
  }

  /*
  Read on => https://node-oracledb.readthedocs.io/en/latest/user_guide/batch_statement.html#handling-data-errors-with-executemany
  Example:
  const sql = `INSERT INTO mytab VALUES (:1, :2)`
  const binds = [
    [101, 'Alpha'],
    [102, 'Beta'],
    [103, 'Gamma']
  ]
  const options = {
    bindDefs: {
      1: { type: oracledb.NUMBER },
      2: { type: oracledb.STRING, maxSize: 20 }
    }
  }
  await commandMany(sql, binds, options)
  */
  async commandMany<T>(
    sql: string,
    params: oracledb.BindParameters[],
    bindDefs: Record<string, oracledb.BindDefinition> | oracledb.BindDefinition[] | undefined
  ): Promise<Result<T> | ErrorType> {
    return await oracleConnection(this.dbName, async connection => {
      const header = moment().toLocaleString() + ' => Command' + ' DataBase Host : ' + this.dbName
      const body = convertSqlToBody(sql, params)
      const tracker = await Tracker.getInstance()

      try {
        const sw = new StopWatch()

        sw.start()
        const options = { ...this.optionExecuteMany, bindDefs } as oracledb.ExecuteManyOptions

        const result = await connection.executeMany<T>(sql, params, options)

        sw.stop()

        if (result.batchErrors && result.batchErrors.length > 0) {
          await connection.rollback()

          if (tracker)
            tracker.sendMessages({
              Header: `Error ${header}`,
              Body: body,
              Footer: JSON.stringify(result.batchErrors),
              TimeStamp: (sw.getTotalTime() / 1000).toString()
            })

          // throw new Error(result.batchErrors[0].message)
          return { Error: result.batchErrors[0].message }
        } else {
          if (tracker)
            tracker.sendMessages({
              Header: header,
              Body: body,
              Footer: '',
              TimeStamp: (sw.getTotalTime() / 1000).toString()
            })
          await connection.commit()
        }

        return result
      } catch (error: any) {
        console.error(error)
        await connection.rollback()

        if (tracker)
          tracker.sendMessages({
            Header: `Error ${header}`,
            Body: body,
            Footer: error.message,
            TimeStamp: '0'
          })

        return { Error: error.message || 'Error executing Oracle command' }

        // throw new Error(error.message || 'Error executing Oracle command')
      }
    })
  }

  /*

  Example:
   const spName = `KPDBA.PACK_COSTING.SP_GET_COST_ID`;
   const input: InOutParamsType = {
      AN_YEAR: {
        type: OracleDB.NUMBER,
        dir: OracleDB.BIND_IN,
        value: year,
      },
      AN_MONTH: {
        type: OracleDB.NUMBER,
        dir: OracleDB.BIND_IN,
        value: month,
      },
    };
    const out: InOutParamsType = {
      V_NEW_COST_ID: { type: oracledb.STRING, dir: OracleDB.BIND_OUT },
    };
    type SpOutputType = { V_NEW_COST_ID: string; }
    const res = await commandSp<SpOutputType>({
      spName,
      output: out,
      input: input,
    });
    return res.output.V_NEW_COST_ID;
  */
  async commandSp<T>(
    queries: CommandsSpType,
    commit: boolean = false
  ): Promise<{ rowsAffected: number; output: T } | { Error: string }> {
    try {
      const result = await this.commandsSp([queries], commit)

      return 'Error' in result
        ? { Error: result.Error }
        : { rowsAffected: result[0].rowsAffected, output: result[0].output as T }
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message || 'Error executing Oracle command')
    }
  }
  async commandsSp(
    queries: CommandsSpType[],
    commit: boolean = false
  ): Promise<{ rowsAffected: number; output: any }[] | { Error: string }> {
    return await oracleConnection(this.dbName, async connection => {
      const header = moment().toLocaleString() + ' => CommandsSP' + ' DataBase Host : ' + this.dbName
      const tracker = await Tracker.getInstance()

      const output = []
      const _sqlLog: string[] = []

      for await (const obj of queries) {
        const sw = new StopWatch()

        sw.start()

        const _sql = `
              BEGIN
              ${obj.spName}(${
                obj.input
                  ? Object.keys(obj.input)
                      .map(x => `:${x}`)
                      .join(', ')
                  : ''
              }${obj.input ? ',' : ''}${
                obj.output
                  ? Object.keys(obj.output)
                      .map(x => `:${x}`)
                      .join(', ')
                  : ''
              });
            END;`

        const convertParam = obj.input
          ? Object.keys(obj.input).reduce((pre, curr) => {
              return { ...pre, [curr]: obj.input![curr].value }
            }, {})
          : undefined

        const sql = convertSQL('oracle', _sql, convertParam)

        _sqlLog.push(sql)
        const bindOutput: any = {}

        if (obj.output !== undefined) {
          Object.keys(obj.output).forEach(x => {
            bindOutput[x] = { type: obj.output![x].type, dir: obj.output![x].dir, value: obj.output![x].value }
          })
        }

        try {
          const res = await connection.execute(sql, bindOutput, {
            autoCommit: false
          })

          sw.stop()
          if (tracker)
            tracker.sendMessages({
              Header: header,
              Body: sql,
              Footer: '',
              TimeStamp: (sw.getTotalTime() / 1000).toString()
            })

          output.push({ rowsAffected: res.rowsAffected || 0, output: res.outBinds })
        } catch (error: any) {
          console.log(error)
          await connection.rollback()
          if (tracker)
            tracker.sendMessages({
              Header: `Error ${header}`,
              Body: sql,
              Footer: error.message,
              TimeStamp: '0'
            })

          return Promise.resolve({ Error: error.message || 'Error executing Oracle command' })
        }
      }

      if (commit) await connection.commit()

      return Promise.resolve(output)
    })
  }
}

export default Oracle
