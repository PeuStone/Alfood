import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios, { AxiosRequestConfig } from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';
import { IParametrosBusca } from '../../interfaces/IParametrosBusca';

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState("");

  useEffect(() => {
    axios.get<IPaginacao<IRestaurante>>("http://localhost:8000/api/v1/restaurantes/")
      .then(resposta => {
        dadosRestaurantes('http://localhost:8000/api/v1/restaurantes/')
      })
      .catch(erro => {
        console.log(erro);

      })
  }, []);

  const dadosRestaurantes = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setProximaPagina(resposta.data.next)
        setPaginaAnterior(resposta.data.previous)
      })
      .catch(erro => {
        console.log(erro);

      })
  }

  const Buscador = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const opcoes = {
      params: {

      } as IParametrosBusca
    }
    if (busca) {
      opcoes.params.search = busca
    }
    if (ordenacao) {
      opcoes.params.ordering = ordenacao
    }
    dadosRestaurantes('http://localhost:8000/api/v1/restaurantes/', opcoes)
  }

  return (
    <section className={style.ListaRestaurantes}>
      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
      <form onSubmit={Buscador} className={style.Formulario}>
        <div className={style.Filtros}>
          <input
            type='text'
            placeholder='Digite aqui o nome do restaurante que deseja filtrar'
            value={busca}
            onChange={evento => setBusca(evento.target.value)}
            className={style.pesquisa}
          />
        </div>
        <div className={style.Filtros}>
          <label
            htmlFor='select-ordenacao'
            className={style.FiltrosLabel}
          >
            Ordenação:
          </label>
          <select
            name='select-ordenacao'
            id='select-ordenacao'
            value={ordenacao}
            onChange={evento => setOrdenacao(evento.target.value)}
          >
            <option value=''>Padrão</option>
            <option value='id'>Por Id</option>
            <option value='nome'>Por Nome</option>
          </select>
        </div>
        <div className={style.Filtros}>
          <button
            type='submit'
            className={style.FiltrosBotao}
          >
            Buscar
          </button>
        </div>
      </form>
      {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
      {<button onClick={() => dadosRestaurantes(paginaAnterior)} disabled={!paginaAnterior}>
        Página Anterior
      </button>}
      {<button onClick={() => dadosRestaurantes(proximaPagina)} disabled={!proximaPagina}>
        Próxima Pagina
      </button>}
    </section>
  )
}

export default ListaRestaurantes