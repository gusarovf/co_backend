import http from "http"
import { URL } from "url"
import { dbSize, getCo, getLastUpdate } from "../database/selects"
import { poolQuery } from "../database/utils"
import { sendHttpRes } from "../utils"

const port = 5000
const host = "localhost:" + port.toString()

const srv = http.createServer(async (req, res) => {
  const userAgent = req.headers["user-agent"]
  if (typeof userAgent === "string" && userAgent.startsWith("kube-probe/")) {
    res.writeHead(200)
    res.end()
    return
  }

  const reqUrl = new URL(
    req.url as string,
    "http://" + (req.headers["host"] || host)
  )

  if (reqUrl.pathname === "/co") {
    const params = reqUrl.searchParams
    const ogrn = params.get("ogrn") || ""

    const result = ogrn?.length ? await getCo({ ogrn }) : null

    sendHttpRes(res, result)
  }

  if (reqUrl.pathname === "/dbSize") {
    sendHttpRes(
      res,
      await dbSize()
    )
  }

  if (reqUrl.pathname === "/lastUpdate") {
    sendHttpRes(res, await getLastUpdate())
  }

  res.writeHead(404)
  res.end()
})

export const startServer = () => {
  srv.listen(port)
  console.log(`Server started. Its is available at port: ${port}`)
}

if (require.main === module) {
  startServer()
}
