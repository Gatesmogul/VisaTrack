import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import CurrencySelector from './CurrencySelector';


const Header = () => {
  const location = useLocation();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  
  const accountMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // call logout from auth context if available
    try { logout(); } catch (e) {}
    setIsAccountMenuOpen(false);
    navigate('/user-login');
  }; 

  const navigationItems = [
    { label: 'Dashboard', path: '/trip-planning-dashboard', icon: 'LayoutDashboard' },
    { label: 'Visa Lookup', path: '/visa-requirements-lookup', icon: 'Search' },
    { label: 'My Applications', path: '/application-tracking', icon: 'FileText' },
    { label: 'Embassy Finder', path: '/embassy-finder', icon: 'MapPin' }
  ];

  const { notifications, unreadCount, markAllRead, clearAll, markRead } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef?.current && !accountMenuRef?.current?.contains(event?.target)) {
        setIsAccountMenuOpen(false);
      }
      if (notificationRef?.current && !notificationRef?.current?.contains(event?.target)) {
        setIsNotificationOpen(false);
      }
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsAccountMenuOpen(false);
        setIsNotificationOpen(false);
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      window.location.href = `/visa-requirements-lookup?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isActivePath = (path) => location?.pathname === path;

  return (
    <header className="sticky top-0 z-100 bg-card shadow-elevation-2 transition-smooth">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-6">
          <Link to="/trip-planning-dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center transition-smooth group-hover:bg-primary/20">
              <Icon name="Plane" size={24} color="var(--color-primary)" />
            </div>
            <span className="text-xl font-heading font-semibold text-foreground hidden sm:block">VisaTrack</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-smooth ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center mr-2">
            <CurrencySelector />
          </div>
          <div className="hidden md:block relative" ref={searchRef}>
            {!isSearchOpen ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-smooth"
                aria-label="Open search"
              >
                <Icon name="Search" size={20} />
              </button>
            ) : (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  placeholder="Search visa requirements..."
                  className="w-64 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
                  aria-label="Search"
                >
                  <Icon name="Search" size={18} />
                </button>
              </form>
            )}
          </div>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted transition-smooth"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-error text-error-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-4 overflow-hidden z-200">
                <div className="p-3 flex items-center justify-between border-b border-border">
                  <h3 className="font-heading font-semibold text-popover-foreground">Notifications</h3>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); markAllRead(); }} className="text-sm text-muted-foreground hover:text-foreground">Mark all read</button>
                    <button onClick={(e) => { e.stopPropagation(); clearAll(); }} className="text-sm text-error hover:underline">Clear</button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">No notifications</div>
                  ) : (
                    notifications?.map((notification) => (
                      <div
                        key={notification?.id}
                        onClick={() => markRead(notification?.id)}
                        className={`p-4 border-b border-border hover:bg-muted transition-smooth cursor-pointer ${!notification?.read ? 'bg-accent/5' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            notification?.type === 'deadline' ? 'bg-warning/10' :
                            notification?.type === 'document'? 'bg-accent/10' : 'bg-primary/10'
                          }`}>
                            <Icon
                              name={
                                notification?.type === 'deadline' ? 'Clock' :
                                notification?.type === 'document'? 'FileText' : 'Info'
                              }
                              size={16}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-popover-foreground">{notification?.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification?.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-border">
                  <Link to="/notifications" className="w-full text-sm text-primary hover:underline font-medium">View all notifications</Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-smooth"
              aria-label="Account menu"
            >
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
                {user ? user?.name?.split(' ')?.map((n)=>n?.[0])?.slice(0,2).join('') : 'JD'}
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground hidden sm:block" />
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevation-4 overflow-hidden z-200">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-popover-foreground">{user?.name || 'Unnamed User'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email || ''}</p>
                </div>
                <div className="py-2">
                  <button onClick={() => { setIsAccountMenuOpen(false); navigate('/profile'); }} className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center gap-3">
                    <Icon name="User" size={16} />
                    Profile Settings
                  </button>
                  <button onClick={() => { setIsAccountMenuOpen(false); if (location?.pathname === '/profile') { window.dispatchEvent(new CustomEvent('profile-focus', { detail: { focus: 'passports' } })); } else { navigate('/profile', { state: { focus: 'passports' } }); } }} className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center gap-3">
                    <Icon name="FileText" size={16} />
                    Passport Management
                  </button>
                  <button onClick={() => { setIsAccountMenuOpen(false); if (location?.pathname === '/profile') { window.dispatchEvent(new CustomEvent('profile-focus', { detail: { focus: 'preferences' } })); } else { navigate('/profile', { state: { focus: 'preferences' } }); } }} className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center gap-3">
                    <Icon name="Settings" size={16} />
                    Preferences
                  </button>
                </div>
                <div className="border-t border-border py-2">
                  <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted transition-smooth flex items-center gap-3">
                    <Icon name="LogOut" size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-smooth"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="p-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-smooth ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border md:hidden">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                placeholder="Search visa requirements..."
                className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
                aria-label="Search"
              >
                <Icon name="Search" size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;