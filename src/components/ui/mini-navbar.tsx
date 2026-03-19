"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const AnimatedNavLink = ({ to, children, isExternal = false }: { to: string; children: React.ReactNode; isExternal?: boolean }) => {
  const defaultTextColor = 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-sm';

  if (isExternal) {
    return (
      <a href={to} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
        <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
          <span className={defaultTextColor}>{children}</span>
          <span className={hoverTextColor}>{children}</span>
        </div>
      </a>
    );
  }

  return (
    <Link to={to} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </Link>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<any>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <Link to="/" className="flex items-center gap-2">
      <div className="bg-[#ec5b13] p-1 rounded text-white flex items-center justify-center">
        <span className="material-symbols-outlined text-lg">account_balance</span>
      </div>
      <span className="text-white font-bold tracking-tight text-sm">Saarthii</span>
    </Link>
  );

  const navLinksData = [
    { label: 'Home', to: '/' },
    { label: 'About us', to: '/about' },
    { label: 'Problem', to: '/#problem', isExternal: true },
    { label: 'Solution', to: '/#solution', isExternal: true },
    { label: 'Features', to: '/#features', isExternal: true },
  ];

  const loginButtonElement = (
    <button className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full sm:w-auto">
      Login
    </button>
  );

  const signupButtonElement = (
        <button className="relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-bold text-white bg-[#ec5b13] rounded-full hover:opacity-90 transition-all duration-200 w-full sm:w-auto shadow-lg shadow-primary/20">
          Request Demo
        </button>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-sm
                       ${headerShapeClass}
                       border border-[#333] bg-[#1f1f1f57]
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-0 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">
           {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.to} to={link.to} isExternal={link.isExternal}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {loginButtonElement}
          {signupButtonElement}
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            link.isExternal ? (
              <a key={link.to} href={link.to} className="text-gray-300 hover:text-white transition-colors w-full text-center">
                {link.label}
              </a>
            ) : (
              <Link key={link.to} to={link.to} className="text-gray-300 hover:text-white transition-colors w-full text-center" onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            )
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {loginButtonElement}
          {signupButtonElement}
        </div>
      </div>
    </header>
  );
}
