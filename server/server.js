const express = require('express');
const app = express();


// middleware
app.use(express.json());
// Define routes and APIs here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
