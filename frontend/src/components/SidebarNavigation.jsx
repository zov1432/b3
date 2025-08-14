import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Plus, 
  MessageCircle, 
  User, 
  Bell,
  Settings,
  Search,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import CreatePollModal from './CreatePollModal';
import { useAuth } from '../contexts/AuthContext';

const NavigationItem = ({ to, icon: Icon, label, isActive, onClick, isCollapsed }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 group",
          isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/80"
        )}
      >
        <Icon className={cn(
          "w-5 h-5 transition-all duration-300",
          isActive && "text-white"
        )} />
        {!isCollapsed && (
          <span className={cn(
            "text-sm font-medium transition-all duration-300",
            isActive ? "text-white" : "group-hover:text-gray-800"
          )}>
            {label}
          </span>
        )}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 group",
          isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/80"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn(
            "w-5 h-5 transition-all duration-300",
            isActive && "text-white"
          )} />
          {!isCollapsed && (
            <span className={cn(
              "text-sm font-medium transition-all duration-300",
              isActive ? "text-white" : "group-hover:text-gray-800"
            )}>
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

const SidebarNavigation = ({ onCreatePoll }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigationItems = [
    { to: '/feed', icon: Home, label: 'Inicio' },
    { to: '/explore', icon: Compass, label: 'Explorar' },
    { to: '/messages', icon: MessageCircle, label: 'Mensajes' },
    { to: '/notifications', icon: Bell, label: 'Notificaciones' },
    { to: '/profile', icon: User, label: 'Perfil' },
  ];

  const additionalItems = [
    { to: '/trending', icon: TrendingUp, label: 'Tendencias' },
    { to: '/discover', icon: Search, label: 'Descubrir' },
    { to: '/community', icon: Users, label: 'Comunidad' },
    { to: '/settings', icon: Settings, label: 'Configuración' },
  ];

  return (
    <div className={cn(
      "fixed right-0 top-0 h-full bg-white/95 backdrop-blur-lg border-l border-gray-200/50 shadow-2xl z-40 transition-all duration-300",
      isCollapsed ? "w-20" : "w-72"
    )}>
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            {user?.displayName && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                {user?.displayName || 'Usuario'}
              </span>
              <span className="text-xs text-gray-500">
                @{user?.username || 'usuario'}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col p-4 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Create Poll Button */}
        <div className="py-3">
          <CreatePollModal onCreatePoll={onCreatePoll}>
            <button
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300",
                "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg",
                "hover:shadow-xl hover:scale-105 transform"
              )}
            >
              <Plus className="w-5 h-5" />
              {!isCollapsed && (
                <span className="text-sm font-medium">Crear Poll</span>
              )}
            </button>
          </CreatePollModal>
        </div>

        {/* Additional Items */}
        {!isCollapsed && (
          <>
            <div className="border-t border-gray-200/50 pt-3 mt-3">
              <span className="text-xs font-medium text-gray-500 px-4 mb-2 block">
                DESCUBRIR
              </span>
              <div className="space-y-1">
                {additionalItems.map((item) => (
                  <NavigationItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50">
          <div className="text-xs text-gray-500 text-center">
            VotaTok © 2025
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarNavigation;