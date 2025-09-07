

import { app } from './app'
import checkoutRoutes from './routes/checkout-session-routes'
import UsersRoutes from './routes/user-routes'

const port = 3000

app.listen(port, () => {
    console.log(`HTTP Server Running! Server: http://localhost:${port}`)
})

// app uses
app.use("/checkout", checkoutRoutes)
app.use("/users", UsersRoutes)