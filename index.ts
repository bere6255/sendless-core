import * as dotenv from "dotenv";
dotenv.config()
// import routes from './routes/'
import app from "./app"
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;




// app.use(routes);
app.listen(port, '0.0.0.0', () => console.log(`Server is running on http://localhost:${port}`));
