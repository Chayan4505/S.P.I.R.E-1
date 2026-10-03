import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import avatar from "../assets/avatar.png";
import { useAuth } from "../context/AuthContext";
import Menu from "./Menu";
import EditProfileDrawer from "./EditProfileDrawer";
import AlertModal from "./AlertModal";
import NotificationModal from "./NotificationModal";
import { Bell, TriangleAlert } from "lucide-react";
import api from "../api/axios";
import { useWebSocket } from "../context/WebSocketContext";

const Navbar = () => {
    const { lastAlert, lastNotification } = useWebSocket();
    const [isOpen, setIsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [alertUnreadCount, setAlertUnreadCount] = useState(0);
    const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);

    const navigate = useNavigate();
    const { user } = useAuth();

    const goTo = (path) => {
        navigate(path);
        setMenuOpen(false);
        setDropdownOpen(false);
        setIsOpen(false);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        if (!lastNotification) {
            return;
        }

        setNotificationUnreadCount(
            (previous) => previous + 1
        );
    }, [lastNotification]);

    useEffect(() => {
        if (!lastAlert) {
            return;
        }

        setAlertUnreadCount(
            (previous) => previous + 1
        );
    }, [lastAlert]);

    useEffect(() => {
        if (!user) {
            setAlertUnreadCount(0);
            setNotificationUnreadCount(0);
            return;
        }

        const fetchUnreadCounts = async () => {
            try {
                const [alertRes, notificationRes] = await Promise.all([api.get("/alerts/"), api.get("/notifications/")]);
                const alerts = alertRes.data.alerts || [];
                const notifications = notificationRes.data.notifications || [];
                setAlertUnreadCount(alerts.filter((alert) => !alert.isRead).length);
                setNotificationUnreadCount(notifications.filter((notification) => !notification.isRead).length);
            } catch (error) {
                console.error(
                    "Failed to fetch unread counts:",
                    error
                );
            }
        };
        fetchUnreadCounts();
    }, [user]);

    return (
        <>
            <nav className="bg-transparent px-4 md:px-16 lg:px-24 xl:px-32 py-5 flex items-center justify-between fixed top-0 left-0 z-30 w-full">
                <div className="flex items-center gap-20">
                    <Link
                        to="/"
                        className="flex items-center outline-none focus:outline-none"
                        onClick={() => window.scrollTo(0, 0)}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-10 sm:h-10 lg:h-15 w-auto object-contain cursor-pointer"
                        />
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {!user && (
                        <>
                            <button
                                onClick={() => goTo("/login")}
                                className="flex items-center gap-2.5 text-black hover:text-green-500 hover:scale-105 text-sm font-medium py-2 rounded-full cursor-pointer border-0"
                            > Log in </button>

                            <button
                                onClick={() => goTo("/signup")}
                                className="flex items-center gap-2.5 bg-linear-to-r from-green-500 to-gray-100 text-black hover:text-gray-700 text-sm font-medium pl-5 pr-2 py-2 rounded-full cursor-pointer border-0"
                            > Get Started <span className="size-7 rounded-full bg-white flex items-center justify-center">
                                    <svg
                                        width="12"
                                        height="10"
                                        viewBox="0 0 12 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M.6 4.602h10m-4-4 4 4-4 4"
                                            stroke="#3f3f47"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                            </button>
                        </>
                    )}

                    {user && (
                        <div className="flex items-center gap-4">
                            <button onClick={() => { setNotificationOpen(true); setNotificationUnreadCount(0); setIsOpen(false); }} className=" relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 hover:text-green-600">
                                <Bell size={21} strokeWidth={1.8} />
                                {notificationUnreadCount > 0 && (<span className=" absolute -right-0.5 -top-0.5 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                                    {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
                                </span>
                                )}
                            </button>

                            <button onClick={() => { setAlertOpen(true); setAlertUnreadCount(0); setIsOpen(false); }} className=" relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 hover:text-red-600">
                                <TriangleAlert size={21} strokeWidth={1.8} />
                                {alertUnreadCount > 0 && (<span className=" absolute -right-0.5 -top-0.5 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                                    {alertUnreadCount > 99
                                        ? "99+"
                                        : alertUnreadCount}
                                </span>
                                )}
                            </button>

                            <div className=" w-13 h-13 relative bg-green-400/80 rounded-full flex items-center justify-center"
                                onMouseEnter={() => setIsOpen(true)}
                                onMouseLeave={() => setIsOpen(false)}
                            >
                                <img src={avatar} alt="Profile" className=" w-10 h-10 rounded-full cursor-pointer object-cover" />
                                {isOpen && (<div className=" absolute right-0 top-full pt-2 z-50">
                                    <Menu onEditProfile={() => { setEditProfileOpen((prev) => !prev); setIsOpen(false) }} />
                                </div>)}
                            </div>
                        </div>
                    )}
                </div>

                {!user && (<button
                    onClick={() => { setMenuOpen((prev) => !prev); setIsOpen(false); }}
                    className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1">
                    <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block w-6 h-0.5 bg-zinc-800 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
                    <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>)}

                {user && (
                    <div className="md:hidden absolute right-4 top-4 flex items-center justify-center gap-2">
                        <button onClick={() => { setNotificationOpen(true); setNotificationUnreadCount(0); setIsOpen(false); }} className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100">
                            <Bell size={19} />
                            {notificationUnreadCount > 0 && (<span className=" absolute -right-0.5 -top-0.5 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                                {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
                            </span>
                            )}
                        </button>

                        <button onClick={() => { setAlertOpen(true); setAlertUnreadCount(0); setIsOpen(false); }} className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100">
                            <TriangleAlert size={19} />
                            {alertUnreadCount > 0 && (<span className=" absolute -right-0.5 -top-0.5 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                                {alertUnreadCount > 99
                                    ? "99+"
                                    : alertUnreadCount}
                            </span>
                            )}
                        </button>

                        <div className="relative">
                            <img src={avatar} alt="Profile" className=" w-10 h-10 rounded-full cursor-pointer object-cover" onClick={() => { setIsOpen((prev) => !prev); setMenuOpen(false); }} />
                            {isOpen && (<div className=" absolute right-0 top-12 z-50" onClick={() => setIsOpen(false)}>
                                <Menu onEditProfile={() => { setEditProfileOpen((prev) => !prev); setIsOpen(false) }} />
                            </div>)}
                        </div>
                    </div>
                )}

                {!user && menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-t border-zinc-200 flex flex-col p-3 gap-1 md:hidden z-50">
                        <button
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm text-zinc-800 hover:bg-zinc-50 bg-transparent border-0 cursor-pointer"
                        >

                            <span>
                                Explore S.P.I.R.E.
                            </span>

                            <svg
                                className={`transition-transform ${dropdownOpen ? "rotate-180" : ""
                                    }`}
                                width="10"
                                height="6"
                                viewBox="0 0 10 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="m1 1 4 4 4-4"
                                    stroke="#71717b"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="flex flex-col pl-4 pr-2">
                                {!user && (
                                    <>
                                        <button
                                            onClick={() => goTo("/login")}
                                            className="flex items-center justify-center gap-2.5 bg-linear-to-r from-green-500 to-gray-100 text-black hover:text-gray-700 hover:scale-[1.02] text-sm font-medium py-2 rounded-full cursor-pointer border-0 mb-3"
                                        > Log in </button>

                                        <button
                                            onClick={() => goTo("/signup")}
                                            className="flex items-center justify-center gap-2.5 bg-linear-to-r from-green-500 to-gray-100 text-black hover:text-gray-700 text-sm font-medium pl-5 pr-2 py-2 rounded-full cursor-pointer border-0"
                                        > Get Started
                                            <span className="size-7 rounded-full bg-white flex items-center justify-center">
                                                <svg
                                                    width="12"
                                                    height="10"
                                                    viewBox="0 0 12 10"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M.6 4.602h10m-4-4 4 4-4 4"
                                                        stroke="#3f3f47"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </nav>
            <EditProfileDrawer open={editProfileOpen} onOpenChange={setEditProfileOpen} />
            <NotificationModal open={notificationOpen} onOpenChange={setNotificationOpen} />
            <AlertModal open={alertOpen} onOpenChange={setAlertOpen} />
        </>
    );
};

export default Navbar;
