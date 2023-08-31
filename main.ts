import { Hono } from "https://deno.land/x/hono@v3.5.6/mod.ts"
import { serveStatic, logger } from "https://deno.land/x/hono@v3.5.6/middleware.ts"

const app = new Hono()

app.use("*",logger())
app.use("/", serveStatic({ path: "asset/index.html" }))
app.use("/admin.html", serveStatic({ path: "asset/admin.html" }))

app.post('/api/upload', async (c) => {
    const data = await c.req.formData()
    Deno.writeFileSync("asset/video",data.get("file") as any)
    return c.text("a")
})

Deno.serve(app.fetch)