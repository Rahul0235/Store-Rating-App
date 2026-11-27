import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { homePath } from './roles';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import UserStores from './pages/UserStores';
import OwnerDashboard from './pages/OwnerDashboard';

function Home() {
  const { user } = useAuth();
  return <Navigate to={user ? homePath[user.role] : '/login'} replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/stores" element={<ProtectedRoute roles={['ADMIN']}><AdminStores /></ProtectedRoute>} />

        <Route path="/stores" element={<ProtectedRoute roles={['USER']}><UserStores /></ProtectedRoute>} />
        <Route path="/owner" element={<ProtectedRoute roles={['STORE_OWNER']}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/password" element={<ProtectedRoute roles={['USER', 'STORE_OWNER']}><ChangePassword /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
