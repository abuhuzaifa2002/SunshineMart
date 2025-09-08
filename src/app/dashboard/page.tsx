'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiHome, FiShoppingCart, FiBox, FiUsers, FiBarChart2, FiSettings, FiMenu, FiX, FiBell, FiUser, FiChevronDown, FiLogOut, FiTag, FiStar, FiPercent, FiCreditCard } from 'react-icons/fi';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const router = useRouter();
  const { cartItems } = useCart();

  const [orderItems, setOrderItems] = useState([]);
  type ShippingInfo = {
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
    city?: string;
    district?: string;
  };

  const [orderShippingInfo, setOrderShippingInfo] = useState<ShippingInfo | null>(null);
  const [orderDeliveryCharge, setOrderDeliveryCharge] = useState(0);
  const [orderTotalAmount, setOrderTotalAmount] = useState(0);

  useEffect(() => {
    const storedOrderItems = localStorage.getItem('cartItems');
    const storedShippingInfo = localStorage.getItem('shippingInfo');
    const storedDeliveryCharge = localStorage.getItem('deliveryCharge');
    const storedTotalAmount = localStorage.getItem('totalAmount');

    if (storedOrderItems) {
      setOrderItems(JSON.parse(storedOrderItems));
    }
    if (storedShippingInfo) {
      setOrderShippingInfo(JSON.parse(storedShippingInfo));
    }
    if (storedDeliveryCharge) {
      setOrderDeliveryCharge(JSON.parse(storedDeliveryCharge));
    }
    if (storedTotalAmount) {
      setOrderTotalAmount(JSON.parse(storedTotalAmount));
    }
  }, []);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name);
        setProfilePicture(res.data.profilePicture || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };
    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const navItems = [
    { icon: <FiHome />, name: 'Dashboard', href: '/dashboard' },
    { icon: <FiShoppingCart />, name: 'Cart', href: '/dashboard/cart' },
    { icon: <FiShoppingCart />, name: 'Orders', href: '#' },
    { icon: <FiBox />, name: 'Products', href: '#' },
    { icon: <FiUsers />, name: 'Customers', href: '#' },
    { icon: <FiBarChart2 />, name: 'Analytics', href: '#' },
    { icon: <FiCreditCard />, name: 'Membership', href: '/dashboard/membership' },
    { icon: <FiTag />, name: 'Vouchers', href: '/dashboard/vouchers' }, // Added Vouchers item
    { icon: <FiSettings />, name: 'Edit Your Profile', href: '/dashboard/edit-profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">

      <aside className={`bg-white w-64 min-h-full p-4 shadow-lg border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? '' : '-ml-64'}`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-orange-500">Sunshine</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
            <FiX size={24} />
          </button>
        </div>
        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.name} className="mb-2">
                <Link href={item.href} className="flex items-center p-3 text-gray-700 font-medium hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors duration-200">
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
            <li className="mb-2 mt-4">
              <button onClick={handleLogout} className="flex items-center p-3 text-gray-700 font-medium hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors duration-200 w-full text-left">
                <FiLogOut />
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden">
            <FiMenu />
          </button>
          <div className="flex items-center">
            <FiBell className="mr-4" />
            <div className="flex items-center">
              {profilePicture ? (
                <img src={`http://localhost:5000${profilePicture}`} alt="Profile" className="w-8 h-8 rounded-full mr-2 object-cover" />
              ) : (
                <FiUser className="mr-2 w-8 h-8 rounded-full bg-gray-200 p-1" />
              )}
              <span>{userName}</span>
              <FiChevronDown className="ml-1" />
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-3xl font-semibold mb-6">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/collections" passHref>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiTag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Collections</h3>
                  <p className="text-gray-600 text-sm">Explore our diverse product categories.</p>
                </div>
              </div>
            </Link>

            <Link href="/new-arrivals" passHref>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <FiStar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">New Arrivals</h3>
                  <p className="text-gray-600 text-sm">Discover the latest trends and products.</p>
                </div>
              </div>
            </Link>

            <Link href="/sale" passHref>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <FiPercent className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Sale</h3>
                  <p className="text-gray-600 text-sm">Grab amazing deals and discounts.</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/cart" passHref>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FiShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Your Cart</h3>
                  <p className="text-gray-600 text-sm">
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/membership" passHref>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FiCreditCard className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Membership</h3>
                  <p className="text-gray-600 text-sm">Manage your membership and benefits.</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/vouchers" passHref>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <FiTag className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Vouchers</h3>
                  <p className="text-gray-600 text-sm">Redeem your points for exclusive discounts.</p>
                </div>
              </div>
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FiBox className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Your Last Order</h3>
                  {orderItems.length > 0 ? (
                    <p className="text-gray-600 text-sm">
                      Total: ৳{orderTotalAmount.toFixed(2)} ({orderItems.length} items)
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm">No recent orders found.</p>
                  )}
                </div>
              </div>
              {orderItems.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Order Details:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Name: {orderShippingInfo?.firstName} {orderShippingInfo?.lastName}</li>
                    <li>Email: {orderShippingInfo?.email}</li>
                    <li>Address: {orderShippingInfo?.address}, {orderShippingInfo?.city}, {orderShippingInfo?.district}</li>
                    <li>Delivery Charge: ৳{orderDeliveryCharge.toFixed(2)}</li>
                  </ul>
                  <Link href="/payment" passHref>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      View Order Details
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
