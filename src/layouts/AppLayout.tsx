import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bot,
  ChartNoAxesCombined,
  ChevronRight,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react';
import { useProfile } from '../features/settings/profile';
import { initials } from '../utils/format';

const primary = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/policies', label: 'Policies', icon: FileText },
  { to: '/claims', label: 'Claims', icon: FileCheck2 },
  { to: '/assistant', label: 'AI Assistant', icon: Bot },
  { to: '/customers', label: 'Customers', icon: UsersRound },
];
const settings = { to: '/settings', label: 'Settings', icon: Settings };
const destinations = [...primary, settings];

export function AppLayout() {
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const current = destinations.find(({ to }) => to === location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const matches = search.trim()
    ? destinations.filter(({ label }) => label.toLowerCase().includes(search.trim().toLowerCase()))
    : [];

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  function openPage(to: string) {
    navigate(to);
    setSearch('');
  }

  return (
    <div className={'app-shell' + (profile.compactTables ? ' compact-tables' : '')}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {menuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside id="sidebar" className={'sidebar' + (menuOpen ? ' sidebar-open' : '')}>
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <div className="brand-mark">
            <ShieldCheck size={23} strokeWidth={2.1} />
          </div>
          <div>
            <strong>
              PolicyMind <span>AI</span>
            </strong>
            <small>Insurance workspace</small>
          </div>
        </Link>
        <button
          type="button"
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        >
          <X size={20} />
        </button>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {primary.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className="nav-link" onClick={() => setMenuOpen(false)}>
              <Icon size={19} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
          <p className="nav-label secondary-label">Preferences</p>
          <NavLink to={settings.to} className="nav-link" onClick={() => setMenuOpen(false)}>
            <Settings size={19} strokeWidth={1.8} />
            Settings
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="workspace-icon">
            <ChartNoAxesCombined size={17} />
          </div>
          <div>
            <strong>Insurance operations</strong>
            <small>PolicyMind workspace</small>
          </div>
        </div>
      </aside>
      <div className="app-frame">
        <header className="topbar">
          <button
            type="button"
            className="icon-button mobile-toggle"
            aria-label="Open navigation"
            aria-controls="sidebar"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{current?.label}</strong>
          </div>
          <form
            className="quick-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              if (matches[0]) openPage(matches[0].to);
            }}
          >
            <Search size={17} aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              aria-label="Search pages"
              placeholder="Search pages…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSearch('');
              }}
            />
            <kbd>Ctrl K</kbd>
            {search.trim() && (
              <div className="search-results">
                {matches.length ? (
                  matches.map(({ to, label }) => (
                    <button key={to} type="button" onClick={() => openPage(to)}>
                      {label}
                    </button>
                  ))
                ) : (
                  <p>No matching pages</p>
                )}
              </div>
            )}
          </form>
          <Link to="/settings" className="profile-link" aria-label="Profile settings">
            <span className="avatar">{initials(profile.name)}</span>
            <span className="profile-name">{profile.name}</span>
          </Link>
        </header>
        <main className="main-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
