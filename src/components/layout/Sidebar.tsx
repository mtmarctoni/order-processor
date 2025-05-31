import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  FileBox,
  Clock,
  Settings,
  CloudIcon,
  ChevronLeft,
  LogOut,
  FileSearch,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isOpen }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        }`
      }
    >
      <div className="mr-3">{icon}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 240 : 72 }}
        className={`fixed top-0 left-0 z-30 h-full bg-white dark:bg-background-dark border-r border-gray-200 dark:border-gray-800 shadow-sm lg:relative lg:z-0 transition-all ${
          isOpen ? 'w-[240px]' : 'w-[72px]'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary-500 text-white mr-3">
                <FileSearch size={18} />
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-semibold text-gray-900 dark:text-white whitespace-nowrap"
                  >
                    DocuSense AI
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 hidden lg:block"
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 0 : 180 }}
              >
                <ChevronLeft size={18} />
              </motion.div>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            <NavItem
              to="/"
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              isOpen={isOpen}
            />
            <NavItem
              to="/upload"
              icon={<Upload size={20} />}
              label="Upload Documents"
              isOpen={isOpen}
            />
            <NavItem
              to="/templates"
              icon={<FileBox size={20} />}
              label="Template Designer"
              isOpen={isOpen}
            />
            <NavItem
              to="/queue"
              icon={<Clock size={20} />}
              label="Processing Queue"
              isOpen={isOpen}
            />
            <NavItem
              to="/drive"
              icon={<CloudIcon size={20} />}
              label="Drive Integration"
              isOpen={isOpen}
            />
            <NavItem
              to="/settings"
              icon={<Settings size={20} />}
              label="Settings"
              isOpen={isOpen}
            />
          </nav>

          <div className="p-2 border-t border-gray-200 dark:border-gray-800">
            <button className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors">
              <LogOut size={20} className="mr-3" />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    Log Out
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;