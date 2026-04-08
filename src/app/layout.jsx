import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Multi-Product Analytics & Forecasting Engine',
    description: 'Production-ready analytics engine for product managers.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-beige text-darkgreen antialiased`}>
                <AuthProvider>
                    <DataProvider>
                        {children}
                    </DataProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
