import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './context.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Students from './pages/Students.jsx';
import StudentForm from './pages/StudentForm.jsx';
import StudentDetails from './pages/StudentDetails.jsx';
import Fees from './pages/Fees.jsx';
import History from './pages/History.jsx';
import FeeEdit from './pages/FeeEdit.jsx';
import Reports from './pages/Reports.jsx';
import About from './pages/About.jsx';

function Splash() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-app">
      <img src="/logo.png" alt="" className="h-24 w-auto animate-pop" />
      <div className="size-8 animate-spin rounded-full border-4 border-line border-t-blue-600" aria-label="Loading" />
    </div>
  );
}

export default function App() {
  const { user, loading } = useApp();
  if (loading) return <Splash />;
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/new" element={<StudentForm />} />
        <Route path="students/:id" element={<StudentDetails />} />
        <Route path="students/:id/edit" element={<StudentForm />} />
        <Route path="fees" element={<Fees />} />
        <Route path="fees/history" element={<History />} />
        <Route path="fees/:id/edit" element={<FeeEdit />} />
        <Route path="reports" element={<Reports />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
