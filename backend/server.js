const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const cotacoes = [
  { nome: "Café Arábica", valor: 940.10 },
  { nome: "Milho", valor: 78.20 },
  { nome: "Soja", valor: 150.90 },
  { nome: "Feijão Carioca", valor: 220.00 },
  { nome: "Boi Gordo", valor: 270.35 }
];

app.get('/api/cotacoes', (req, res) => {
  res.json(cotacoes);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});