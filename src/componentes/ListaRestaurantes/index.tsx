import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');

  useEffect(() => {
    axios.get<IPaginacao<IRestaurante>>("http://localhost:8000/api/v1/restaurantes/")
      .then(resposta => {
        dadosRestaurantes('http://localhost:8000/api/v1/restaurantes/')
      })
      .catch(erro => {
        console.log(erro);

      })
  }, []);

  const dadosRestaurantes = (url: string) => {
    axios.get<IPaginacao<IRestaurante>>(url)
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setProximaPagina(resposta.data.next)
        setPaginaAnterior(resposta.data.previous)
      })
      .catch(erro => {
        console.log(erro);

      })
  }

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {<button onClick={() => dadosRestaurantes(paginaAnterior)} disabled={!paginaAnterior}>
      Página Anterior
    </button>}
    {<button onClick={() => dadosRestaurantes(proximaPagina)} disabled={!proximaPagina}>
      Próxima Pagina
    </button>}
  </section>)
}

export default ListaRestaurantes