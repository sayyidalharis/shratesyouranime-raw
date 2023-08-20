// import globals css from styles
import '@fortawesome/fontawesome-free/css/all.css'; // Import Font Awesome CSS
import '@/styles/globals.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

function MyApp({ Component, pageProps }) {
    return (
        <>
        <Header/>
        <Component {...pageProps} />
        <Footer/>
        </>
    );
    }
    
    export default MyApp;
