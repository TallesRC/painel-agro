import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import logoSecretaria from "./assets/SEDEEA.jpg";

function App() {

const [cotacoes,setCotacoes] = useState([]);
const [hora,setHora] = useState(new Date());
const [dolar,setDolar] = useState(null);
const [clima,setClima] = useState(null);
const [carregado,setCarregado] = useState(false);

const [noticias] = useState([
"CAFÉ: mercado segue firme com exportações aquecidas",
"BOI GORDO: preços sobem com menor oferta",
"MILHO: mercado atento ao clima no Brasil",
"SOJA: China aumenta demanda por grãos",
"AGRONEGÓCIO segue impulsionando economia brasileira"
]);

useEffect(()=>{

buscarCotacoes();

const atualizar = setInterval(buscarCotacoes,10000);
const relogio = setInterval(()=>setHora(new Date()),1000);

return()=>{
clearInterval(atualizar);
clearInterval(relogio);
}

},[]);

const buscarCotacoes = async ()=>{

try{

const response = await axios.get("http://172.16.0.99:4000/cotacoes");

setCotacoes(response.data.dados || []);
setDolar(response.data.dolar || null);
setClima(response.data.clima || null);

setCarregado(true);

}catch(error){

console.log("Erro API:",error);
setCarregado(true);

}

}

const formatarData = (data)=>{

return data.toLocaleDateString("pt-BR",{
day:"2-digit",
month:"2-digit",
year:"numeric"
});

}

if(!carregado){

return(
<div className="loading">
Carregando painel...
</div>
)

}

return(

<div className="painel">

{/* TOPO */}

<div className="topo">

<div className="topo-esquerda">

<img
src={logoSecretaria}
alt="Secretaria"
className="logo-secretaria"
/>

<h1>🌾 PAINEL AGRO</h1>

</div>

<div className="topo-direita">

<div className="clima">
🌦 {clima?.valor ?? "--"}
</div>

<div className="dolar">
💵 {dolar?.valor ?? "--"}
</div>

<div className="relogio">
{hora.toLocaleTimeString("pt-BR")}
</div>

<div className="data">
{formatarData(hora)}
</div>

</div>

</div>

{/* CARDS */}

<div className="cards">

{cotacoes.map((item,index)=>{

const subiu = item.variacao >= 0;

return(

<div key={index} className="card">

<h2>{item.nome}</h2>

<span>{item.cidade}</span>

<p className="valor">
R$ {item.valor}
</p>

<div className={subiu ? "variacao alta":"variacao baixa"}>

{subiu ? "▲":"▼"} {item.variacao ?? "0"}%

</div>

</div>

)

})}

</div>

{/* TICKER */}

<div className="ticker">

<div className="ticker-content">

{noticias.map((n,index)=>(
<span key={index}>
{n} &nbsp;&nbsp;&nbsp;&nbsp;
</span>
))}

</div>

</div>

</div>

)

}

export default App;