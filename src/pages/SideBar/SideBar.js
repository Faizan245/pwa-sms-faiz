'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaClipboardList, FaGraduationCap, FaCreditCard, FaChartBar, FaChartLine, FaCertificate, FaCalendarAlt, FaSearch, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { CgMenuGridR } from "react-icons/cg";

export default function Sidebar() {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeLink, setActiveLink] = useState('/');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.setItem("isLoggedIn", "false");
        router.replace('/');
        window.location.reload();
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navLinks = [
        { href: '/', label: 'Home', icon: <FaHome /> },
        { href: '/admission', label: 'Admission', icon: <FaClipboardList /> },
        { href: '/student-section', label: 'Student Section', icon: <FaGraduationCap /> },
        { href: '/fees-management', label: 'Fees Management', icon: <FaCreditCard /> },
        { href: '/result', label: 'Result', icon: <FaChartBar /> },
        { href: '/promotion-activity', label: 'Promotion Activity', icon: <FaChartLine /> },
        { href: '/transfer-certificate', label: 'Transfer Certificate', icon: <FaCertificate /> },
        { href: '/student-attendance', label: 'Student Attendance', icon: <FaCalendarAlt /> },
        { href: '/search-box', label: 'Search Box', icon: <FaSearch /> },
        { href: '/send-notice', label: 'Send Notice', icon: <FaEnvelope /> },
    ];

    return (
        <div
            className={`bg-gray-800 max-md:fixed z-[9999] text-white shadow-[24px_0px_26px_rgba(0,_0,_0,_0.1)] max-sm:shadow-2xl rounded-tr-[40px] max-lg:rounded-tr-[30px] max-md:rounded-tr-[0px] rounded-br-[40px] max-lg:rounded-br-[30px] max-sm:rounded-br-[20px] max-md:rounded-bl-[30px] max-sm:rounded-bl-[20px]
                        max- py-4 max-md:py-0 flex flex-col max-md:flex-row justify-between transition-all duration-500 ease-in-out
                        ${isCollapsed ? 'w-[60px]' : 'w-[15%] max-xl:w-[17%] max-lg:w-[21%] max-md:w-full max-md:h-[60px]'}`}
        >
            <div className="relative max-md:flex max-md:items-center max-md:justify-between max-md:px-5 w-full">
                {/* Close/Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className={`absolute max-md:hidden right-0 top-3 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600
                                transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                >
                    ❮
                </button>

                {/* Logo */}
                <div
                    className={`cursor-pointer flex flex-col max-md:flex-row max-md:gap-2 items-center transition-all duration-500 ease-in-out ${isCollapsed ? 'justify-center' : 'justify-start'
                        }`}
                    onClick={() => setIsCollapsed(false)}
                >
                    <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed ? 'w-16 h-16 mt-16' : 'w-42 h-42'
                            }`}
                    >
                        <Image src={logo} alt="bps logo" className="w-[180px] max-xl:w-[150px] max-lg:w-[120px] max-md:w-[50px] object-contain" />
                    </div>
                    {!isCollapsed && (
                        <h2 className="text-[16px] max-lg:text-[14px] max-md:text-[20px] max-sm:text-[18px] font-bold font-serif text-center">Budana Public School</h2>
                    )}
                </div>

                {/* Navigation */}
                <nav className="max-md:hidden mt-6 flex flex-col gap-1 max-xl:gap-0">
                    {navLinks.map(({ href, label, icon }, index) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-start text-[16px] leading-5 max-xl:text-[14px] transition-all duration-500 ease-in-out relative group
                                ${activeLink === href && !isCollapsed ? 'text-yellow-400 font-bold' : 'text-white'}`}
                            onClick={() => setActiveLink(href)}
                        >
                            <span
                                className={`flex items-center justify-center w-8 h-8 transform transition-transform duration-500 ${isCollapsed ? 'opacity-100 translate-x-5' : 'translate-x-[-200%] opacity-100'
                                    }`}
                                style={{ transitionDelay: `${index * 120}ms` }}
                            >
                                {icon}
                            </span>
                            <span
                                className={`transform transition-transform duration-500 ${isCollapsed ? 'translate-x-[-200%] opacity-0' : 'translate-x-0 opacity-100'
                                    }`}
                                style={{ transitionDelay: `${index * 120}ms` }}
                            >
                                {label}
                            </span>                           
                        </Link>
                    ))}
                </nav>
                <div className='md:hidden'>
                    <button onClick={toggleMenu} className='text-[22px]'><CgMenuGridR /></button>
                </div>
            </div>

            {/* Logout Button */}
            <div className="max-md:hidden flex justify-center">
                <button
                    onClick={handleLogout}
                    className={`bg-gray-900 hover:bg-gray-700 text-white rounded-xl font-semibold py-1 px-3 transition-all duration-300 ease-in-out transform hover:scale-105 ${isCollapsed ? 'hidden' : ''
                        }`}
                >
                    Log Out
                </button>
            </div>

             {/* Mobile Menu Popup */}
             {isMenuOpen && (
                <div className="fixed inset-0 bg-gray-900 h-screen bg-opacity-90 z-50 flex flex-col items-center justify-center">
                    <button
                        onClick={toggleMenu}
                        className="absolute top-4 right-4 text-white text-2xl font-bold"
                    >
                        ×
                    </button>
                    <nav className="flex flex-col gap-6">
                        {navLinks.map(({ href, label, icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-4 text-white text-xl max-sm:text-sm"
                                onClick={() => {
                                    setActiveLink(href);
                                    toggleMenu();
                                }}
                            >
                                {icon}
                                <span>{label}</span>
                            </Link>
                        ))}
                    </nav>
                    <button
                        onClick={handleLogout}
                        className="mt-10 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold py-2 px-6 transition-all duration-300 ease-in-out"
                    >
                        Log Out
                    </button>
                </div>
            )}

        </div>
    );
}
