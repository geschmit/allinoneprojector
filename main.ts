import { Hono } from "https://deno.land/x/hono@v3.5.6/mod.ts"
import { serveStatic, logger } from "https://deno.land/x/hono@v3.5.6/middleware.ts"

const app = new Hono()

app.use("*",logger())
app.use("/", serveStatic({ path: "asset/index.html" }))
app.use("/admin.html", serveStatic({ path: "asset/admin.html" }))
app.use("/video.mp4", serveStatic({ path: "asset/video.mp4" }))

let connectedSockets:Array<Deno.WebSocketUpgrade> = []
app.get("/api/websocket", async (c) => {
    const sock = Deno.upgradeWebSocket(c.req.raw)
    connectedSockets.push(sock)
    return sock.response
})

app.post("/api/upload", async (c) => {
    const data = await c.req.formData()
    Deno.writeFileSync("asset/video.mp4",data.get("file") as any)
    for (const x of connectedSockets) {
        x.socket.send("reload")
    }
    connectedSockets = []
    return c.redirect("/")
})

Deno.serve(app.fetch)