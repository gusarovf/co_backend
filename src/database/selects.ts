import { poolQuery } from "./utils"

export const getLastUpdate = async (): Promise<{
  id: number
  tablesPostfix: string
  isLoaded: number
  areTablesExist: number
  total_records: number
  loadedAt: string
}> =>
  poolQuery(`
        SELECT 
          id,
          tables_postfix AS "tablesPostfix",
          is_loaded AS "isLoaded", 
          are_tables_exist AS "areTablesExist",
          total_records AS "total_records",
          loaded_at AS "loadedAt"
        FROM
          updates
        WHERE
            are_tables_exist = 1
        ORDER BY 
          id DESC
        LIMIT 1
      `).then((res) => (res?.length ? res[0] : null))

export const getCo = async (searchParams: { ogrn: string }) => {
  const { ogrn } = searchParams
  const update = await getLastUpdate()

  const res = await poolQuery(`
        SELECT 
          ccode,
          oldctbank,
          newctbank,
          csname,
          cnamer,
          oldcopf,
          newcopf,
          cregnum,
          oldcregnr,
          newcregnr,
          cdreg,
          lic,
          strcuraddr,
          ogrn
        FROM
          co${update.tablesPostfix} 
        WHERE
            ogrn LIKE '${ogrn}'
        ORDER BY 
          id DESC
        LIMIT 1
      `)

  return res?.length ? res : null
}

export const dbSize = (): Promise<{
  size: string
  prettySize: string
}> =>
  poolQuery(
    `SELECT pg_database_size(current_database()) AS size, pg_size_pretty(pg_database_size(current_database())) AS "prettySize";`
  ).then((res) => (res.length ? res[0] : null))
