import { useState } from 'react'
import { MenuIcon, XIcon, Leaf, List, SlidersHorizontal, Route, ChartNoAxesCombined, Brain } from 'lucide-react'
import { NavLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import avatar from "../assets/avatar.png";

const Sidebar = () => {
    const [isOpen, setisOpen] = useState(false);
    const { user } = useAuth();

    const adminLinks = [
        { name: 'Telemetry', pathname: '/dashboard/latest-telemetry', icon: Leaf },
        { name: 'Telemetry History', pathname: '/dashboard/telemetry-history', icon: List },
        { name: 'Controls', pathname: '/dashboard/controls', icon: SlidersHorizontal },
        { name: 'Maps & Routes', pathname: '/dashboard/maps', icon: Route },
        { name: 'Analytics', pathname: '/dashboard/analytics', icon: ChartNoAxesCombined },
        { name: 'AI Recommendations', pathname: '/dashboard/spire-ai', icon: Brain }
    ]

    return (
        <>
            <div>
                {isOpen ? (
                    <XIcon className='w-8 h-8 md:hidden fixed top-6 left-5 sm:top-6 z-50 text-black/75' onClick={() => setisOpen(false)} />) :
                    (<MenuIcon className='w-8 h-8 md:hidden fixed top-6 left-5 sm:top-6 z-50 text-black/75' onClick={() => setisOpen(true)} />)}
                <div className={`fixed max-md:top-20 top-23 left-0 flex flex-col h-[calc(100vh-72px)] items-center justify-between bg-transparent max-md:backdrop-blur-xl max-w-65 w-full text-lg max-md:text-md z-40 transition-all duration-300 overflow-hidden ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
                    <div className='flex flex-col w-full'>
                        <div className='w-full'>
                            {adminLinks.map((link, index) => {
                                return (
                                    <NavLink
                                        key={index}
                                        to={link.pathname}
                                        onClick={() => setisOpen(false)}
                                        className={({ isActive }) =>
                                            `relative flex items-center gap-2 w-full py-4 md:pl-10 max-md:pl-8 first:mt-6 ${isActive ? 'bg-green-500/12' : ''
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <link.icon className='w-5 h-5 max-md:w-4 max-md:h-4' />
                                                <p className='text-sm'>{link.name}</p>
                                                <span
                                                    className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive ? 'bg-blue-400' : ''
                                                        }`}
                                                />
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center mb-12 max-md:mb-18">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-300 m-3">
                            <img src={avatar} className='flex items-center justify-center' />
                        </div>

                        <div className="max-w-2xl">
                            <h3 className="text-sm font-semibold text-gray-900">
                                {user?.name} 
                            </h3>

                            <p className="text-xs text-gray-500 max-w-full">
                                {user?.email} 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar
