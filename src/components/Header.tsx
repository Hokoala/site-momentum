"use client";

import Link from 'next/link';
import { Menu, MousePointerClick } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const menuItems = [
    {
        label: 'Accueil',
        href: '/',
        description: 'Retour à la page principale',
    }
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
            <div className="flex justify-between items-center p-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary p-1 rounded-md">
                        <MousePointerClick className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-md font-light text-white">LOGO</span>
                </Link>

                {/* Navigation Desktop */}
                <div className="hidden md:flex flex-1 px-8 items-center gap-6">
                    <Link
                        href="#Info"
                        className="text-xs font-light hover:border-b hover:border-b-primary uppercase text-white/70 hover:text-white transition-colors"
                    />

                </div>



                {/* Menu Mobile avec Sheet */}
                <div className="md:hidden flex items-center gap-2">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Menu"
                                className="border-border"
                            >
                                <Menu size={24} strokeWidth={1.5} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <div className="bg-primary p-1 rounded-md">
                                        <MousePointerClick className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <span className="text-lg font-light">Aif-f Studios.</span>
                                </SheetTitle>
                                <SheetDescription>Navigation du projet</SheetDescription>
                            </SheetHeader>

                            <Separator className="my-4" />

                            {/* Menu Items */}
                            <nav className="flex flex-col">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group block py-2 px-4 hover:bg-muted transition-colors rounded-md"
                                        onClick={closeMenu}
                                    >
                                        <div className="text-sm font-medium group-hover:text-primary transition-colors">
                                            {item.label}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {item.description}
                                        </div>
                                    </Link>
                                ))}
                            </nav>

                            {/* Footer */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <Separator className="mb-4" />
                                <p className="text-xs text-muted-foreground text-center">
                                    © 2025 Aif-f Studios
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
