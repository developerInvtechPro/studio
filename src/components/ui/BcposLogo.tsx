import { cn } from "@/lib/utils";

export function BcposLogo({ className }: { className?: string }) {
    return (
        <div className={cn("font-headline select-none", className)}>
            <div className="flex items-end leading-none">
                <span className="text-6xl font-black text-black">BC</span>
                <span className="text-5xl font-bold text-primary ml-1">POS</span>
            </div>
            <svg
                width="100%"
                height="12"
                viewBox="0 0 175 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-[-8px] ml-[2px]"
            >
                <path
                    d="M2 10H37L52 2L67 10H107L122 2H173"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2.5"
                />
                <circle cx="2" cy="10" r="2" fill="hsl(var(--primary))" />
                <circle cx="173" cy="2" r="2" fill="hsl(var(--primary))" />
                <path d="M27 10H47" stroke="hsl(var(--primary))" strokeWidth="2.5" />
                <circle cx="27" cy="10" r="2" fill="hsl(var(--primary))" />
            </svg>
        </div>
    );
}
