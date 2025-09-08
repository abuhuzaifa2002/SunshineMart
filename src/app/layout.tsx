import './globals.css';
import { Playfair_Display, Poppins } from 'next/font/google';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { CartProvider } from '@/context/CartContext'; // Import CartProvider
import Chatbot from '@/components/Chatbot';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'Sunshine Mart - Brighten Your Shopping Experience',
  description:
    'Welcome to Sunshine Mart - Your radiant destination for fashion and lifestyle. Shop our curated collection of clothing and accessories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${playfair.variable} ${poppins.variable} dark:bg-black dark:text-white`} lang="en" >
      <body className="font-sans dark:bg-black dark:text-white" suppressHydrationWarning={true}>
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <Chatbot />
        </CartProvider>
      </body>
    </html>
  );
}