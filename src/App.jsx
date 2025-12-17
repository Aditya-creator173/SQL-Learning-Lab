import React, { useState, useEffect, useRef } from 'react';
import BlockEditor from './BlockEditor';
import ColorBends from './ColorBends';
import PixelCard from './PixelCard';
import GlassSurface from './GlassSurface';
import * as Blockly from 'blockly/core';
import { Play, Database, Wand2, Terminal, ChevronRight, Key, Table, Loader2, Sparkles, Send, LogIn, LogOut, Lock, User, Menu, Settings, FileCode, Box, Moon, Sun, X } from 'lucide-react';
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
  { id: 5, email: 'test5@example.com', username: 'user5', created_at: '2024-05-12 11:30:00', status: 'Inactive' },
];

// Block Definitions
// Block Definitions (Mapped to Blockly Types)
const BLOCKS = [
  // DDL
  {
    id: 'sql_create_table',
    label: 'CREATE TABLE',
    type: 'container',
    category: 'DDL',
    color: 'bg-indigo-500',
    inputs: [
      { id: 'table_name', placeholder: 'table_name', type: 'text' }
    ],
    innerLabel: 'COLUMNS'
  },
  {
    id: 'sql_column',
    label: 'Column',
    type: 'simple',
    category: 'DDL',
    color: 'bg-emerald-500',
    inputs: [
      { id: 'col_name', placeholder: 'col_name', type: 'text' },
      { id: 'col_type', placeholder: 'INTEGER', type: 'text', preLabel: 'Type' }
    ]
  },
  // DML
  {
    id: 'sql_insert',
    label: 'INSERT INTO',
    type: 'container',
    category: 'DML',
    color: 'bg-blue-600',
    inputs: [
      { id: 'table', placeholder: 'table', type: 'text' }
    ],
    innerLabel: 'VALUES'
  },
  {
    id: 'sql_update',
    label: 'UPDATE',
    type: 'container',
    category: 'DML',
    color: 'bg-violet-600',
    inputs: [
      { id: 'table', placeholder: 'table', type: 'text' }
    ],
    innerLabel: 'SET'
  },
  {
    id: 'sql_delete',
    label: 'DELETE FROM',
    type: 'container',
    category: 'DML',
    color: 'bg-rose-600',
    inputs: [
      { id: 'table', placeholder: 'table', type: 'text' }
    ],
    innerLabel: 'WHERE'
  }
];

// Draggable Block Component
function DraggableBlock({ block, onDragStart, isPaletteItem = false, onInputChange }) {
  const isContainer = block.type === 'container';

  // Base classes for both types - REDUCED SIZE and CONSTRAINED
  // Use w-fit so it doesn't stretch. 
  const containerClasses = isPaletteItem ? 'w-fit mx-0' : '';
  const baseClasses = `relative font-bold text-white shadow-sm cursor-grab active:cursor-grabbing text-xs select-none ${isPaletteItem ? 'mb-2 hover:scale-105 transition-transform' : ''}`;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, block)}
      className={`${baseClasses} ${containerClasses}`}
      style={{ zIndex: isPaletteItem ? 1 : 10 }}
    >
      {isContainer ? (
        // C-Block (Container) Rendering e.g., CREATE TABLE
        <div className="flex flex-col">
          {/* Top Bar (Header) - Scale down and fit content */}
          <div className={`${block.color} px-2 py-1.5 rounded-t rounded-br flex items-center gap-2 overflow-hidden whitespace-nowrap`}>
            <span>{block.label}</span>
            {block.inputs && block.inputs.map((input, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={input.placeholder}
                value={block.inputValues?.[input.id] || ''}
                readOnly={isPaletteItem}
                className={`bg-white/20 border-none rounded px-1.5 py-0.5 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/50 min-w-[40px] ${isPaletteItem ? 'cursor-grab pointer-events-none opacity-80' : ''}`}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onInputChange && onInputChange(block.uid, input.id, e.target.value)}
              />
            ))}
          </div>

          {/* Middle Section (The C-Shape interior / Slot) */}
          <div className="flex">
            {/* The Spine - Thinner */}
            <div className={`${block.color} w-3 min-h-[16px] flex items-center justify-center`}>
              <div className="w-0.5 h-3/4 bg-white/20 rounded-full"></div>
            </div>
            {/* The Slot Area */}
            <div className="flex-1 bg-black/10 min-h-[16px] rounded-l m-0.5 inset-shadow flex items-center px-2 text-[10px] text-gray-400 border border-white/5 border-dashed overflow-hidden">
              <span className="opacity-50 tracking-wider font-mono scale-90 origin-left truncate">{block.innerLabel}</span>
            </div>
          </div>

          {/* Bottom Bar (Footer) */}
          <div className={`${block.color} h-3 rounded-b w-full flex items-center px-2`}>
            {/* Removing text for cleaner look or making it tiny */}
          </div>
        </div>
      ) : (
        // Simple Block Rendering e.g., COLUMN - Smaller
        <div
          className={`${block.color} px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md justify-start overflow-hidden whitespace-nowrap`}
          style={{
            clipPath: !isPaletteItem ? 'polygon(0% 0%, 15% 0%, 20% 5px, 30% 5px, 35% 0%, 100% 0%, 100% 100%, 35% 100%, 30% 95%, 20% 95%, 15% 100%, 0% 100%)' : 'none',
            marginTop: !isPaletteItem ? '-2px' : '0',
            marginBottom: !isPaletteItem ? '-2px' : '0'
          }}
        >
          <span>{block.label}</span>
          {block.inputs && block.inputs.map((input, idx) => (
            <div key={idx} className="flex items-center gap-1">
              {input.preLabel && <span className="opacity-80 text-xs font-normal">{input.preLabel}</span>}
              <input
                type="text"
                placeholder={input.placeholder}
                value={block.inputValues?.[input.id] || ''}
                readOnly={isPaletteItem}
                className={`bg-white/20 border-none rounded px-1.5 py-0.5 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/50 min-w-[30px] ${isPaletteItem ? 'cursor-grab pointer-events-none opacity-80' : ''}`}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onInputChange && onInputChange(block.uid, input.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Login Screen Component
function LoginScreen({ onLogin, theme, onSwitchToSignUp }) {
  const colors = THEMES[theme];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        const response = await fetch('http://localhost:8080/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
          onLogin(data);
        } else {
          alert('Login failed: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        // Backend not available - use mock login
        console.log('Backend not available, using mock login');
        onLogin({ username, dbName: username + '_db' });
      }
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#ff3366", "#ff6633", "#ffcc33", "#33ff66", "#33ccff", "#6633ff", "#cc33ff", "#ff33cc"]}
          rotation={30}
          speed={0.3}
          scale={1.2}
          frequency={1.4}
          warpStrength={1.2}
          mouseInfluence={0.8}
          parallax={0.6}
          noise={0.08}
          transparent={false}
        />
      </div>

      {/* Login Form with PixelCard + GlassSurface */}
      <PixelCard variant="blue" className="relative z-10 w-[480px] min-h-[580px]">
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={24}
          brightness={40}
          opacity={0.85}
          blur={14}
          backgroundOpacity={0.15}
          className="w-full h-full"
        >
          <div className="w-full h-full p-10 relative z-10 flex flex-col justify-center">
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

          </div>
        </GlassSurface>
      </PixelCard>
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:8080/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
          setSuccessMessage('Account created successfully! Redirecting to sign in...');
          setTimeout(() => {
            onSignUp();
          }, 2000);
        } else {
          setErrors({ ...errors, form: data.error || 'Registration failed' });
        }
      } catch (error) {
        // Backend not available - proceed with mock signup
        console.log('Backend not available, using mock signup');
        setSuccessMessage('Account created successfully! Redirecting to sign in...');
        setTimeout(() => {
          onSignUp();
        }, 2000);
      }
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#ff3366", "#ff6633", "#ffcc33", "#33ff66", "#33ccff", "#6633ff", "#cc33ff", "#ff33cc"]}
          rotation={30}
          speed={0.3}
          scale={1.2}
          frequency={1.4}
          warpStrength={1.2}
          mouseInfluence={0.8}
          parallax={0.6}
          noise={0.08}
          transparent={false}
        />
      </div>

      {/* Sign Up Form with PixelCard + GlassSurface */}
      <PixelCard variant="pink" className="relative z-10 w-[480px] min-h-[720px]">
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={24}
          brightness={40}
          opacity={0.85}
          blur={14}
          backgroundOpacity={0.15}
          className="w-full h-full"
        >
          <div className="w-full h-full p-10 relative z-10 flex flex-col justify-center">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                SQL Thinking Lab
              </h1>
              <p className="text-sm mt-2" style={{ color: colors.textMuted }}>Create Your Account</p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
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
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Email Address</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
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
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
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
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
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
            <div className="mt-4 text-center">
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
        </GlassSurface>
      </PixelCard>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // {username, dbName}
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [activeMode, setActiveMode] = useState('normal'); // 'normal' | 'block'
  const [isThemeHovered, setIsThemeHovered] = useState(false);
  const [query, setQuery] = useState('SELECT * FROM users WHERE status = "Active" LIMIT 10;');
  const [blockQuery, setBlockQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Welcome to SQL Thinking Lab! I can help you write queries, explain concepts, and optimize your SQL.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Block SQL State
  // Block SQL State
  const [draggedBlockType, setDraggedBlockType] = useState(null);
  const [blocklyWorkspace, setBlocklyWorkspace] = useState(null);

  // Dynamic Database Schema State
  const [databaseSchema, setDatabaseSchema] = useState({});
  const [schemaLoading, setSchemaLoading] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch schema when user logs in or after query execution
  const fetchSchema = async () => {
    if (!user?.dbName) return;
    setSchemaLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/schema?dbName=${user.dbName}`);
      if (response.ok) {
        const schema = await response.json();
        setDatabaseSchema(schema);
      }
    } catch (error) {
      console.error('Failed to fetch schema:', error);
    } finally {
      setSchemaLoading(false);
    }
  };

  // Fetch schema when user changes
  useEffect(() => {
    if (user?.dbName) {
      fetchSchema();
    }
  }, [user?.dbName]);

  const colors = THEMES[theme];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleRunQuery = async () => {
    setIsLoading(true);
    try {
      // Determine which query to use based on active mode
      const queryToExecute = activeMode === 'block' ? blockQuery : query;

      if (!queryToExecute.trim()) {
        setResults([{ Error: 'No query to execute. Write SQL or add blocks.' }]);
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8080/api/sql/raw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: queryToExecute, dbName: user?.dbName || 'new_project' })
      });

      if (response.ok) {
        const json = await response.json();
        // Handle update count (string) vs result set (array)
        if (Array.isArray(json)) {
          setResults(json);
          console.log('✅ Query executed', json);
        } else {
          setResults([{ Result: json }]); // Wrap string message in object for table
        }
      } else {
        const json = await response.json();
        console.error('Query failed:', json.error);
        setResults([{ Error: json.error || 'Query failed' }]);
      }
      // Refresh schema after query (might have created/modified tables)
      fetchSchema();
    } catch (error) {
      console.error(error);
      setResults([{ Error: 'Network Error' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearQuery = () => {
    if (activeMode === 'block') {
      // Clear the Blockly workspace
      if (blocklyWorkspace) {
        blocklyWorkspace.clear();
      }
    } else {
      // Clear the normal SQL editor
      setQuery('');
    }
    setResults(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setQuery('');
    setBlockQuery('');
    setResults(null);
    setChatHistory([
      { role: 'ai', content: 'Welcome to SQL Thinking Lab! I can help you write queries, explain concepts, and optimize your SQL.' }
    ]);
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

  // Drag and Drop Handlers
  const handleDragStart = (e, block) => {
    // Store the ID which corresponds to the Blockly block type
    setDraggedBlockType(block.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedBlockType && blocklyWorkspace) {
      const newBlock = blocklyWorkspace.newBlock(draggedBlockType);
      newBlock.initSvg();
      newBlock.render();

      // Coordinate Conversion Logic
      // 1. Get Injection Div metrics
      const injectionDiv = blocklyWorkspace.getInjectionDiv();
      const relativeX = e.clientX - injectionDiv.getBoundingClientRect().left;
      const relativeY = e.clientY - injectionDiv.getBoundingClientRect().top;

      // 2. Adjust for workspace scroll and zoom
      // The workspace coordinates are relative to the origin, which might be scrolled.
      // Also need to account for scale.
      const metrics = blocklyWorkspace.getMetrics();
      const scale = blocklyWorkspace.scale;

      // Calculate workspace coordinates
      // (pixels relative to div - scrollOffset) / scale
      // Note: Blockly metrics.viewLeft is the scroll offset in workspace units usually, 
      // but let's use the standard way if possible.
      // Actually simpler: 
      // var wsX = relativeX / scale + metrics.viewLeft;
      // var wsY = relativeY / scale + metrics.viewTop;

      // Let's rely on common math for this:
      const x = (relativeX / scale) + metrics.viewLeft;
      const y = (relativeY / scale) + metrics.viewTop;

      newBlock.moveBy(x, y);

      setDraggedBlockType(null);
    }
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
        onLogin={(userData) => { setIsAuthenticated(true); setUser(userData); }}
        theme={theme}
        onSwitchToSignUp={() => setIsSignUpMode(true)}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden font-sans flex" style={{ backgroundColor: colors.bgTertiary, color: colors.text }}>


      <PanelGroup direction="horizontal">
        {/* COLUMN A: Schema Navigator */}
        <Panel defaultSize={15} minSize={10}>
          <div className="h-full flex flex-col" style={{ backgroundColor: colors.bgSecondary, borderRightColor: colors.border, borderRightWidth: '1px' }}>
            {/* Conditional Rendering: Database Schema OR Block Palette */}
            {activeMode === 'normal' ? (
              <>
                <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottomColor: colors.border, borderBottomWidth: '1px' }}>
                  <Database className={`w-5 h-5 ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}`} />
                  <h2 className="font-semibold" style={{ color: colors.text }}>Database Schema</h2>
                </div>

                <div className="flex-1 overflow-auto scrollbar-thin p-4 space-y-4">
                  {schemaLoading ? (
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.textMuted }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading schema...
                    </div>
                  ) : Object.keys(databaseSchema).length === 0 ? (
                    <div className="text-sm" style={{ color: colors.textMuted }}>
                      No tables yet. Create one with SQL!
                    </div>
                  ) : (
                    Object.entries(databaseSchema).map(([tableName, tableData]) => (
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
                    ))
                  )}
                </div>
              </>
            ) : (
              /* Block Palette (Visible only in Block Mode) */
              <div className="flex-1 overflow-auto scrollbar-thin p-4" style={{ backgroundColor: colors.bgSecondary }}>
                {['DDL', 'DML'].map(category => (
                  <div key={category} className="mb-6 last:mb-0">
                    <div className={`px-4 py-2 mb-2 rounded border font-bold text-xs uppercase tracking-widest text-center ${category === 'DML' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                      {category}
                    </div>
                    <div className="space-y-1">
                      {BLOCKS.filter(b => b.category === category).map((block) => (
                        <DraggableBlock
                          key={block.id}
                          block={block}
                          onDragStart={handleDragStart}
                          isPaletteItem={true}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <div className="px-4 py-2 backdrop-blur-sm flex items-center gap-3 relative z-50" style={{ backgroundColor: colors.bgSecondary, borderBottomColor: colors.border, borderBottomWidth: '1px' }}>
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
                  <div className="relative" ref={menuRef}>
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
                          onClick={() => { setActiveMode('normal'); setIsMenuOpen(false); }}
                          className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left text-sm ${activeMode === 'normal' ? 'font-semibold' : ''}`}
                          style={activeMode === 'normal' ? {
                            backgroundColor: 'rgba(88, 101, 242, 0.1)',
                            color: colors.accent,
                            borderLeftWidth: '2px',
                            borderLeftColor: colors.accent
                          } : {
                            color: colors.textSecondary
                          }}
                        >
                          <FileCode className="w-4 h-4" />
                          <span>Normal SQL</span>
                        </button>

                        <button
                          onClick={() => { setActiveMode('block'); setIsMenuOpen(false); }}
                          className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left text-sm ${activeMode === 'block' ? 'font-semibold' : ''}`}
                          style={activeMode === 'block' ? {
                            backgroundColor: 'rgba(88, 101, 242, 0.1)',
                            color: colors.accent,
                            borderLeftWidth: '2px',
                            borderLeftColor: colors.accent
                          } : {
                            color: colors.textSecondary
                          }}
                        >
                          <Box className="w-4 h-4" />
                          <span>Block SQL</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
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
                  </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 p-4 overflow-auto scrollbar-thin" style={{ backgroundColor: colors.bgTertiary }}>
                  <div className="h-full rounded-lg p-4" style={{ backgroundColor: colors.bg, borderColor: colors.border, borderWidth: '1px' }}>
                    <div className="w-full h-full overflow-hidden rounded-lg"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      style={{ display: activeMode === 'block' ? 'flex' : 'none' }}
                    >
                      <BlockEditor
                        onQueryChange={setBlockQuery}
                        onInit={setBlocklyWorkspace}
                      />
                    </div>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className={`w-full h-full bg-transparent font-mono text-sm resize-none outline-none ${theme === 'light' ? 'text-cyan-600 font-semibold' : 'text-cyan-400'}`}
                      placeholder="-- Write your SQL query here..."
                      spellCheck={false}
                      style={{ display: activeMode === 'normal' ? 'block' : 'none' }}
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
                      <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
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
              <div className="flex items-center gap-2">
                {results && (
                  <span className={`px-2 py-1 ${theme === 'light' ? 'bg-cyan-600/10 text-cyan-600 border-cyan-600/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'} text-xs rounded-full border`}>
                    {results.length} rows
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded hover:bg-red-500/10 hover:text-red-500 transition-colors flex items-center gap-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
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
    </div >
  );
}

export default App;
