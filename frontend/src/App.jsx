import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Imagem da Secretaria
import logoSecretaria from "./assets/SEDEEA.jpg";

function App() {
  const [cotacoes, setCotacoes] = useState([]);
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    buscarCotacoes();

    const atualizar = setInterval(buscarCotacoes, 10000);
    const relogio = setInterval(() => setHora(new Date()), 1000);

    return () => {
      clearInterval(atualizar);
      clearInterval(relogio);
    };
  }, []);

  const buscarCotacoes = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/cotacoes");
      setCotacoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar cotações:", error);
    }
  };

  // Formata a data
  const formatarData = (data) => {
    return data.toLocaleDateString("pt-BR", {
       day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    });
  };

  return (
    <div className="painel">
      {/* ---------- TOPO ---------- */}
      <div className="topo">
        <div className="topo-esquerda">
          <h1>🌾 PAINEL AGRO</h1>
          <img src={logoSecretaria} alt="Secretaria" className="logo-secretaria" />
        </div>
        <div className="relogio-container"></div>
        <div className="relogio">{hora.toLocaleTimeString()}
        <div className="data">{formatarData(hora)}</div>
        

        </div>
      </div>

      {/* ---------- CARDS ---------- */}
      <div className="cards">
        {cotacoes.map((item, index) => (
          <div key={index} className="card">
            <h2>{item.nome}</h2>
            <p>R$ {item.valor}</p>
          </div>
        ))}
      </div>

      {/* ---------- TICKER ---------- */}
      <div className="ticker">
        <div className="ticker-content">
          {cotacoes.map((item, index) => (
            <span key={index}>
              {item.nome} - R$ {item.valor} &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;