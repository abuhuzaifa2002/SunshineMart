import React from "react";

export default function FAQ() {
    return (
        <div className="container m-auto px-4 py-5">
            <div className="space-y-6 ml-6 mt-1">
                <div>
                    <h2 className="text-2xl font-medium text-gray-700">What is Sunshine?</h2>
                    <p className="text-gray-600">Sunshine is a clothing store that offers a wide range of trendy and comfortable apparel for all occasions.</p>
                </div>
                <div>
                    <h2 className="text-2xl font-medium text-gray-700">General</h2>
                    <ul className="list-disc list-inside">
                        <li className="text-gray-700">What is your business hour?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- You can shop online from our website 24/7. Our outlets are open from 10am-9pm. </li>
                            </ul>
                        <li className="text-gray-700">What are your standard measurements?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- You can check our size chart. Size Chart is added with the product picture. For any difficulties DM or call us directly</li>
                            </ul>
                        <li className="text-gray-700">Can I avail gold card offer on online shopping?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- Yes, you can avail gold card offer on online shopping. Just mention your gold card number in the order note.</li>
                            </ul>
                    </ul>
                </div>
                <div>
                    <h2 className="text-2xl font-medium text-gray-700">Shipping</h2>
                    <ul className="list-disc list-inside">
                        <li className="text-gray-700">What are my shipping options?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- We have standard shipping policy in corporation with Pathao delivery service all over the country.</li>
                            </ul>
                        <li className="text-gray-700">Can I change my shipping address?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">-We have one shipping address per order. Once an order is placed you cannot change the shipping address.</li>
                            </ul>
                        <li className="text-gray-700">When will my order ship?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- We will ship the order on the same day order is confirmed.</li>
                            </ul>
                        <li className="text-gray-700">How do I track my order?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- If you want to track your order, kindly get in touch via our Facebook, Instagram page or call us directly also we will update you about your shipment after dispatch your order from our delivery hub</li>
                            </ul>
                    </ul>
                </div>
                <div>
                    <h2 className="text-2xl font-medium text-gray-700">Exchange & Return</h2>
                    <ul className="list-disc list-inside">
                        <li className="text-gray-700">How many days will I get to exchange a product?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- Exchange is applicable within 3 days in case of stock availability. Product under sale/discount will not be exchanged. No exchange for accessories items as well.</li>
                            </ul>
                        <li className="text-gray-700">How do I initiate a return?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- You can initiate a return by contacting our customer support team via email or phone.</li>
                            </ul>
                        <li className="text-gray-700">What happens if I receive a faulty item?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- If you receive a faulty item, kindly get in touch with us within 24 hours and we will send you a new product.</li>
                            </ul>
                    </ul>
                </div>
                <div>
                    <h2 className="text-2xl font-medium text-gray-700">Payment</h2>
                    <ul className="list-disc list-inside">
                        <li className="text-gray-700">What payment methods do you accept?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- We accept cash on delivery, BKash, Nogod and bank transfer.</li>
                            </ul>
                        <li className="text-gray-700">Is it safe to use my credit card on your website?</li>
                            <ul className="list-none list-inside">
                                <li className="text-gray-600 ml-8">- Yes, we use secure payment gateways to ensure your information is safe.</li>
                            </ul>
                    </ul>
                </div>
            </div>
        </div>
    );
}