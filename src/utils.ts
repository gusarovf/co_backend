import http from "http"

export const determineStatus = (data: any[] | undefined): number => {
  if (data === null || data === undefined) return 404
  if (Array.isArray(data) && !data.length) return 404
  if (typeof data == "object" && !Object.values(data).length) return 404

  return 200
}

export const sendHttpRes = (
  res: http.ServerResponse,
  data: any | undefined
): void => {
  res
    .writeHead(determineStatus(data), {
      "Content-Type": "application/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "origin, content-type, accept",
    })
    .end(JSON.stringify(data ?? []))

  return
}
