import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTheme } from '../../lib/useTheme';
import { useAuth } from '@/lib/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [authStatus, setAuthStatus] = useState(isAuthenticated);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    setAuthStatus(isAuthenticated);
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Funciones para controlar el hover del dropdown
  const handleMouseEnter = (menuId: string) => {
    setOpenDropdown(menuId);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <header 
      className={`${
        theme === 'dark' ? 'bg-gray-900' : 'bg-black'
      } text-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg py-2' : 'py-4'
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-wider text-white">STORE</Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none text-white"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Products Dropdown */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('products')} onMouseLeave={handleMouseLeave}>
              <DropdownMenu open={openDropdown === 'products'}>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <div className="flex items-center gap-1 hover:text-gray-300 transition-colors relative group text-white">
                    <span>Products</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-1">
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/products" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">All Products</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/products?category=bestsellers" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">Best Sellers</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/products?category=new" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">New Arrivals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/products?category=sale" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">On Sale</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Men Dropdown */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('men')} onMouseLeave={handleMouseLeave}>
              <DropdownMenu open={openDropdown === 'men'}>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <div className="flex items-center gap-1 hover:text-gray-300 transition-colors relative group text-white">
                    <span>Men</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-1">
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/men" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">All Men</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/men?category=clothing" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">Clothing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/men?category=shoes" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">Shoes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/men?category=accessories" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">Accessories</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Women Dropdown */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('women')} onMouseLeave={handleMouseLeave}>
              <DropdownMenu open={openDropdown === 'women'}>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <div className="flex items-center gap-1 hover:text-gray-300 transition-colors relative group text-white">
                    <span>Women</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-1">
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/women" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">All Women</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/women?category=clothing" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">Clothing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/women?category=shoes" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">Shoes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/women?category=accessories" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">Accessories</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Kids Dropdown */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('kids')} onMouseLeave={handleMouseLeave}>
              <DropdownMenu open={openDropdown === 'kids'}>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <div className="flex items-center gap-1 hover:text-gray-300 transition-colors relative group text-white">
                    <span>Kids</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-1">
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/kids" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">All Kids</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/kids?category=clothing" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">Clothing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/kids?category=shoes" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">Shoes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Link to="/kids?category=accessories" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">Accessories</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-800 text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <Link to="/cart" className="hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-800 relative text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </Link>

            {/* User Avatar/Auth Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                {!isAuthenticated ? (
                  <div className="p-2 rounded-full hover:bg-gray-800 transition-colors text-white">
                  <svg
                      className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium shadow-lg hover:shadow-xl transition-all cursor-pointer">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                {!isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Link to="/auth?mode=login" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Link to="/auth?mode=register" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 mb-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <DropdownMenuItem asChild className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Link to="/profile" className="w-full cursor-pointer px-4 py-2 text-gray-800 dark:text-white">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={logout}
                      className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors px-4 py-2 cursor-pointer text-red-500 hover:text-red-700"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`${
            isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          } md:hidden mt-2 overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className="py-4 space-y-4">
            <Link to="/products" className="block hover:text-gray-300 px-2 py-2 transition-colors text-white">Products</Link>
            <Link to="/men" className="block hover:text-gray-300 px-2 py-2 transition-colors text-white">Men</Link>
            <Link to="/women" className="block hover:text-gray-300 px-2 py-2 transition-colors text-white">Women</Link>
            <Link to="/kids" className="block hover:text-gray-300 px-2 py-2 transition-colors text-white">Kids</Link>
            <Link to="/cart" className="block hover:text-gray-300 px-2 py-2 transition-colors text-white">Cart</Link>
          {isAuthenticated ? (
            <>
                <div className="border-t border-gray-700 my-4 pt-4">
                  <p className="text-sm px-2 pb-2 text-white">Signed in as {user?.name}</p>
                  <Link to="/profile" className="block hover:text-gray-300 px-2 py-2 transition-colors text-white">Profile</Link>
                  <button onClick={logout} className="block w-full text-left hover:text-gray-300 px-2 py-2 transition-colors text-white">Sign Out</button>
                </div>
            </>
          ) : (
              <Link to="/auth" className="block hover:text-gray-300 px-2 py-2 transition-colors text-white">Login/Register</Link>
          )}
          <button
            onClick={toggleTheme}
              className="flex w-full items-center px-2 py-2 hover:text-gray-300 transition-colors text-white"
            >
              {theme === 'dark' ? (
                <>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  <span>Switch to Dark Mode</span>
                </>
              )}
          </button>
          </div>
        </div>
      </nav>
    </header>
  );
}