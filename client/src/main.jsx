import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {Provider} from 'react-redux'
import {store} from './redux/store'
//import {BrowserRouter, Routes,Route} from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Provider store ={store}>
          <App/> 
      </Provider>
  </React.StrictMode>
);
