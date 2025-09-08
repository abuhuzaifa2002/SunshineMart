import React from "react";
import Link from "next/link";

export default function AboutUs() {
    return (
        <div className="container m-auto px-4 py-16">
            <h1 className="text-3xl  font-medium text-gray-700 mb-8">About Us</h1>
            <p className="mb-4 font-medium text-gray-700">
                Welcome to Sunshine – where fashion meets positivity!At Sunshine, we believe that what you wear should make you feel as radiant as a sunny day. Our journey began with a simple idea: to create a space where everyone can find clothing that reflects their unique personality, confidence and joy.Whether you are dressing for a casual day out, a special occasion or just looking to brighten your wardrobe, Sunshine offers a curated collection of trendy, comfortable and high-quality pieces that bring out the best in you.Each item in our store is handpicked with love, inspired by the vibrant energy of sunlight and the belief that fashion should uplift and empower. We are more than just a clothing shop — we are a community that celebrates self-expression, diversity and the power of style.Thank you for being part of our story. Let your style shine with Sunshine!
            </p>
            <p className="mb-4 font-medium text-gray-700">
                At SunShine , we believe in a brighter future through conscious fashion choices. Our mission is to provide you with high-quality, eco-friendly clothing that empowers you to express your style while caring for the environment.
            </p>

            <p className="mb-4 font-medium text-gray-700">
                <h3 className="text-3xl">Founder & Creative Director </h3>With a deep love for fashion and a dream to spread positivity through style, He started Sunshine to create a clothing experience that feels as good as it looks. From selecting fabrics to guiding the brand vision,He leads with heart and hustle.
            </p>
            <h2 className="text-2xl mb-4 font-medium text-gray-700">Our Products</h2>
            <p className="mb-4">
                We offer a carefully curated collection of clothing and accessories that blend comfort, style, and versatility. Whether you are dressing up for a special occasion or keeping it casual and cozy, Sunshine has something to match your vibe.
            </p>
            <Link href="/contact" className="font-medium text-orange-600 transition-transform duration-300 transform hover:scale-125">
                Contact us today
            </Link>
             to learn more about our collections or how we champion sustainable fashion!
        </div>
    );
}