import express from "express"
import users_routes from "./src/routes/users-routes"
import products_routes from "./src/routes/products-routes"
import cors from "cors"
import path from "path"

const app = express()

app.use(cors())
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './src/views/index.html'));
});

app.use("/users", users_routes)
app.use("/products", products_routes)

app.listen(3000, _ => {
    console.log("El servidor esta corriendo en puerto 3000")
})
