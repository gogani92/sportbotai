/**
 * Tabs Component
 * 
 * Clean tab navigation for organizing content.
 * Multiple styles: pills, underline, cards.
 */

'use client';

import { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'pills',
  size = 'md',
  fullWidth = false,
  className = '',
}: TabsProps) {
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2',
  };

  const getTabStyles = (isActive: boolean) => {
    const base = `flex items-center font-medium transition-all duration-200 ${sizeStyles[size]}`;
    
    switch (variant) {
      case 'pills':
        return `${base} rounded-lg ${
          isActive 
            ? 'bg-accent text-black' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`;
      case 'underline':
        return `${base} border-b-2 ${
          isActive 
            ? 'border-accent text-white' 
            : 'border-transparent text-gray-400 hover:text-white hover:border-white/20'
        }`;
      case 'cards':
        return `${base} rounded-lg border ${
          isActive 
            ? 'bg-bg-elevated border-accent/50 text-white' 
            : 'bg-transparent border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
        }`;
      default:
        return base;
    }
  };

  const containerStyles = {
    pills: 'bg-white/5 p-1 rounded-xl',
    underline: 'border-b border-white/10',
    cards: 'gap-2',
  };

  return (
    <div className={`flex ${fullWidth ? 'w-full' : 'w-fit'} ${containerStyles[variant]} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${getTabStyles(activeTab === tab.id)} ${fullWidth ? 'flex-1 justify-center' : ''}`}
        >
          {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span className={`
              text-[10px] px-1.5 py-0.5 rounded-full font-bold
              ${activeTab === tab.id 
                ? 'bg-black/20 text-black' 
                : 'bg-white/10 text-gray-400'}
            `}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/**
 * Tab Panel Container
 */
interface TabPanelProps {
  children: ReactNode;
  tabId: string;
  activeTab: string;
  className?: string;
}

export function TabPanel({ children, tabId, activeTab, className = '' }: TabPanelProps) {
  if (tabId !== activeTab) return null;
  
  return (
    <div className={`animate-fadeIn ${className}`}>
      {children}
    </div>
  );
}

/**
 * Controlled Tabs Container
 */
interface TabsContainerProps {
  tabs: Tab[];
  children: ReactNode[];
  defaultTab?: string;
  variant?: 'pills' | 'underline' | 'cards';
  className?: string;
}

export function TabsContainer({
  tabs,
  children,
  defaultTab,
  variant = 'pills',
  className = '',
}: TabsContainerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  return (
    <div className={className}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant={variant}
        className="mb-4"
      />
      {children.map((child, index) => (
        <TabPanel
          key={tabs[index]?.id || index}
          tabId={tabs[index]?.id || ''}
          activeTab={activeTab}
        >
          {child}
        </TabPanel>
      ))}
    </div>
  );
}

/**
 * Toggle Group (radio-style)
 */
interface ToggleOption {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function ToggleGroup({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
}: ToggleGroupProps) {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-3 py-2',
  };

  return (
    <div className={`inline-flex bg-white/5 rounded-lg p-0.5 ${className}`}>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`
            ${sizeStyles[size]}
            flex items-center gap-1.5 rounded-md font-medium
            transition-all duration-200
            ${value === option.id 
              ? 'bg-white text-black' 
              : 'text-gray-400 hover:text-white'}
          `}
        >
          {option.icon && <span className="w-4 h-4">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
}
