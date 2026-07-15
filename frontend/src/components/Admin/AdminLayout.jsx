import { useState } from "react"
import { FaBars } from "react-icons/fa"
import AdminSidebar from "./AdminSidebar"
import { Outlet } from "react-router-dom"

const AdminLayout = () => {
    const [isSidebarOpen , setIsSidebarOpen]=useState(false)
    const toggleSidebar = () => { 
        setIsSidebarOpen(!isSidebarOpen)
    }
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-gray-50/50">
        {/* mobile toggle button  */}
        <div className="flex md:hidden p-4 bg-slate-900 text-white z-20 items-center shadow-md">
            <button onClick={toggleSidebar} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <FaBars size={22}/>
            </button>
            <h1 className="ml-4 text-lg font-bold tracking-wide">RABBIT ADMIN</h1>
        </div>

        {/* overlay for mobile sidebar */}
        {isSidebarOpen && (
            <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity" onClick={toggleSidebar}></div>
        )}

        {/* sidebar */}
        <div 
            className={`bg-slate-900 w-72 min-h-screen text-slate-300 absolute md:relative transform 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block z-40 shadow-xl md:shadow-none`}>
            
            {/* sidebar component */}
            <AdminSidebar/>
        </div>

        {/* main content  */}
        <div className="flex-grow p-4 sm:p-6 overflow-auto">
            <Outlet/>
        </div>
    </div>
  )
}

export default AdminLayout