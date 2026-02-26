import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

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

  return (
    <div className="painel">

      <div className="topo">
        <h1>🌾 PAINEL AGRO</h1>
        <div className="relogio">
          {hora.toLocaleTimeString()}
        </div>
      </div>

      <div className="cards">
        {cotacoes.map((item, index) => (
          <div key={index} className="card">
            <h2>{item.nome}</h2>
            <p>R$ {item.valor}</p>
          </div>
        ))}
      </div>

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