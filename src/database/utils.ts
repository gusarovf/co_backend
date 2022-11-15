import { Pool } from "pg"
import { db } from "../config"

const pool = new Pool(db)

export const poolQuery = async <T>(
  query: string,
  values?: Array<T>
): Promise<any> => {
  const client = await pool.connect()

  try {
    return (await client.query(query, values?.length ? values : []))?.rows
  } catch (err: any) {
    console.log(`Query: \n ${query}`)
    console.log(
      `Error while executing query at poolQuery (${err}). See query above.`
    )

    throw new Error(`Pool query error: ${err?.message}`)
  } finally {
    client.release()
  }
}

