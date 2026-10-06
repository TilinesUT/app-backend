import express from "express"
import users_routes from "./src/routes/users-routes"
import products_routes from "./src/routes/products-routes"

const app = express()

app.use(express.json());
app.use(express.static('public'));

app.use("/users", users_routes)
app.use("/products", products_routes)

app.listen(3000, _ => {
    console.log("El servidor esta corriendo en puerto 3000")
})
