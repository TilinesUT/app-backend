import "dotenv/config"
import express from "express"
import users_routes from "./routes/users-routes.js"
import products_routes from "./routes/products-routes.js"
import cors from "cors"
import path from "path"

const app = express()

app.use(cors())
app.use(express.json());
app.use(express.static('public'));

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, './src/views/index.html'));
});

app.get('/health', (_, res) => {
    res.status(200).json({
        ok: true,
        status: 200,
        msg: "API en linea"
    });
});

app.use("/users", users_routes)
app.use("/products", products_routes)

const port = process.env["PORT"] ?? 3000;
app.listen(port, _ => {
    console.log(`El servidor esta corriendo en puerto ${port}`)
})
