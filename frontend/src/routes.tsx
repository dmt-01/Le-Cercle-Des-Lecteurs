import { AboutPage, ContactPage, PrivacyPage, TermsPage, HelpPage } from "./Pages/Static/StaticPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import UserProfilePage from "./Pages/Profile/UserProfilePage";
import GroupDetailPage from "./Pages/Groups/GroupDetailPage";
import EventDetailPage from "./Pages/Events/EventDetailPage";
import BookDetailPage from "./Pages/Books/BookDetailPage";
import BlogDetailPage from "./Pages/Blog/BlogDetailPage";
import MessagesPage from "./Pages/Messages/MessagesPage";
import NotFoundPage from "./Pages/Static/NotFoundPage";
import { Outlet, Route, Routes } from "react-router";
import GroupsPage from "./Pages/Groups/GroupsPage";
import EventsPage from "./Pages/Events/EventsPage";
import SignupPage from "./Pages/Auth/SignupPage";
import Layout from "./components/layout/Layout";
import BooksPage from "./Pages/Books/BooksPage";
import LoginPage from "./Pages/Auth/LoginPage";
import HomePage from "./Pages/Home/HomePage";
import BlogPage from "./Pages/Blog/BlogPage";

function Router() {
  return (
    <Routes>
      <Route element={<Layout><Outlet /></Layout>}>

        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:id" element={<GroupDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/* Routes protégées (connexion requise) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
