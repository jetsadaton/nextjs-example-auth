import * as os from 'os'

import type oracledb from 'oracledb'

export function convertSqlToBody(sql: string, params?: oracledb.BindParameters) {
  let body = `${sql}  ${os.EOL}${os.EOL}`

  if (params) {
    body += `Params:${os.EOL}`

    body += `${JSON.stringify(params, null, 1)}${os.EOL}`
  }

  return body
}
