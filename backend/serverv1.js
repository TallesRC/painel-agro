const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

async function buscarCotacao(produto, cidadeFiltro) {

  try {

    const url = `https://www.noticiasagricolas.com.br/cotacoes/${produto}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9"
      },
    });

    const $ = cheerio.load(data);

    let resultado = null;

    $(".table-content table tbody tr").each((i, el) => { //seletor do Cheerio para pegar essa tabela corretamente no scraping do site

      const cidade = $(el).find("td").eq(0).text().trim();
      const valor = $(el).find("td").eq(1).text().trim();

        console.log("Linha encontrada:", cidade, valor);

       if (cidade.toLowerCase().includes(cidadeFiltro.toLowerCase()) && valor) {

        resultado = {
          nome: produto.toUpperCase(),
          cidade: cidade,
          valor: valor.replace(",", ".")
        };

      }

    });

    return resultado;

  } catch (erro) {

    console.log("Erro ao buscar:", produto);//Erro scraping:
    return null;

  }

}

app.get("/cotacoes", async (req, res) => {

  try {

    const cafe = await buscarCotacao("cafe", "Varginha");
    const milho = await buscarCotacao("milho", "Campinas");
    const soja = await buscarCotacao("soja", "Paraná");

    const dados = [cafe, milho, soja].filter(Boolean);

    console.log("RETORNO API:", dados);

    res.json(dados);

  } catch (erro) {

    console.error("Erro na rota /cotacoes:", erro);
    res.json([]);

  }

});

app.listen(4000, () => {
  console.log("Servidor rodando na porta 4000");
});