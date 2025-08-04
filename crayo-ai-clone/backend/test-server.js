const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server is running' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Crayo AI Clone API - Test Mode' });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
});