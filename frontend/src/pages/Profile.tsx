import React, { useEffect } from "react";
import MyOrdersPage from "./MyOrdersPage";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { logoutUser } from "../redux/slices/authSlice";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/store";

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = (): void => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <div className="flex-grow container mx-auto p-4 sm:p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Section: User Card */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-6 flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <UserIcon className="w-12 h-12" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{user?.name}</h1>
              <p className="text-sm text-gray-500 mb-6">{user?.email}</p>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-3 px-4 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95"
              >
                <LogOut className="w-5 h-5" />
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Right Section: Content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-6 sm:p-8">
              <MyOrdersPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
