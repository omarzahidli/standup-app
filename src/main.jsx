import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import AppRouter from './router/route'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastContainer position="top-right" style={{zIndex:999}} autoClose={2000} />
    <AppRouter />
  </Provider>
)
