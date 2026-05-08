import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import DeckDetail from './pages/decks/DeckDetail';
import StudyMode from './pages/study/StudyMode';
import Explore from './pages/explore/Explore';
import ExploreDetail from './pages/explore/ExploreDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Explore Routes */}
        <Route element={<MainLayout />}>
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:deckId" element={<ExploreDetail />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/decks/:deckId" element={<DeckDetail />} />
            <Route path="/study/:deckId" element={<StudyMode />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
