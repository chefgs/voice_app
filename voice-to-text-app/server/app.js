const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});