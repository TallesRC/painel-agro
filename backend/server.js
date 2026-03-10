const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

let cacheCotacoes = [];
let ultimaAtualizacao = null;




/* FUNÇÃO PARA BUSCAR TABELA */
async function buscarTabela(url) {

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "pt-BR,pt;q=0.9"
    }
  });

  return cheerio.load(data);
}

/* CAFÉ ARÁBICA */
async function buscarCafe() {

  try {

    const $ = await buscarTabela(
      "https://www.noticiasagricolas.com.br/cotacoes/cafe"
    );

    let resultado = null;

    $(".tables table tbody tr").each((i, el) => {

      const cidade = $(el).find("td").eq(0).text().trim();
      const valor = $(el).find("td").eq(1).text().trim();

      if (cidade.includes("Varginha") && !resultado) {

        resultado = {
          nome: "Café Arábica",
          cidade: cidade,
          valor: valor
        };

      }

    });

    return resultado;

  } catch {
    return null;
  }

}

/* MILHO */
async function buscarMilho() {

  try {

    const $ = await buscarTabela(
      "https://www.noticiasagricolas.com.br/cotacoes/milho"
    );

    let resultado = null;

    $(".tables table tbody tr").each((i, el) => {

      const cidade = $(el).find("td").eq(0).text().trim();
      const valor = $(el).find("td").eq(1).text().trim();

      if (cidade.includes("Campinas") && !resultado) {

        resultado = {
          nome: "Milho",
          cidade: cidade,
          valor: valor
        };

      }

    });

    return resultado;

  } catch {
    return null;
  }

}

/* SOJA */
async function buscarSoja() {

  try {

    const { data } = await axios.get(
      "https://www.noticiasagricolas.com.br/cotacoes/soja",
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const $ = cheerio.load(data);

    let resultado = null;

    $(".tables > div").each((i, el) => {

      const titulo = $(el).find("h2").text();

      if (titulo.includes("Soja Cepea/Esalq - Paraná")) {

        const linha = $(el).find("table tbody tr").first();

        const valor = linha.find("td").eq(1).text().trim();

        resultado = {
          nome: "Soja",
          cidade: "Paraná",
          valor: valor
        };

      }

    });

    return resultado;

  } catch (erro) {

    console.log("Erro scraping soja");
    return null;

  }

}

/* BOI GORDO */
async function buscarBoi() {

  try {

    const $ = await buscarTabela(
      "https://www.noticiasagricolas.com.br/cotacoes/boi-gordo"
    );

    let resultado = null;

    $(".tables table tbody tr").each((i, el) => {

      const cidade = $(el).find("td").eq(0).text().trim();
      const valor = $(el).find("td").eq(1).text().trim();

      if (cidade.includes("São Paulo") && !resultado) {

        resultado = {
          nome: "Boi Gordo",
          cidade: cidade,
          valor: valor
        };

      }

    });

    return resultado;

  } catch {
    return null;
  }

}

//BUSCAR DOLAR
async function buscarDolar() {

  try {

    const { data } = await axios.get(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL"
    );

    return {
      nome: "Dólar",
      cidade: "USD/BRL",
      valor: Number(data.USDBRL.bid).toFixed(2)
    };

  } catch {

    return null;

  }

}

//BUSCAR CLIMA
async function buscarClima() {

  try {

    const { data } = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=-21.55&longitude=-45.43&current_weather=true"
    );

    return {
      nome: "Clima",
      cidade: "Sul de MG",
      valor: data.current_weather.temperature + "°C"
    };

  } catch {

    return null;

  }

}

/* ATUALIZAÇÃO */
async function atualizarCotacoes() {

  console.log("Atualizando cotações...");

  const cafe = await buscarCafe();
  const milho = await buscarMilho();
  const soja = await buscarSoja();
  const boi = await buscarBoi();
  
  const novosDados = [
  cafe,
  milho,
  soja,
  boi
].filter(Boolean);

  if (novosDados.length > 0) {

    cacheCotacoes = novosDados;
    ultimaAtualizacao = new Date();

  }

  console.log("CACHE:", cacheCotacoes);

}

/* API */
app.get("/cotacoes", async (areq, res) => {

    const dolar = await buscarDolar();
  const clima = await buscarClima();

  res.json({
    atualizado: ultimaAtualizacao,
    dados: cacheCotacoes, 
    dolar: dolar,
    clima: clima
  });

});

/* ATUALIZA A CADA 5 MINUTOS */
setInterval(atualizarCotacoes, 300000);

atualizarCotacoes();

app.listen(4000, () => {
  console.log("Servidor rodando na porta 4000");
});