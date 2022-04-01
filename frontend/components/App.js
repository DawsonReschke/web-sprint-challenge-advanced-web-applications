import React, { useEffect, useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axiosWithAuth from '../axios/index'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    window.localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
  }
  
  const login = ({ username, password }) => {
    axiosWithAuth().post(loginUrl,{username,password})
      .then(res=>{
          window.localStorage.setItem('token',res.data.token)
          redirectToArticles()
          setMessage(res.data.message)
      })
  }

  const getArticles = () => {
    setSpinnerOn(true)
    axiosWithAuth().get(articlesUrl)
      .then(res=>{
        setArticles(res.data.articles)
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    axiosWithAuth().post(articlesUrl,article)
      .then(res=>{
        setArticles([...articles,res.data.article])
        setMessage(res.data.message)
      })
  }

  const updateArticle = ({ article_id, article }) => {
    axiosWithAuth().put(`${articlesUrl}/${article_id}`,article)
      .then(({data})=>{
        setArticles(articles.map(art=>art.article_id === data.article.article_id ? data.article : art))
        setMessage(data.message)
      })
  }

  const deleteArticle = article_id => {
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
      .then(res=>{
        setArticles(articles.filter(article=>article.article_id !== article_id))
        setMessage(res.data.message)
      })
  }


  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn} />
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to={window.localStorage.getItem('token') ? "articles":'/'}>Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm setCurrentArticleId={setCurrentArticleId} updateArticle={updateArticle} currentArticle={currentArticleId} postArticle={postArticle} />
              <Articles setCurrentArticleId={setCurrentArticleId} deleteArticle={deleteArticle} getArticles={getArticles} articles={articles} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}
