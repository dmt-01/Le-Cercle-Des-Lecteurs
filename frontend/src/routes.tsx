import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { Outlet, Route, Routes } from "react-router";
import SignupPage from "./Pages/Auth/SignupPage";
import LoginPage from "./Pages/Auth/LoginPage";
import HomePage from "./Pages/Home/HomePage";

function Router() {
  return (
    <Routes>
      <Route element={<Layout><Outlet /></Layout>}>

        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<h1>Livres</h1>} />
        <Route path="/books/:id" element={<h1>Détail livre</h1>} />
        <Route path="/groups" element={<h1>Clubs</h1>} />
        <Route path="/groups/:id" element={<h1>Détail club</h1>} />
        <Route path="/events" element={<h1>Événements</h1>} />
        <Route path="/blog" element={<h1>Blog</h1>} />
        <Route path="/blog/:id" element={<h1>Article</h1>} />
        <Route path="/users/:id" element={<h1>Profil public</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<h1>À propos</h1>} />
        <Route path="/contact" element={<h1>Contact</h1>} />
        <Route path="/privacy" element={<h1>Politique de confidentialité</h1>} />
        <Route path="/terms" element={<h1>Conditions d'utilisation</h1>} />
        <Route path="/help" element={<h1>Aide</h1>} />

        {/* Routes protégées (connexion requise) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/messages" element={<h1>Messagerie</h1>} />
          <Route path="/wishlist" element={<h1>Wishlist</h1>} />
          <Route path="/profile" element={<h1>Mon profil</h1>} />
        </Route>

        <Route path="*" element={<h1>Page non trouvée</h1>} />
      </Route>
    </Routes>
  );
}

export default Router;
