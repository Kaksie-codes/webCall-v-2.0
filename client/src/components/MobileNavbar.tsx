import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { sideBarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"
  

const MobileNavbar = () => {
    const location = useLocation();
    const [pathname, setPathname] = useState('');

    useEffect(() => {
        setPathname(location.pathname);
    }, [location]);

  return (
    <section className="w-full max-w-[264px]">
        <Sheet>
            <SheetTrigger asChild>
                <img 
                    src="/icons/hamburger.svg" 
                    alt="hamburger icon" 
                    className="sm:hidden cursor-pointer"
                />
            </SheetTrigger>
            <SheetContent side='left' className="border-none bg-dark-1">
                <Link to={'/'} className="flex items-center gap-1">
                    <img src="/icons/logo.svg" alt="" />
                    <p className="text-[26px] text-white font-extrabold ">webCall</p>
                </Link>
                <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
                    <SheetClose asChild>
                        <section className="flex flex-1 h-full flex-col gap-6 pt-16 text-white">
                        {
                            sideBarLinks.map((link, index) => {
                                const isActive = pathname === link.route;
                                return (
                                    <SheetClose key={index} asChild>
                                        <Link
                                            to={link.route}                                            
                                            className={cn('flex gap-4 items-center p-4 rounded-lg w-full max-w-60', {
                                            'bg-blue-1': isActive
                                            })}
                                        >
                                            <img src={link.imgUrl} alt={link.label} />
                                            <p className="font-semibold">
                                                {link.label}
                                            </p>
                                        </Link>
                                    </SheetClose>
                                )
                            })
                        }
                        </section>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    </section>
  )
}

export default MobileNavbar