import React, { useState } from 'react';
import { Play, Database, Wand2, Terminal, ChevronRight, Key, Table, Loader2, Sparkles, Send, LogIn, Lock, User, Menu, Settings, FileCode, Box } from 'lucide-react';

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
  { id: 1, email: 'alice@quantum.dev', username: 'alice_storm', created_at: '2024-01-15 10:30:00', status: 'Active' },
  { id: 2, email: 'bob@cyber.space', username: 'bob_nexus', created_at: '2024-02-20 14:22:00', status: 'Active' },
  { id: 3, email: 'charlie@void.ai', username: 'charlie_flux', created_at: '2024-03-10 09:15:00', status: 'Pending' },
  { id: 4, email: 'diana@matrix.io', username: 'diana_pulse', created_at: '2024-04-05 16:45:00', status: 'Active' },
  { id: 5, email: 'eve@neural.net', username: 'eve_byte', created_at: '2024-05-12 11:30:00', status: 'Inactive' },
];

// Login Screen Component
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      <div className="w-96 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Quantum SQL Lab
          </h1>
          <p className="text-slate-400 text-sm mt-2">Initialize Your Session</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
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

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">Powered by Quantum Storm Technology</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('SELECT * FROM users WHERE status = "Active" LIMIT 10;');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Welcome to Quantum Storm SQL Lab! 🚀 I can help you write queries, explain concepts, and optimize your SQL.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleRunQuery = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setIsLoading(false);
      // Simulate toast notification
      console.log('✅ Query executed in 12ms');
    }, 800);
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

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-300 font-sans flex">
      
      {/* COLUMN A: Schema Navigator */}
      <div className="w-[250px] bg-slate-900/50 backdrop-blur-md border-r border-white/10 flex flex-col">
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <h2 className="font-semibold text-slate-100">Database Schema</h2>
        </div>
        
        <div className="flex-1 overflow-auto scrollbar-thin p-4 space-y-4">
          {Object.entries(MOCK_DATABASE).map(([tableName, tableData]) => (
            <div key={tableName} className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Table className="w-4 h-4" />
                <span className="font-bold font-mono">{tableName}</span>
              </div>
              <div className="pl-6 space-y-1">
                {tableData.columns.map((col) => (
                  <div key={col.name} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    {col.isPrimary && <Key className="w-3 h-3 text-fuchsia-400" />}
                    <span className={col.isPrimary ? 'text-fuchsia-300' : ''}>{col.name}</span>
                    <span className="text-slate-600">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COLUMN B: The Workbench */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top 60%: SQL Editor */}
        <div className="flex-[6] flex flex-col border-b border-white/10">
          {/* Toolbar */}
          <div className="px-4 py-2 bg-slate-900/30 backdrop-blur-sm border-b border-white/10 flex items-center gap-3 relative">
            {/* Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <Menu className="w-4 h-4" />
                Menu
              </button>
              
              {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                  <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors text-left text-sm">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full px-4 py-3 flex items-center gap-3 bg-cyan-500/10 text-cyan-400 transition-colors text-left text-sm border-l-2 border-cyan-400">
                    <FileCode className="w-4 h-4" />
                    <span className="font-semibold">Normal SQL</span>
                  </button>
                  <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors text-left text-sm">
                    <Box className="w-4 h-4" />
                    <span>Block SQL</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleRunQuery}
              disabled={isLoading}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Run Query
            </button>
            <button className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all active:scale-95">
              Clear
            </button>
            <button className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all active:scale-95">
              Format
            </button>
          </div>
          
          {/* Editor Area */}
          <div className="flex-1 p-4 overflow-auto scrollbar-thin bg-slate-950">
            <div className="h-full bg-slate-900/30 rounded-lg border border-white/10 p-4">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-full bg-transparent text-cyan-400 font-mono text-sm resize-none outline-none"
                placeholder="-- Write your SQL query here..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Bottom 40%: AI Copilot */}
        <div className="flex-[4] flex flex-col bg-slate-900/20">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-fuchsia-400" />
            <h2 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
              AI Assistant
            </h2>
          </div>
          
          {/* Chat Body */}
          <div className="flex-1 overflow-auto scrollbar-thin p-4 space-y-3">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-slate-800/70 text-slate-200' 
                    : 'bg-fuchsia-500/10 backdrop-blur-md border border-fuchsia-500/20 text-slate-200'
                }`}>
                  {msg.role === 'ai' && <Sparkles className="w-4 h-4 text-fuchsia-400 inline mr-2" />}
                  <span className="text-sm">{msg.content}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input Bar */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask AI for help..."
                className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-cyan-400/50 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white rounded-lg font-semibold transition-all active:scale-95 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COLUMN C: Data Canvas */}
      <div className="w-[450px] bg-slate-900/30 backdrop-blur-md border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="font-semibold text-slate-100">Query Results</h2>
          </div>
          {results && (
            <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20">
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
              <thead className="sticky top-0 bg-slate-900 border-b border-white/10">
                <tr>
                  {Object.keys(results[0]).map((key) => (
                    <th key={key} className="px-4 py-3 text-left font-semibold text-slate-200 font-mono text-xs uppercase tracking-wide">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {results.map((row, idx) => (
                  <tr key={idx} className="even:bg-white/5 hover:bg-cyan-500/5 transition-colors border-b border-white/5">
                    {Object.values(row).map((value, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 text-slate-300">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <Terminal className="w-16 h-16 text-slate-700 mb-4" />
              <p className="text-slate-500 font-semibold">Ready to Execute</p>
              <p className="text-slate-600 text-sm mt-2">Run a query to see results here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
