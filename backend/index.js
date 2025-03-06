const express = require("express");
const mainRouter = require("./routes/index");
const userRouter = require("./routes/user");
const app = express();
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173", // Allow only this frontend URL
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    credentials: true // Allow cookies and authentication headers
}));
app.use(express.json());

app.use('/api/v1', mainRouter);
app.use('/api/v1/users', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));