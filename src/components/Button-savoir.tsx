"use client"

import Link from 'next/link';

interface ButtonSavoirProps {
    href?: string;
    text?: string;
    onClick?: () => void;
}

export default function ButtonSavoir({
    href = "#",
    text = "En savoir plus",
    onClick
}: ButtonSavoirProps) {
    const ButtonContent = () => (
        <button
            className="group relative px-6 py-3 bg-white text-black text-xs overflow-hidden  "
            onClick={onClick}
        >


            <span className="relative z-10 flex items-center gap-2">
                {text}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.333 0.619141L12.376 0.662109L12.333 0.705078V11.7041H11.3965V1.6416L0.662109
                12.376L0 11.7139L10.7773 0.936523H0.628906V0H12.333V0.619141Z" fill="black"/>
                </svg>
            </span>
        </button>
    );

    if (href && !onClick) {
        return (
            <Link href={href}>
                <ButtonContent />
            </Link>
        );
    }

    return <ButtonContent />;
}
