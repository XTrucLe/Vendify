'use client'

import { useState, type FormEvent } from 'react'
import { Mark } from './brand/Mark'

const navLinks = [
    { href: '#problem', label: 'Vấn đề' },
    { href: '#solution', label: 'Giải pháp' },
    { href: '#features', label: 'Tính năng' },
    { href: '#workflow', label: 'Quy trình' },
    { href: '#faq', label: 'FAQ' },
]

const heroStats = [
    {
        value: '< 30 giây',
        label: 'Từ quét QR đến gửi đơn',
    },
    {
        value: 'Real-time',
        label: 'Bếp nhận đơn qua KDS',
    },
    {
        value: 'Không đăng ký',
        label: 'Khách vãng lai dùng được ngay',
    },
]

const ownerProblems = [
    'Chi phí nhân viên phục vụ cao, đặc biệt vào khung giờ cao điểm.',
    'Order thủ công dễ sai sót, mất thời gian xác nhận giữa khách - nhân viên - bếp.',
    'Khó theo dõi trạng thái bàn, hành vi khách hàng và hiệu quả kinh doanh.',
    'Chương trình tích điểm, ưu đãi rời rạc, thiếu tự động.',
]

const customerProblems = [
    'Phải chờ nhân viên để xem menu, gọi món hoặc thanh toán.',
    'Menu giấy khó xem, thiếu hình ảnh, thiếu mô tả món chi tiết.',
    'Không biết đơn hàng đang ở trạng thái nào: đã xác nhận, đang chế biến hay đã sẵn sàng.',
    'Không có cách tích điểm, nhận ưu đãi nhanh gọn khi thanh toán.',
]

const solutionCards = [
    {
        icon: '📱',
        title: 'Quét QR tại bàn',
        description: 'Không cần tải app, không cần đăng ký. Khách quét QR là có thể xem menu và order ngay.',
    },
    {
        icon: '🍜',
        title: 'Menu trực quan',
        description: 'Hiển thị món ăn theo danh mục, hình ảnh, giá bán và tùy chọn như size, đường, đá, topping.',
    },
    {
        icon: '👨‍🍳',
        title: 'Bếp nhận real-time',
        description: 'Đơn hàng được đẩy xuống Kitchen Display System qua WebSocket, hạn chế sót đơn và chậm trễ.',
    },
    {
        icon: '💳',
        title: 'Thanh toán linh hoạt',
        description: 'Hỗ trợ VietQR, Momo hoặc tiền mặt. Có thể tích điểm khách hàng qua số điện thoại.',
    },
]

const workflowSteps = [
    {
        step: '1',
        title: 'Khách vào quán',
        description: 'Nhân viên sắp xếp bàn hoặc khách tự chọn bàn phù hợp. Mã QR được đặt sẵn tại bàn.',
    },
    {
        step: '2',
        title: 'Quét QR tạo session',
        description: 'Hệ thống tạo phiên làm việc theo bàn, giúp quản lý đơn hàng gắn đúng bàn đang phục vụ.',
    },
    {
        step: '3',
        title: 'Xem menu và chọn món',
        description: 'Khách xem menu trên điện thoại, chọn món và tùy chỉnh size, đường, đá, topping.',
    },
    {
        step: '4',
        title: 'Gửi đơn xuống bếp',
        description: 'Đơn hàng được chuyển tới bếp qua KDS real-time. Có thể thêm món vào đơn hiện tại.',
    },
    {
        step: '5',
        title: 'Thanh toán',
        description: 'Khách thanh toán bằng VietQR, Momo hoặc tiền mặt. Nhân viên xác nhận khi cần.',
    },
    {
        step: '6',
        title: 'Tích điểm & hoàn tất',
        description: 'Khách có thể nhập số điện thoại để tích điểm. Bàn được đóng session sau khi dọn xong.',
    },
]

const featureCards = [
    {
        icon: '👥',
        title: 'Quản lý nhân viên & phân quyền',
        description:
            'Đăng nhập JWT, phân quyền Owner / Manager / Staff. Quản lý nhân viên, kích hoạt hoặc vô hiệu hóa tài khoản.',
    },
    {
        icon: '🍔',
        title: 'Menu & sản phẩm linh hoạt',
        description:
            'Quản lý danh mục, sản phẩm, hình ảnh, giá bán và trạng thái còn hàng / hết hàng. Hỗ trợ option món và giá điều chỉnh.',
    },
    {
        icon: '🪑',
        title: 'Quản lý bàn & session',
        description:
            'Tạo QR theo từng bàn, phân zone, theo dõi sức chứa và trạng thái bàn. Session mở khi khách quét QR và đóng khi dọn bàn.',
    },
    {
        icon: '📋',
        title: 'Đơn hàng & state machine',
        description:
            'Đơn hàng đi qua các trạng thái: pending, confirmed, preparing, ready, served, completed. Snapshot giá giúp đơn không bị ảnh hưởng khi đổi giá.',
    },
    {
        icon: '🖥️',
        title: 'Kitchen Display System',
        description:
            'Bếp nhận đơn real-time qua WebSocket, giảm tình trạng sót đơn, chậm đơn hoặc nhầm món trong giờ cao điểm.',
    },
    {
        icon: '💳',
        title: 'Thanh toán & loyalty',
        description:
            'Hỗ trợ VietQR, Momo, tiền mặt và webhook thanh toán. Khách có thể nhập số điện thoại để tích điểm tùy chọn.',
    },
]

const techStack = [
    {
        name: 'Next.js',
        description: 'Frontend staff dashboard & customer mobile web',
    },
    {
        name: 'NestJS',
        description: 'Backend modular, REST API + WebSocket Gateway',
    },
    {
        name: 'PostgreSQL',
        description: 'Database chính cho đơn hàng, menu, bàn',
    },
    {
        name: 'Redis',
        description: 'Quản lý session, cache trạng thái nhanh',
    },
    {
        name: 'WebSocket',
        description: 'Đồng bộ đơn hàng real-time xuống bếp',
    },
    {
        name: 'Docker',
        description: 'Container hóa, triển khai nhất quán',
    },
]

const ownerBenefits = [
    {
        title: 'Giảm phụ thuộc vào nhân viên order',
        description: 'Khách tự order tại bàn, nhân viên tập trung phục vụ và vận hành.',
    },
    {
        title: 'Giảm sai sót đơn hàng',
        description: 'Đơn được ghi nhận trực tiếp từ khách và chuyển xuống bếp rõ ràng.',
    },
    {
        title: 'Tăng khả năng upsell',
        description: 'Menu số dễ dàng gợi ý topping, món kèm, combo và ưu đãi.',
    },
    {
        title: 'Xây dựng khách hàng thân thiết',
        description: 'Tích điểm qua số điện thoại giúp khuyến khích khách quay lại.',
    },
]

const customerBenefits = [
    {
        title: 'Không phải chờ nhân viên',
        description: 'Chỉ cần quét QR là xem menu, chọn món và gửi đơn ngay.',
    },
    {
        title: 'Menu rõ ràng, trực quan',
        description: 'Có hình ảnh, mô tả, giá và tùy chọn món chi tiết.',
    },
    {
        title: 'Theo dõi trạng thái đơn',
        description: 'Biết đơn đã được xác nhận, đang chế biến hay đã sẵn sàng.',
    },
    {
        title: 'Thanh toán nhanh',
        description: 'Chọn VietQR, Momo hoặc tiền mặt tùy nhu cầu.',
    },
]

const businessMetrics = [
    {
        value: '40%',
        label: 'Mục tiêu giảm thời gian order so với cách truyền thống',
    },
    {
        value: '15-20%',
        label: 'Kỳ vọng tăng doanh thu nhờ upsell và gợi ý món',
    },
    {
        value: '+25%',
        label: 'Tỷ lệ khách quay lại nhờ chương trình loyalty',
    },
    {
        value: '20-30%',
        label: 'Mục tiêu giảm chi phí nhân viên phục vụ',
    },
]

const faqs = [
    {
        question: 'Khách có bắt buộc đăng ký tài khoản không?',
        answer: 'Không. Vendify cho phép khách vãng lai order ngay sau khi quét QR. Việc nhập số điện thoại để tích điểm là tùy chọn, chỉ thực hiện khi khách muốn nhận ưu đãi hoặc tích điểm.',
    },
    {
        question: 'Nếu khách không quen dùng QR thì sao?',
        answer: 'Quán có thể đặt hướng dẫn ngắn tại bàn và để nhân viên hỗ trợ trong thời gian đầu. Trải nghiệm được thiết kế đơn giản: quét QR, xem menu, chọn món và gửi đơn.',
    },
    {
        question: 'Đơn hàng có bị ảnh hưởng khi quán đổi giá món không?',
        answer: 'Không. Vendify sử dụng cơ chế snapshot giá vào chi tiết đơn hàng. Khi đơn đã được tạo, giá của món trong đơn không thay đổi dù menu được cập nhật sau đó.',
    },
    {
        question: 'Bếp nhận đơn như thế nào?',
        answer: 'Đơn hàng được đẩy xuống Kitchen Display System theo thời gian thực thông qua WebSocket. Bếp thấy đơn ngay khi khách gửi, không cần nhân viên chạy đơn thủ công.',
    },
    {
        question: 'Vendify phù hợp với mô hình nào?',
        answer: 'Vendify được thiết kế phù hợp cho quán cafe, trà sữa, quán ăn, nhà hàng nhỏ và vừa. Kiến trúc modular giúp hệ thống dễ mở rộng khi cần thêm chi nhánh hoặc tính năng nâng cao.',
    },
]

export default function VendifyLanding() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitted(true)
        event.currentTarget.reset()
    }

    return (
        <>
            {/* Header */}
            <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Mark />

                    <nav className="hidden items-center gap-7 text-sm font-medium text-slate-200 lg:flex">
                        {navLinks.map((link) => (
                            <a key={link.href} href={link.href} className="hover:text-white">
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 lg:flex">
                        <a
                            href="#contact"
                            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Liên hệ tư vấn
                        </a>
                        <a
                            href="#contact"
                            className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
                        >
                            Dùng thử miễn phí
                        </a>
                    </div>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="inline-flex items-center justify-center rounded-xl border border-white/15 p-2 text-white lg:hidden"
                        aria-label="Mở menu"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {menuOpen && (
                    <div className="border-t border-white/10 bg-slate-950 px-4 pb-5 pt-4 lg:hidden">
                        <div className="flex flex-col gap-3 text-sm font-medium text-slate-200">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 hover:bg-white/10"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                onClick={() => setMenuOpen(false)}
                                className="rounded-lg bg-orange-600 px-3 py-2 text-center font-semibold text-white"
                            >
                                Dùng thử miễn phí
                            </a>
                        </div>
                    </div>
                )}
            </header>

            <main>
                {/* Hero */}
                <section className="hero-gradient relative overflow-hidden pb-24 pt-32 text-white lg:pb-32 lg:pt-40">
                    <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-orange-200">
                                <span className="h-2 w-2 rounded-full bg-orange-400" />
                                Scan. Order. Enjoy.
                            </div>

                            <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight sm:text-5xl xl:text-6xl">
                                Biến mỗi bàn ăn thành một <span className="text-orange-400">điểm order tự động</span>
                            </h1>

                            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                                Vendify giúp khách hàng quét mã QR tại bàn để xem menu, gọi món và thanh toán mà không cần chờ
                                nhân viên. Phù hợp cho nhà hàng, quán cafe, trà sữa và mô hình F&B hiện đại.
                            </p>

                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <a
                                    href="#contact"
                                    className="rounded-2xl bg-orange-600 px-7 py-4 text-center text-base font-bold text-white transition hover:bg-orange-700"
                                >
                                    Bắt đầu dùng thử
                                </a>
                                <a
                                    href="#workflow"
                                    className="rounded-2xl border border-white/20 bg-white/5 px-7 py-4 text-center text-base font-bold text-white transition hover:bg-white/10"
                                >
                                    Xem quy trình hoạt động
                                </a>
                            </div>

                            <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
                                {heroStats.map((stat) => (
                                    <div key={stat.label} className="glass-card rounded-2xl p-4">
                                        <p className="text-2xl font-extrabold text-orange-400">{stat.value}</p>
                                        <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="mx-auto w-full max-w-sm rounded-[2.5rem] border border-white/15 bg-white p-3 card-shadow">
                                <div className="overflow-hidden rounded-4xl bg-slate-50">
                                    <div className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white">
                                        <div>
                                            <p className="text-xs text-slate-300">Vendify QR Menu</p>
                                            <p className="text-sm font-bold">Bàn 12 - Zone A</p>
                                        </div>
                                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                                            Đang mở
                                        </span>
                                    </div>

                                    <div className="space-y-4 p-5">
                                        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                                            <div>
                                                <p className="font-bold text-slate-900">Trà đào cam sả</p>
                                                <p className="text-xs text-slate-500">Size L · Ít đường · Nhiều đá</p>
                                            </div>
                                            <p className="font-bold text-orange-600">45.000₫</p>
                                        </div>

                                        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                                            <div>
                                                <p className="font-bold text-slate-900">Bánh mì bò nướng</p>
                                                <p className="text-xs text-slate-500">Thêm phô mai · Không cay</p>
                                            </div>
                                            <p className="font-bold text-orange-600">38.000₫</p>
                                        </div>

                                        <div className="rounded-2xl border border-dashed border-orange-300 bg-orange-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-slate-700">Tổng cộng</p>
                                                <p className="text-lg font-extrabold text-orange-600">83.000₫</p>
                                            </div>
                                            <p className="mt-1 text-xs text-slate-500">Đơn đã được gửi xuống bếp real-time</p>
                                        </div>

                                        <button className="w-full rounded-2xl bg-orange-600 py-3.5 font-bold text-white">
                                            Gửi đơn hàng
                                        </button>

                                        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-500">
                                            <div className="rounded-xl bg-white p-3 shadow-sm">Quét QR</div>
                                            <div className="rounded-xl bg-white p-3 shadow-sm">Chọn món</div>
                                            <div className="rounded-xl bg-white p-3 shadow-sm">Thanh toán</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -left-4 top-10 hidden rounded-2xl bg-white px-4 py-3 text-slate-900 card-shadow md:block">
                                <p className="text-xs text-slate-500">Kitchen Display</p>
                                <p className="text-sm font-bold">Đơn #128 đã vào bếp</p>
                            </div>

                            <div className="absolute -right-2 bottom-16 hidden rounded-2xl bg-white px-4 py-3 text-slate-900 card-shadow md:block">
                                <p className="text-xs text-slate-500">Thanh toán</p>
                                <p className="text-sm font-bold">VietQR / Momo / Tiền mặt</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem */}
                <section id="problem" className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Vấn đề</p>
                            <h2 className="section-title mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Vận hành thủ công làm chậm trải nghiệm khách hàng
                            </h2>
                            <p className="mt-5 text-lg text-slate-600">
                                Nhà hàng và quán cafe thường gặp khó khăn trong giờ cao điểm: order chậm, sai món, thiếu trạng
                                thái đơn hàng và khó xây dựng chương trình khách hàng thân thiết hiệu quả.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-8 lg:grid-cols-2">
                            <div className="rounded-4xl border border-slate-200 bg-slate-50 p-8">
                                <h3 className="text-xl font-bold text-slate-800">Đối với chủ quán</h3>
                                <ul className="mt-6 space-y-4">
                                    {ownerProblems.map((problem) => (
                                        <li key={problem} className="flex gap-3 text-slate-700">
                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                            <span>{problem}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-4xl border border-slate-200 bg-slate-50 p-8">
                                <h3 className="text-xl font-bold text-slate-800">Đối với khách hàng</h3>
                                <ul className="mt-6 space-y-4">
                                    {customerProblems.map((problem) => (
                                        <li key={problem} className="flex gap-3 text-slate-700">
                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                            <span>{problem}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution */}
                <section id="solution" className="bg-slate-950 py-24 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Giải pháp</p>
                            <h2 className="section-title mt-3 text-3xl font-extrabold sm:text-4xl">
                                Vendify số hóa toàn bộ hành trình từ gọi món đến thanh toán
                            </h2>
                            <p className="mt-5 text-lg text-slate-300">
                                Khách chỉ cần quét mã QR tại bàn. Hệ thống tạo phiên làm việc, hiển thị menu, cho phép chọn món,
                                gửi đơn xuống bếp real-time và hỗ trợ thanh toán linh hoạt.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {solutionCards.map((item) => (
                                <div key={item.title} className="glass-card rounded-[1.75rem] p-7">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-2xl">
                                        {item.icon}
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Workflow */}
                <section id="workflow" className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Quy trình hoạt động</p>
                            <h2 className="section-title section-title-center mt-3 text-3xl font-extrabold text-slate-400 sm:text-4xl">
                                6 bước đơn giản từ lúc khách vào bàn đến khi thanh toán
                            </h2>
                        </div>

                        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {workflowSteps.map((item) => (
                                <div
                                    key={item.step}
                                    className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg"
                                >
                                    <div className="flex item-center gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 font-extrabold text-orange-600">
                                            {item.step}
                                        </div>
                                        <h3 className="mt-2 text-lg font-bold text-slate-900 align-middle">{item.title}</h3>
                                    </div>
                                    <p className="mt-1 text-sm leading-7 text-slate-600 indent-1">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="bg-slate-50 py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Tính năng nổi bật</p>
                            <h2 className="section-title mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Hệ thống QR ordering được thiết kế cho vận hành thực tế
                            </h2>
                            <p className="mt-5 text-lg text-slate-600">
                                Vendify không chỉ là menu QR. Hệ thống bao gồm nhân viên, menu, bàn, đơn hàng, bếp và thanh toán
                                trong một luồng thống nhất.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {featureCards.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600/10 text-2xl">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold text-slate-900">{feature.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tech stack */}
                <section id="tech" className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Nền tảng kỹ thuật</p>
                            <h2 className="section-title mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Kiến trúc modular, sẵn sàng mở rộng
                            </h2>
                            <p className="mt-5 text-lg text-slate-600">
                                Vendify được thiết kế theo kiến trúc module: Identity, Catalog, Floor, Ordering và Payments. Dễ
                                vận hành, dễ nâng cấp và phù hợp cho cả quán nhỏ lẫn chuỗi nhiều chi nhánh.
                            </p>
                        </div>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                            {techStack.map((item) => (
                                <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Lợi ích</p>
                            <h2 className="section-title section-title-center mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Tăng trải nghiệm khách hàng, giảm chi phí vận hành
                            </h2>
                        </div>

                        <div className="mt-14 overflow-hidden rounded-[2.5rem] bg-slate-950 text-white">
                            <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2">
                                <div>
                                    <h3 className="text-2xl font-bold">Chủ quán nhận được gì?</h3>
                                    <ul className="mt-8 space-y-5">
                                        {ownerBenefits.map((benefit) => (
                                            <li key={benefit.title} className="flex gap-4">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                                                    ✓
                                                </span>
                                                <div>
                                                    <p className="font-semibold">{benefit.title}</p>
                                                    <p className="mt-1 text-sm text-slate-300">{benefit.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-4xl bg-white/5 p-8">
                                    <h3 className="text-2xl font-bold">Khách hàng nhận được gì?</h3>
                                    <ul className="mt-8 space-y-5">
                                        {customerBenefits.map((benefit) => (
                                            <li key={benefit.title} className="flex gap-4">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-300">
                                                    ✓
                                                </span>
                                                <div>
                                                    <p className="font-semibold">{benefit.title}</p>
                                                    <p className="mt-1 text-sm text-slate-300">{benefit.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="grid gap-4 border-t border-white/10 p-8 sm:grid-cols-2 lg:grid-cols-4 sm:p-10">
                                {businessMetrics.map((metric) => (
                                    <div key={metric.label} className="rounded-2xl bg-white/5 p-5">
                                        <p className="text-2xl font-extrabold text-orange-400">{metric.value}</p>
                                        <p className="mt-1 text-sm text-slate-300">{metric.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="bg-slate-50 py-24">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Câu hỏi thường gặp</p>
                            <h2 className="section-title section-title-center mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Vendify phù hợp với mô hình của bạn như thế nào?
                            </h2>
                        </div>

                        <div className="mt-12 space-y-4">
                            {faqs.map((faq) => (
                                <details
                                    key={faq.question}
                                    className="group rounded-2xl border border-slate-200 bg-white p-6 open:shadow-sm"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">
                                        {faq.question}
                                        <span className="text-orange-600">+</span>
                                    </summary>
                                    <p className="mt-4 text-slate-600">{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-[2.5rem] bg-slate-950 text-white">
                            <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Liên hệ</p>
                                    <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                                        Sẵn sàng triển khai QR ordering cho quán của bạn?
                                    </h2>
                                    <p className="mt-5 max-w-lg text-slate-300">
                                        Để lại thông tin để được tư vấn demo, thiết lập menu, tạo QR theo bàn và triển khai thử
                                        nghiệm cho nhà hàng hoặc quán cafe của bạn.
                                    </p>

                                    <div className="mt-10 space-y-4">
                                        <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-5">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-xl">
                                                ⚡
                                            </div>
                                            <div>
                                                <p className="font-semibold">Triển khai nhanh</p>
                                                <p className="text-sm text-slate-300">
                                                    Thiết lập menu, bàn và QR code trong thời gian ngắn.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-5">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-xl">
                                                🧩
                                            </div>
                                            <div>
                                                <p className="font-semibold">Kiến trúc modular</p>
                                                <p className="text-sm text-slate-300">
                                                    Dễ mở rộng voucher, kho hàng, analytics, multi-branch.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-5">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-xl">
                                                ☎️
                                            </div>
                                            <div>
                                                <p className="font-semibold">Hỗ trợ vận hành</p>
                                                <p className="text-sm text-slate-300">
                                                    Phù hợp cho quán nhỏ và vừa, dễ đào tạo nhân viên.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-4xl bg-white p-8 text-slate-900 card-shadow">
                                    <h3 className="text-xl font-bold">Đăng ký tư vấn miễn phí</h3>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                                    </p>

                                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                        <div>
                                            <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                                                Họ và tên
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                placeholder="Nguyễn Văn A"
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
                                                Số điện thoại
                                            </label>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                required
                                                placeholder="0901234567"
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="business" className="mb-2 block text-sm font-semibold">
                                                Tên quán / nhà hàng
                                            </label>
                                            <input
                                                id="business"
                                                name="business"
                                                type="text"
                                                required
                                                placeholder="Cafe Vendify"
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="model" className="mb-2 block text-sm font-semibold">
                                                Mô hình kinh doanh
                                            </label>
                                            <select
                                                id="model"
                                                name="model"
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
                                            >
                                                <option>Quán cafe / trà sữa</option>
                                                <option>Quán ăn</option>
                                                <option>Nhà hàng</option>
                                                <option>Mô hình khác</option>
                                            </select>
                                        </div>

                                        {submitted && (
                                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                                                Cảm ơn bạn đã quan tâm Vendify! Thông tin tư vấn đã được ghi nhận.
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className="w-full rounded-2xl bg-orange-600 py-4 font-bold text-white transition hover:bg-orange-700"
                                        >
                                            Gửi thông tin tư vấn
                                        </button>

                                        <p className="text-center text-xs text-slate-500">
                                            Vendify chỉ sử dụng thông tin để liên hệ tư vấn, không chia sẻ cho bên thứ ba.
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-slate-950 py-12 text-slate-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 md:grid-cols-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-sm font-black text-white">
                                    V
                                </div>
                                <span className="text-lg font-extrabold text-white">Vendify</span>
                            </div>
                            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
                                Hệ thống QR Ordering cho nhà hàng và quán cafe. Khách quét QR tại bàn để xem menu, gọi món và
                                thanh toán.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-white">Tính năng</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>
                                    <a href="#features" className="hover:text-white">
                                        Quản lý menu
                                    </a>
                                </li>
                                <li>
                                    <a href="#features" className="hover:text-white">
                                        Quản lý bàn & session
                                    </a>
                                </li>
                                <li>
                                    <a href="#features" className="hover:text-white">
                                        Đơn hàng real-time
                                    </a>
                                </li>
                                <li>
                                    <a href="#features" className="hover:text-white">
                                        Thanh toán & loyalty
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-white">Liên hệ</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>Email: hello@vendify.app</li>
                                <li>Hotline: 0900 000 000</li>
                                <li>Website: vendify.app</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row">
                        <p>© 2026 Vendify. Scan. Order. Enjoy.</p>
                        <p>Thiết kế dành cho nhà hàng & quán cafe hiện đại.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
