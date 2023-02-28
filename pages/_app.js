import '../styles/globals.css';
import { store } from "../redux/store";
import { Provider } from "react-redux";
import HeaderJustLaserCut from '../components/Header/HeaderJustLaserCut';
import FooterJust from '../components/FooterJust/FooterJust';
import { SessionProvider } from "next-auth/react"
import '../styles/styles.scss';
import LogRocket from 'logrocket';
LogRocket.init('justlasercut/justlasercut');
function VisualApp({ Component, pageProps }) {

  return (
    <SessionProvider {...pageProps}>
      <Provider store={store}>
          <HeaderJustLaserCut />
          <Component {...pageProps} />
          <FooterJust />
      </Provider>
    </SessionProvider>
  )
}

export default VisualApp
