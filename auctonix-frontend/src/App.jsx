import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import { Home } from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import Auctions from './pages/Auctions';
import { CreateAuction } from './pages/CreateAuction';
import { MyAuctions } from './pages/MyAuctions';
import Contact from './pages/Contact';
import MyAccount from './pages/MyAccount';
import { AuctionDetails } from './pages/AuctionDetails';
import ViewAuction from './pages/ViewAuction';
import ForgotPassword from './components/ForgotPassword';
import AIInsights from './pages/AIInsights';
import SmartRecommendations from './pages/SmartRecommendations';

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <Routes location={location}>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/create-auction" element={<CreateAuction />} />
          <Route path="/my-auctions" element={<MyAuctions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/auction/:id" element={<AuctionDetails />} />
          <Route path="/view-auction/:id" element={<ViewAuction />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/smart-recommendations" element={<SmartRecommendations />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
