import Link from "next/link";

export function AuthFooter() {
    return (
        <footer className="absolute bottom-0 w-full h-16 text-white flex items-center bg-black/[0.2] justify-center border-t border-white/[0.2]">
            <div className="w-full max-w-[1280px] flex justify-around">
                <p className="text-sm">
                    Copyright © 2024 Caique Ribeiro
                </p>

                <div className="flex justify-between gap-8">
                    <Link className="text-sm" href="https://linkedin.com/in/caique-ribeiro/" target="_blank">
                        Social
                    </Link>

                    <Link className="text-sm" href="https://github.com/CaiqueRibeiro" target="_blank">
                        Github
                    </Link>
                </div>
            </div>
        </footer>
    )
}