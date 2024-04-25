import { sideBarLinks } from "@/constants"
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const [pathname, setPathname] = useState('');

    useEffect(() => {
        setPathname(location.pathname);
    }, [location]);

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[304px]">
        <div className="flex flex-1 flex-col gap-6">
            {
                sideBarLinks.map((link, index) => {
                    const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
                    return (
                        <Link 
                            to={link.route} 
                            key={index}
                            className={cn('flex gap-4 items-center p-4 rounded-lg justify-start', {
                                'bg-blue-1': isActive
                            })}
                        >
                            <img src={link.imgUrl} alt={link.label} />
                            <p className="text-lg font-semibold max-lg:hidden">
                                {link.label}
                            </p>
                        </Link>
                    )
                })
            }
        </div>
    </section>
  )
}

export default Sidebar