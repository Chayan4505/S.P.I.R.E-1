import { useEffect } from 'react'
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/DashboardNavbar';

const Dashboard = () => {
  const { loadUser } = useAuth();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <>
      <DashboardNavbar />
      <div className='flex'>
        <Sidebar/>
        <div className='flex-1 overflow-y-auto px-4 py-6 md:px-8'>
            <Outlet/>
        </div>
    </div>
    </>
  )
}

export default Dashboard
