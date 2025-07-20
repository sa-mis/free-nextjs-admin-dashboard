import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

// Import pages
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import Calendar from '@/pages/Calendar'
import Blank from '@/pages/Blank'
import FormElements from '@/pages/FormElements'
import BasicTables from '@/pages/BasicTables'
import BarChart from '@/pages/BarChart'
import LineChart from '@/pages/LineChart'
import Alerts from '@/pages/Alerts'
import Avatars from '@/pages/Avatars'
import Badge from '@/pages/Badge'
import Buttons from '@/pages/Buttons'
import Images from '@/pages/Images'
import Modals from '@/pages/Modals'
import Videos from '@/pages/Videos'

import CompaniesPage from '@/app/(admin)/companies/page';
import DepartmentsPage from '@/app/(admin)/departments/page';
import DivisionsPage from '@/app/(admin)/divisions/page';
import EmployeesPage from '@/app/(admin)/employees/page';

// Import layouts
import AdminLayout from '@/layouts/AdminLayout'
import AuthLayout from '@/layouts/AuthLayout'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SidebarProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
            
            {/* Admin routes */}
            <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/companies" element={<AdminLayout><CompaniesPage /></AdminLayout>} />
            <Route path="/departments" element={<AdminLayout><DepartmentsPage /></AdminLayout>} />
            <Route path="/divisions" element={<AdminLayout><DivisionsPage /></AdminLayout>} />
            <Route path="/employees" element={<AdminLayout><EmployeesPage /></AdminLayout>} />
            <Route path="/profile" element={<AdminLayout><Profile /></AdminLayout>} />
            <Route path="/calendar" element={<AdminLayout><Calendar /></AdminLayout>} />
            <Route path="/blank" element={<AdminLayout><Blank /></AdminLayout>} />
            <Route path="/form-elements" element={<AdminLayout><FormElements /></AdminLayout>} />
            <Route path="/basic-tables" element={<AdminLayout><BasicTables /></AdminLayout>} />
            <Route path="/bar-chart" element={<AdminLayout><BarChart /></AdminLayout>} />
            <Route path="/line-chart" element={<AdminLayout><LineChart /></AdminLayout>} />
            <Route path="/alerts" element={<AdminLayout><Alerts /></AdminLayout>} />
            <Route path="/avatars" element={<AdminLayout><Avatars /></AdminLayout>} />
            <Route path="/badge" element={<AdminLayout><Badge /></AdminLayout>} />
            <Route path="/buttons" element={<AdminLayout><Buttons /></AdminLayout>} />
            <Route path="/images" element={<AdminLayout><Images /></AdminLayout>} />
            <Route path="/modals" element={<AdminLayout><Modals /></AdminLayout>} />
            <Route path="/videos" element={<AdminLayout><Videos /></AdminLayout>} />
          </Routes>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App 