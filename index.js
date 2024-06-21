require('dotenv').config();
const express = require("express");
const cors = require('cors')
const rootRouter = require('./routes/index')
const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1',rootRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
