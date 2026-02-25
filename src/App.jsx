import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';

// Layout & Navigation Imports
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Page Imports
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Forecast from './pages/Forecast';
import Inventory from './pages/Inventory';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useData();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

function App() {
    return (
        <DataProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/upload" element={
                        <ProtectedRoute>
                            <Upload />
                        </ProtectedRoute>
                    } />

                    <Route path="/analysis" element={
                        <ProtectedRoute>
                            <Analysis />
                        </ProtectedRoute>
                    } />

                    <Route path="/forecast" element={
                        <ProtectedRoute>
                            <ProtectedRoute>
                                <Forecast />
                            </ProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/inventory" element={
                        <ProtectedRoute>
                            <Inventory />
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </DataProvider>
    );
}

export default App;
