import React, { useState } from 'react';
import { Play, Database, Wand2, Terminal, ChevronRight, Key, Table, Loader2, Sparkles, Send, LogIn, Lock, User, Menu, Settings, FileCode, Box, Moon, Sun, X } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

// Discord Color Themes
const THEMES = {
  dark: {
    bg: '#36393f',
    bgSecondary: '#2f3136',
    bgTertiary: '#202225',
    text: '#dcddde',
    textSecondary: '#b9bbbe',
    textMuted: '#72767d',
    accent: '#5865f2',
    border: '#202225',
  },
  light: {
    bg: '#ffffff',
    bgSecondary: '#f2f3f5',
    bgTertiary: '#e3e5e8',
    text: '#2e3338',
    textSecondary: '#4e5058',
    textMuted: '#747f8d',
    accent: '#5865f2',
    border: '#e3e5e8',
  }
};

// Mock Database Schema
const MOCK_DATABASE = {
  users: {
    columns: [
      { name: 'id', type: 'INTEGER', isPrimary: true },
      { name: 'email', type: 'VARCHAR(255)', isPrimary: false },
      { name: 'username', type: 'VARCHAR(100)', isPrimary: false },
      { name: 'created_at', type: 'TIMESTAMP', isPrimary: false },
    ]
  },
  orders: {
    columns: [
      { name: 'id', type: 'INTEGER', isPrimary: true },
      { name: 'user_id', type: 'INTEGER', isPrimary: false },
      { name: 'total', type: 'DECIMAL(10,2)', isPrimary: false },
      { name: 'status', type: 'VARCHAR(50)', isPrimary: false },
      { name: 'order_date', type: 'TIMESTAMP', isPrimary: false },
    ]
  },
  products: {
    columns: [
      { name: 'id', type: 'INTEGER', isPrimary: true },
      { name: 'name', type: 'VARCHAR(200)', isPrimary: false },
      { name: 'price', type: 'DECIMAL(10,2)', isPrimary: false },
      { name: 'stock', type: 'INTEGER', isPrimary: false },
    ]
  }
};

// Mock Query Results
const MOCK_RESULTS = [
  { id: 1, email: 'test1@example.com', username: 'user1', created_at: '2024-01-15 10:30:00', status: 'Active' },
  { id: 2, email: 'test2@example.com', username: 'user2', created_at: '2024-02-20 14:22:00', status: 'Active' },
  { id: 3, email: 'test3@example.com', username: 'user3', created_at: '2024-03-10 09:15:00', status: 'Pending' },
  { id: 4, email: 'test4@example.com', username: 'user4', created_at: '2024-04-05 16:45:00', status: 'Active' },
  { id: 5, email: 'test5@example.com', username: 'user5', created_at: '2024-05-12 11:30:00', status: 'Inactive' },
];

// Login Screen Component
function LoginScreen({ onLogin, theme, onSwitchToSignUp }) {
  const colors = THEMES[theme];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4" style={{ backgroundColor: colors.bgTertiary }}>
      <div className="w-96 backdrop-blur-xl border rounded-2xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500" 
           style={{ backgroundColor: colors.bgSecondary + 'cc', borderColor: colors.border }}>
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            SQL Thinking Lab
          </h1>
          <p className="text-sm mt-2" style={{ color: colors.textMuted }}>Initialize Your Session</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                style={{ backgroundColor: colors.bgTertiary, borderColor: colors.border, color: colors.text }}
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                style={{ backgroundColor: colors.bgTertiary, borderColor: colors.border, color: colors.text }}
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
          >
            <LogIn className="w-5 h-5" />
            Initialize Session
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            New to SQL Thinking Lab?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Create an Account
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-2 text-center">
          <p className="text-xs" style={{ color: colors.textMuted }}>SQL Learning Platform</p>
        </div>
      </div>
    </div>
  );
}

// Sign Up Screen Component
function SignUpScreen({ onSignUp, theme, onSwitchToLogin }) {
  const colors = THEMES[theme];
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Show success message
      setSuccessMessage('Account created successfully! Redirecting to sign in...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onSignUp();
      }, 2000);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4" style={{ backgroundColor: colors.bgTertiary }}>
      <div className="w-96 backdrop-blur-xl border rounded-2xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500" 
           style={{ backgroundColor: colors.bgSecondary + 'cc', borderColor: colors.border }}>
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            SQL Thinking Lab
          </h1>
          <p className="text-sm mt-2" style={{ color: colors.textMuted }}>Create Your Account</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                style={{ 
                  backgroundColor: colors.bgTertiary, 
                  borderColor: errors.username ? '#ef4444' : colors.border, 
                  color: colors.text 
                }}
                placeholder="Choose a username"
              />
            </div>
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                style={{ 
                  backgroundColor: colors.bgTertiary, 
                  borderColor: errors.email ? '#ef4444' : colors.border, 
                  color: colors.text 
                }}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                style={{ 
                  backgroundColor: colors.bgTertiary, 
                  borderColor: errors.password ? '#ef4444' : colors.border, 
                  color: colors.text 
                }}
                placeholder="Create a password"
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                style={{ 
                  backgroundColor: colors.bgTertiary, 
                  borderColor: errors.confirmPassword ? '#ef4444' : colors.border, 
                  color: colors.text 
                }}
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={successMessage !== ''}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <User className="w-5 h-5" />
            Create Account
          </button>

          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center animate-in fade-in">
              <p className="text-green-400 text-sm font-medium">{successMessage}</p>
            </div>
          )}
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              disabled={successMessage !== ''}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-2 text-center">
          <p className="text-xs" style={{ color: colors.textMuted }}>SQL Learning Platform</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isThemeHovered, setIsThemeHovered] = useState(false);
  const [query, setQuery] = useState('SELECT * FROM users WHERE status = "Active" LIMIT 10;');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Welcome to SQL Thinking Lab! I can help you write queries, explain concepts, and optimize your SQL.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const colors = THEMES[theme];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleRunQuery = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setIsLoading(false);
      // Simulate toast notification
      console.log('✅ Query executed in 12ms');
    }, 800);
  };

  const handleClearQuery = () => {
    setQuery('');
    setResults(null);
  };

  const handleFormatQuery = () => {
    // Basic SQL formatting
    const formatted = query
      .replace(/\s+/g, ' ')
      .replace(/SELECT/gi, 'SELECT\n  ')
      .replace(/FROM/gi, '\nFROM\n  ')
      .replace(/WHERE/gi, '\nWHERE\n  ')
      .replace(/ORDER BY/gi, '\nORDER BY\n  ')
      .replace(/GROUP BY/gi, '\nGROUP BY\n  ')
      .replace(/LIMIT/gi, '\nLIMIT ')
      .replace(/JOIN/gi, '\nJOIN\n  ')
      .replace(/INNER JOIN/gi, '\nINNER JOIN\n  ')
      .replace(/LEFT JOIN/gi, '\nLEFT JOIN\n  ')
      .replace(/RIGHT JOIN/gi, '\nRIGHT JOIN\n  ')
      .replace(/AND/gi, '\n  AND')
      .replace(/OR/gi, '\n  OR')
      .trim();
    setQuery(formatted);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newHistory = [
      ...chatHistory,
      { role: 'user', content: chatInput },
      { role: 'ai', content: `I can help with that! Here's a suggestion: Try using JOIN statements to combine data from multiple tables, or use WHERE clauses to filter your results.` }
    ];
    setChatHistory(newHistory);
    setChatInput('');
  };

  // Show login/signup screen if not authenticated
  if (!isAuthenticated) {
    return isSignUpMode ? (
      <SignUpScreen 
        onSignUp={() => setIsSignUpMode(false)} 
        theme={theme}
        onSwitchToLogin={() => setIsSignUpMode(false)}
      />
    ) : (
      <LoginScreen 
        onLogin={() => setIsAuthenticated(true)} 
        theme={theme}
        onSwitchToSignUp={() => setIsSignUpMode(true)}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden font-sans flex" style={{ backgroundColor: colors.bgTertiary, color: colors.text }}>
      
      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsSettingsOpen(false)}>
          <div className="w-96 rounded-lg shadow-2xl p-6" style={{ backgroundColor: colors.bg, borderColor: colors.border, borderWidth: '1px' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded hover:opacity-70 hover:scale-125 transition-all hover:bg-opacity-10" style={{ backgroundColor: colors.bgSecondary }}>
                <X className="w-5 h-5" style={{ color: colors.textMuted }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2" style={{ color: colors.textSecondary }}>Appearance</h3>
                <p className="text-sm mb-2" style={{ color: colors.textMuted }}>Use the moon/sun button in the top-right to toggle between light and dark modes.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2" style={{ color: colors.textSecondary }}>Editor</h3>
                <p className="text-sm" style={{ color: colors.textMuted }}>Drag the dividers to resize panels to your preference.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <PanelGroup direction="horizontal">
        {/* COLUMN A: Schema Navigator */}
        <Panel defaultSize={15} minSize={10}>
          <div className="h-full flex flex-col" style={{ backgroundColor: colors.bgSecondary, borderRightColor: colors.border, borderRightWidth: '1px' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottomColor: colors.border, borderBottomWidth: '1px' }}>
              <Database className={`w-5 h-5 ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}`} />
              <h2 className="font-semibold" style={{ color: colors.text }}>Database Schema</h2>
            </div>
            
            <div className="flex-1 overflow-auto scrollbar-thin p-4 space-y-4">
              {Object.entries(MOCK_DATABASE).map(([tableName, tableData]) => (
                <div key={tableName} className="space-y-2">
                  <div className={`flex items-center gap-2 ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}`}>
                    <Table className="w-4 h-4" />
                    <span className="font-bold font-mono">{tableName}</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {tableData.columns.map((col) => (
                      <div key={col.name} className="flex items-center gap-2 text-xs font-mono" style={{ color: colors.textMuted }}>
                        {col.isPrimary && <Key className="w-3 h-3 text-fuchsia-400" />}
                        <span className={col.isPrimary ? 'text-fuchsia-300' : ''}>{col.name}</span>
                        <span style={{ color: colors.textMuted, opacity: 0.6 }}>{col.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 hover:bg-cyan-500/50 transition-colors cursor-col-resize" style={{ backgroundColor: colors.border }} />

        {/* COLUMN B: The Workbench */}
        <Panel defaultSize={55} minSize={30}>
          <PanelGroup direction="vertical">
            {/* Top: SQL Editor */}
            <Panel defaultSize={60} minSize={30}>
              <div className="h-full flex flex-col" style={{ borderBottomColor: colors.border, borderBottomWidth: '1px' }}>
                {/* Toolbar */}
                <div className="px-4 py-2 backdrop-blur-sm flex items-center gap-3 relative" style={{ backgroundColor: colors.bgSecondary, borderBottomColor: colors.border, borderBottomWidth: '1px' }}>
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    onMouseEnter={() => setIsThemeHovered(true)}
                    onMouseLeave={() => setIsThemeHovered(false)}
                    className="px-3 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-2 hover:opacity-80 hover:scale-110 hover:shadow-md"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
                  >
                    {theme === 'dark' ? (
                      isThemeHovered ? <Moon className="w-4 h-4 fill-current" /> : <Moon className="w-4 h-4" />
                    ) : (
                      <Sun className="w-4 h-4" />
                    )}
                  </button>

                  {/* Menu Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="px-3 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-2 hover:opacity-80 hover:scale-110 hover:shadow-md"
                      style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
                    >
                      <Menu className="w-4 h-4" />
                      Menu
                    </button>
                    
                    {isMenuOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 rounded-lg shadow-xl z-50 overflow-hidden" style={{ backgroundColor: colors.bg, borderColor: colors.border, borderWidth: '1px' }}>
                        <button 
                          onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:opacity-80 hover:bg-opacity-50 transition-all text-left text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left text-sm" style={{ backgroundColor: 'rgba(88, 101, 242, 0.1)', color: colors.accent, borderLeftWidth: '2px', borderLeftColor: colors.accent }}>
                          <FileCode className="w-4 h-4" />
                          <span className="font-semibold">Normal SQL</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRunQuery}
                    disabled={isLoading}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:shadow-lg"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    Run Query
                  </button>
                  <button 
                    onClick={handleClearQuery}
                    className="px-3 py-2 rounded-lg transition-all active:scale-95 hover:opacity-80 hover:scale-110 hover:shadow-md"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
                  >
                    Clear
                  </button>
                  <button 
                    onClick={handleFormatQuery}
                    className="px-3 py-2 rounded-lg transition-all active:scale-95 hover:opacity-80 hover:scale-110 hover:shadow-md"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
                  >
                    Format
                  </button>
                </div>
                
                {/* Editor Area */}
                <div className="flex-1 p-4 overflow-auto scrollbar-thin" style={{ backgroundColor: colors.bgTertiary }}>
                  <div className="h-full rounded-lg p-4" style={{ backgroundColor: colors.bg, borderColor: colors.border, borderWidth: '1px' }}>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className={`w-full h-full bg-transparent font-mono text-sm resize-none outline-none ${theme === 'light' ? 'text-cyan-600 font-semibold' : 'text-cyan-400'}`}
                      placeholder="-- Write your SQL query here..."
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="h-1 hover:bg-cyan-500/50 transition-colors cursor-row-resize" style={{ backgroundColor: colors.border }} />

            {/* Bottom: AI Copilot */}
            <Panel defaultSize={40} minSize={20}>
              <div className="h-full flex flex-col" style={{ backgroundColor: colors.bgSecondary }}>
                {/* Header */}
                <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottomColor: colors.border, borderBottomWidth: '1px' }}>
                  <Wand2 className="w-5 h-5 text-orange-400" />
                  <h2 className="font-semibold text-orange-500">
                    AI Assistant
                  </h2>
                </div>
                
                {/* Chat Body */}
                <div className="flex-1 overflow-auto scrollbar-thin p-4 space-y-3">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user' 
                          ? '' 
                          : 'bg-orange-500/10 backdrop-blur-md border border-orange-500/20'
                      }`} style={msg.role === 'user' ? { backgroundColor: colors.bgTertiary, color: colors.text } : { color: colors.text }}>
                        {msg.role === 'ai' && <Sparkles className="w-4 h-4 text-orange-400 inline mr-2" />}
                        <span className="text-sm">{msg.content}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Input Bar */}
                <div className="p-4" style={{ borderTopColor: colors.border, borderTopWidth: '1px' }}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask AI for help..."
                      className="flex-1 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                      style={{ backgroundColor: colors.bgTertiary, borderColor: colors.border, borderWidth: '1px', color: colors.text }}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all active:scale-95 flex items-center gap-2"
                      >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="w-1 hover:bg-cyan-500/50 transition-colors cursor-col-resize" style={{ backgroundColor: colors.border }} />

        {/* COLUMN C: Data Canvas */}
        <Panel defaultSize={30} minSize={20}>
          <div className="h-full flex flex-col" style={{ backgroundColor: colors.bgSecondary, borderLeftColor: colors.border, borderLeftWidth: '1px' }}>
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottomColor: colors.border, borderBottomWidth: '1px' }}>
              <div className="flex items-center gap-2">
                <Terminal className={`w-5 h-5 ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}`} />
                <h2 className="font-semibold" style={{ color: colors.text }}>Query Results</h2>
              </div>
              {results && (
                <span className={`px-2 py-1 ${theme === 'light' ? 'bg-cyan-600/10 text-cyan-600 border-cyan-600/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'} text-xs rounded-full border`}>
                  {results.length} rows
                </span>
              )}
            </div>
            
            {/* Results Table */}
            <div className="flex-1 overflow-auto scrollbar-thin">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : results ? (
                <table className="w-full text-sm">
                  <thead className="sticky top-0" style={{ backgroundColor: colors.bg, borderBottomColor: colors.border, borderBottomWidth: '1px' }}>
                    <tr>
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="px-4 py-3 text-left font-semibold font-mono text-xs uppercase tracking-wide" style={{ color: colors.text }}>
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs">
                    {results.map((row, idx) => (
                      <tr key={idx} className="hover:opacity-80 transition-colors" style={{ backgroundColor: idx % 2 === 0 ? 'transparent' : colors.bgTertiary + '40', borderBottomColor: colors.border + '40', borderBottomWidth: '1px' }}>
                        {Object.values(row).map((value, colIdx) => (
                          <td key={colIdx} className="px-4 py-3" style={{ color: colors.textSecondary }}>
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <Terminal className="w-16 h-16 mb-4" style={{ color: colors.textMuted, opacity: 0.5 }} />
                  <p className="font-semibold" style={{ color: colors.textMuted }}>Ready to Execute</p>
                  <p className="text-sm mt-2" style={{ color: colors.textMuted, opacity: 0.7 }}>Run a query to see results here</p>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
