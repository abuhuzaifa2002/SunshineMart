'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/Toast';
import OrderConfirmationModal from '../../components/OrderConfirmationModal';

// Dummy data for cities and districts
const bangladeshiCities = [
  'Dhaka',
  'Chittagong',
  'Khulna',
  'Sylhet',
  'Rajshahi',
  'Barisal',
  'Rangpur',
  'Mymensingh',
];

const bangladeshiDistricts = [
  'Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Jamalpur', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Mymensingh', 'Narayanganj', 'Narsingdi', 'Netrokona', 'Rajbari', 'Shariatpur', 'Sherpur', 'Tangail',
  'Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira',
  'Barguna', 'Barisal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur',
  'Bandarban', 'Brahmanbaria', 'Chandpur', 'Chittagong', 'Comilla', "Cox's Bazar", 'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati',
  'Bogra', 'Chapainawabganj', 'Dinajpur', 'Gaibandha', 'Joypurhat', 'Kurigram', 'Lalmonirhat', 'Naogaon', 'Natore', 'Pabna', 'Panchagarh', 'Rajshahi', 'Rangpur', 'Sirajganj', 'Thakurgaon',
  'Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [district, setDistrict] = useState('Dhaka');

  const [paymentMethod, setPaymentMethod] = useState('cash on delivery');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [showToast, setShowToast] = useState(null);

  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [deliveryCharge, setDeliveryCharge] = useState(100);
  const total = Math.max(0, subtotal + deliveryCharge - discountAmount);

  useEffect(() => {
    if (city === 'Dhaka') {
      setDeliveryCharge(100);
    } else {
      setDeliveryCharge(200);
    }
  }, [city]);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setPaymentConfirmed(false);
  };

  const handleConfirmPayment = () => {
    console.log('Simulating payment confirmation...');
    setTimeout(() => {
      setPaymentConfirmed(true);
      console.log('Payment confirmed successfully!');
    }, 2000);
  };

  const handleApplyVoucher = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/vouchers/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code: voucherCode }),
      });
      const data = await res.json();

      if (res.ok) {
        setDiscountAmount(data.discountAmount);
        setShowToast({ message: data.message || `Voucher applied! You got ৳${data.discountAmount} off.`, type: 'success' });
      } else {
        setDiscountAmount(0);
        setShowToast({ message: data.message || 'Failed to apply voucher.', type: 'error' });
      }
    } catch (error) {
      console.error('Error applying voucher:', error);
      setDiscountAmount(0);
      setShowToast({ message: 'An error occurred while applying voucher.', type: 'error' });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const shippingAddress = `${address}, ${street}, ${city}, ${district}, ${postalCode}`;

    const orderDetails = {
      shippingAddress,
      paymentMethod,
      discountAmount, // Pass discount amount to backend
      voucherCode, // Pass voucher code to backend
    };

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderDetails),
      });

      const data = await response.json();

      if (response.ok) {
        const orderId = data.order._id;

        const orderResponse = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const orderData = await orderResponse.json();

        setPlacedOrder(orderData.order);
        setShowConfirmationModal(true);
        setShowToast({ message: 'Your order has been received!', type: 'success' });
        clearCart();
      } else {
        setShowToast({ message: `Failed to place order: ${data.message || response.statusText}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setShowToast({ message: 'An error occurred while placing your order.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                  <input type="text" id="firstName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                  <input type="text" id="lastName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                  <input type="tel" id="phone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                  <input type="text" id="address" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City</label>
                  <select id="city" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={city} onChange={(e) => setCity(e.target.value)} required>
                    {bangladeshiCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="district" className="block text-gray-700 text-sm font-bold mb-2">District</label>
                  <select id="district" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={district} onChange={(e) => setDistrict(e.target.value)} required>
                    {bangladeshiDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="street" className="block text-gray-700 text-sm font-bold mb-2">Street</label>
                  <input type="text" id="street" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={street} onChange={(e) => setStreet(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">Postal Code</label>
                  <input type="text" id="postalCode" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Order</h2>
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-bold text-gray-800">BDT {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Delivery Charge ({city === 'Dhaka' ? 'Dhaka' : 'Outside Dhaka'}):</span>
                  <span className="font-bold text-gray-800">BDT {deliveryCharge.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600 font-bold">
                    <span>Voucher Discount:</span>
                    <span>- BDT {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-green-600">BDT {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Apply Voucher</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter voucher code"
                    className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Billing Options</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-150">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash on delivery"
                    checked={paymentMethod === 'cash on delivery'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="ml-3 text-lg font-medium text-gray-800">Cash on Delivery</span>
                </label>

                <div>
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-150">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobileBanking"
                      checked={paymentMethod === 'mobileBanking'}
                      onChange={handlePaymentMethodChange}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-3 text-lg font-medium text-gray-800">Mobile Banking</span>
                  </label>
                  {paymentMethod === 'mobileBanking' && (
                    <div className="p-4 bg-gray-100 rounded-b-lg flex justify-around">
                      <a href="#" className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition duration-150">
                        <Image src="/assets/bkash.jpg" alt="Bkash" width={60} height={40} objectFit="contain" />
                        <p className="text-xs text-gray-700 mt-1">bKash</p>
                      </a>
                      <a href="#" className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition duration-150">
                        <Image src="/assets/nagad.png" alt="Nagad" width={60} height={40} objectFit="contain" />
                        <p className="text-xs text-gray-700 mt-1">Nagad</p>
                      </a>
                      <a href="#" className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition duration-150">
                        <Image src="/assets/rocket.png" alt="Rocket" width={60} height={40} objectFit="contain" />
                        <p className="text-xs text-gray-700 mt-1">Rocket</p>
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-150">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="internetBanking"
                      checked={paymentMethod === 'internetBanking'}
                      onChange={handlePaymentMethodChange}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-3 text-lg font-medium text-gray-800">Internet Banking / Card</span>
                  </label>
                  {paymentMethod === 'internetBanking' && (
                    <div className="p-4 bg-gray-100 rounded-b-lg">
                      <div className="mb-4">
                        <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-bold mb-2">Card Number</label>
                        <input type="text" id="cardNumber" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="**** **** **** ****" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-bold mb-2">Expiry Date</label>
                          <input type="text" id="expiryDate" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="MM/YY" />
                        </div>
                        <div>
                          <label htmlFor="cvc" className="block text-gray-700 text-sm font-bold mb-2">CVC</label>
                          <input type="text" id="cvc" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="***" />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Image src="/assets/visa.png" alt="Visa" width={40} height={25} objectFit="contain" />
                        <Image src="/assets/mastercard.png" alt="Mastercard" width={40} height={25} objectFit="contain" />
                        <Image src="/assets/amex.png" alt="Amex" width={40} height={25} objectFit="contain" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                {paymentMethod === 'cash on delivery' && (
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-xl"
                  >
                    Place Order
                  </button>
                )}

                {(paymentMethod === 'mobileBanking' || paymentMethod === 'internetBanking') && (
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 text-xl"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      {showToast && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast(null)} />}
      {showConfirmationModal && placedOrder && (
        <OrderConfirmationModal order={placedOrder} onClose={() => setShowConfirmationModal(false)} />
      )}
    </div>
  );
}
