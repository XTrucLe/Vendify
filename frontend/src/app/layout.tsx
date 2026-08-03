import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['vietnamese', 'latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-be-vietnam-pro',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Vendify - QR Ordering cho Nhà hàng & Quán Cafe',
    description:
        'Vendify là hệ thống QR ordering cho nhà hàng và quán cafe. Khách quét QR tại bàn để xem menu, gọi món và thanh toán. Scan. Order. Enjoy.',
    keywords: ['Vendify', 'QR Ordering', 'QR Menu', 'Nhà hàng', 'Quán cafe', 'Order tại bàn', 'KDS', 'Thanh toán VietQR'],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="vi" className={`${beVietnamPro.variable} scroll-smooth`}>
            <body className="bg-white text-slate-800 antialiased">{children}</body>
        </html>
    )
}
