import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [cotacoes, setCotacoes] = useState([]);
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    buscarCotacoes();
    const intervalo = setInterval(buscarCotacoes, 10000); // atualiza a cada 10s
    const relogio = setInterval(() => setHora(new Date()), 1000);

    return () => {
      clearInterval(intervalo);
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
        <h1 className="titulo">🌾 PAINEL AGRO</h1>
        <div className="relogio">
          {hora.toLocaleTimeString()}
        </div>
      </div>

      <div className="ticker">
        <div className="ticker-content">
          {cotacoes.map((item, index) => (
            <div key={index} className="item">
              <span className="nome">{item.nome}</span>
              <span className="valor">R$ {item.valor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;