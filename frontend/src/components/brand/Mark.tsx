import { LogoIcon } from '@/components/brand/Logo'

export const Mark = () => {
    return (
        <div className="flex items-center px-2 py-1.5 cursor-pointer">
            <LogoIcon />
            <div className="flex flex-col justify-center leading-none">
                <span className="text-lg font-bold uppercase tracking-[0.12em] text-white">
                    EN<span className="text-(--brand-color)">DI</span>FY
                </span>
                <span className="-ml-3.25 text-[9px] font-medium uppercase tracking-widest text-white/80">
                    Scan-Order-Enjoy
                </span>
            </div>
        </div>
    )
}
