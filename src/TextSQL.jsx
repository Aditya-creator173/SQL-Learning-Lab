import React, { useState, useRef, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Database, Table, Plus, Trash2, Eraser, Wand2, Play, Terminal, Menu, Moon, Sun, FileCode, Box, FileText, Loader2, Sparkles, Send, LogOut } from 'lucide-react';

const ACTIONS = [
    { id: 'CREATE_TABLE', label: 'Create Table', icon: Table, color: 'bg-amber-100 text-amber-900 border-amber-200' },
    { id: 'CREATE_DATABASE', label: 'Create Database', icon: Database, color: 'bg-cyan-100 text-cyan-900 border-cyan-200' },
    { id: 'INSERT_VALUES', label: 'Insert Values', icon: Plus, color: 'bg-violet-100 text-violet-900 border-violet-200' },
    { id: 'DELETE_TABLE', label: 'Delete Table', icon: Eraser, color: 'bg-lime-100 text-lime-900 border-lime-200' },
    { id: 'DELETE_DATABASE', label: 'Delete Database', icon: Trash2, color: 'bg-gray-200 text-gray-800 border-gray-300' },
    { id: 'DELETE_VALUES', label: 'Delete Values', icon: Trash2, color: 'bg-orange-100 text-orange-900 border-orange-200' },
];

export default function TextSQL({ theme, colors, onSwitchMode, activeMode, onToggleTheme, user, onLogout }) {
    const [activeAction, setActiveAction] = useState(null);
    const [formData, setFormData] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [generatedSQL, setGeneratedSQL] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        { role: 'ai', content: 'Welcome to SQL Thinking Lab! I can help you write queries, explain concepts, and optimize your SQL.' }
    ]);
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

    const handleActionClick = (actionId) => {
        setActiveAction(actionId);
        setFormData({});
        setGeneratedSQL('');
    };


    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const generateSQL = () => {
        let sql = '';
        switch (activeAction) {
            case 'CREATE_TABLE':
                const tableName = formData.tableName || 'new_table';
                const columns = formData.columns || 'id INT PRIMARY KEY, name VARCHAR(100)';
                sql = `CREATE TABLE ${tableName} (${columns});`;
                break;
            case 'CREATE_DATABASE':
                const dbName = formData.dbName || 'new_database';
                sql = `CREATE DATABASE ${dbName};`;
                break;
            case 'INSERT_VALUES':
                const insertTable = formData.tableName || 'table_name';
                const insertColumns = formData.columns || '';
                const values = formData.values || '';
                if (insertColumns) {
                    sql = `INSERT INTO ${insertTable} (${insertColumns}) VALUES (${values});`;
                } else {
                    sql = `INSERT INTO ${insertTable} VALUES (${values});`;
                }
                break;
            case 'DELETE_TABLE':
                const dropTable = formData.tableName || 'table_name';
                sql = `DROP TABLE ${dropTable};`;
                break;
            case 'DELETE_DATABASE':
                const dropDb = formData.dbName || 'database_name';
                sql = `DROP DATABASE ${dropDb};`;
                break;
            case 'DELETE_VALUES':
                const deleteTable = formData.tableName || 'table_name';
                const whereClause = formData.whereClause || '1=1';
                sql = `DELETE FROM ${deleteTable} WHERE ${whereClause};`;
                break;
            default:
                sql = '';
        }
        return sql;
    };

    const handleRunQuery = async () => {
        const sql = generateSQL();
        if (!sql) {
            setChatHistory(prev => [...prev, { role: 'ai', content: 'Please select an action and fill in the required fields first.' }]);
            return;
        }

        setGeneratedSQL(sql);
        setIsLoading(true);
        setChatHistory(prev => [...prev, { role: 'ai', content: `Executing: ${sql}` }]);

        try {
            const response = await fetch('http://localhost:8080/api/sql/raw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sql: sql, dbName: user?.dbName || 'new_project' })
            });

            if (response.ok) {
                const json = await response.json();
                if (Array.isArray(json)) {
                    setResults(json);
                    setChatHistory(prev => [...prev, { role: 'ai', content: `✅ Query executed successfully! ${json.length} row(s) returned.` }]);
                } else {
                    setResults([{ Result: json }]);
                    setChatHistory(prev => [...prev, { role: 'ai', content: `✅ ${json}` }]);
                }
            } else {
                const json = await response.json();
                setResults([{ Error: json.error || 'Query failed' }]);
                setChatHistory(prev => [...prev, { role: 'ai', content: `❌ Error: ${json.error || 'Query failed'}` }]);
            }
        } catch (error) {
            console.error(error);
            setResults([{ Error: 'Network Error - Backend may not be running' }]);
            setChatHistory(prev => [...prev, { role: 'ai', content: '❌ Network Error - Make sure the backend server is running on port 8080.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        setChatHistory(prev => [
            ...prev,
            { role: 'user', content: chatInput },
            { role: 'ai', content: `I can help you with that! Try selecting an action from the sidebar to construct your SQL query step by step.` }
        ]);
        setChatInput('');
    };

    const handleClear = () => {
        setActiveAction(null);
        setFormData({});
        setGeneratedSQL('');
        setResults(null);
    };

    const renderInputForm = () => {
        switch (activeAction) {
            case 'CREATE_TABLE':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs">1</span>
                            Enter table name:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., users"
                            value={formData.tableName || ''}
                            onChange={(e) => handleInputChange('tableName', e.target.value)}
                        />

                        <h3 className="text-lg font-bold flex items-center gap-2 mt-6" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs">2</span>
                            Define columns:
                        </h3>
                        <textarea
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[80px]"
                            style={{ color: colors.text }}
                            placeholder="e.g., id INT PRIMARY KEY, name VARCHAR(100), email VARCHAR(255)"
                            value={formData.columns || ''}
                            onChange={(e) => handleInputChange('columns', e.target.value)}
                        />
                    </div>
                );
            case 'CREATE_DATABASE':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-cyan-100 text-cyan-600 flex items-center justify-center text-xs">1</span>
                            Enter database name:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., my_shop_db"
                            value={formData.dbName || ''}
                            onChange={(e) => handleInputChange('dbName', e.target.value)}
                        />
                    </div>
                );
            case 'INSERT_VALUES':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-violet-100 text-violet-600 flex items-center justify-center text-xs">1</span>
                            Enter table name:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., users"
                            value={formData.tableName || ''}
                            onChange={(e) => handleInputChange('tableName', e.target.value)}
                        />
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-violet-100 text-violet-600 flex items-center justify-center text-xs">2</span>
                            Column names (optional):
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., name, email, age"
                            value={formData.columns || ''}
                            onChange={(e) => handleInputChange('columns', e.target.value)}
                        />
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-violet-100 text-violet-600 flex items-center justify-center text-xs">3</span>
                            Enter values:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., 'John', 'john@email.com', 25"
                            value={formData.values || ''}
                            onChange={(e) => handleInputChange('values', e.target.value)}
                        />
                    </div>
                );
            case 'DELETE_TABLE':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-lime-100 text-lime-600 flex items-center justify-center text-xs">1</span>
                            Enter table name to delete:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., old_users"
                            value={formData.tableName || ''}
                            onChange={(e) => handleInputChange('tableName', e.target.value)}
                        />
                        <p className="text-sm text-red-400">⚠️ This action will permanently delete the table and all its data.</p>
                    </div>
                );
            case 'DELETE_DATABASE':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-gray-200 text-gray-600 flex items-center justify-center text-xs">1</span>
                            Enter database name to delete:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., old_database"
                            value={formData.dbName || ''}
                            onChange={(e) => handleInputChange('dbName', e.target.value)}
                        />
                        <p className="text-sm text-red-400">⚠️ This action will permanently delete the database and all its tables.</p>
                    </div>
                );
            case 'DELETE_VALUES':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-xs">1</span>
                            Enter table name:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., users"
                            value={formData.tableName || ''}
                            onChange={(e) => handleInputChange('tableName', e.target.value)}
                        />
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
                            <span className="w-6 h-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-xs">2</span>
                            WHERE condition:
                        </h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-black/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            style={{ color: colors.text }}
                            placeholder="e.g., id = 5 OR status = 'inactive'"
                            value={formData.whereClause || ''}
                            onChange={(e) => handleInputChange('whereClause', e.target.value)}
                        />
                        <p className="text-sm text-red-400">⚠️ This will delete all rows matching the WHERE condition.</p>
                    </div>
                );
            default:
                return (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                        <div className="p-4 rounded-full bg-cyan-500/10 mb-2">
                            <Sparkles className="w-8 h-8 text-cyan-500" />
                        </div>
                        <h3 className="text-xl font-bold" style={{ color: colors.text }}>Ready to Build</h3>
                        <p className="max-w-xs text-sm" style={{ color: colors.textMuted }}>Select an action from the left sidebar to start generating SQL queries.</p>
                    </div>
                );
        }
    };

    return (
        <div className="h-full w-full flex flex-col" style={{ backgroundColor: colors.bgTertiary }}>
            <PanelGroup direction="horizontal">
                {/* 1. LEFT PANE: Actions (15%) */}
                <Panel defaultSize={15} minSize={10} style={{ backgroundColor: colors.bgSecondary }}>
                    <div className="h-full p-4 overflow-y-auto space-y-3">
                        <h2 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4" style={{ color: colors.textMuted }}>Actions</h2>
                        {ACTIONS.map((action, idx) => (
                            <button
                                key={action.id}
                                onClick={() => handleActionClick(action.id)}
                                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center gap-3 ${activeAction === action.id
                                    ? 'ring-2 ring-offset-2 ring-offset-transparent ring-cyan-500 scale-[1.02]'
                                    : 'hover:scale-[1.02] opacity-80 hover:opacity-100'
                                    } ${action.color}`}
                            >
                                <span className="font-mono text-xs opacity-50 w-4">{idx + 1}</span>
                                <action.icon className="w-4 h-4" />
                                <span className="font-bold text-sm">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </Panel>

                <PanelResizeHandle className="w-1 hover:bg-cyan-500/50 transition-colors" style={{ backgroundColor: colors.border }} />

                {/* 2. MIDDLE PANE: Inputs + AI (55%) */}
                <Panel defaultSize={55} minSize={30}>
                    <PanelGroup direction="vertical">
                        {/* 2a. Top: Toolbar & Inputs (60%) */}
                        <Panel defaultSize={60} minSize={30}>
                            <div className="h-full flex flex-col" style={{ backgroundColor: colors.bg }}>
                                {/* Toolbar */}
                                <div className="px-4 py-2 backdrop-blur-sm flex items-center gap-3 relative z-50 border-b" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}>
                                    <button
                                        onClick={onToggleTheme}
                                        className="px-3 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-2 hover:opacity-80 hover:scale-110 hover:shadow-md"
                                        style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
                                    >
                                        {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                    </button>

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
                                                    onClick={() => { onSwitchMode('normal'); setIsMenuOpen(false); }}
                                                    className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left text-sm"
                                                    style={{ color: colors.textSecondary }}
                                                >
                                                    <FileCode className="w-4 h-4" />
                                                    <span>Normal SQL</span>
                                                </button>
                                                <button
                                                    onClick={() => { onSwitchMode('block'); setIsMenuOpen(false); }}
                                                    className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left text-sm"
                                                    style={{ color: colors.textSecondary }}
                                                >
                                                    <Box className="w-4 h-4" />
                                                    <span>Block SQL</span>
                                                </button>
                                                <button
                                                    onClick={() => { onSwitchMode('text'); setIsMenuOpen(false); }}
                                                    className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left text-sm font-semibold"
                                                    style={{
                                                        backgroundColor: 'rgba(88, 101, 242, 0.1)',
                                                        color: colors.accent,
                                                        borderLeftWidth: '2px',
                                                        borderLeftColor: colors.accent
                                                    }}
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    <span>Text SQL</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Generated SQL Preview */}
                                    {generatedSQL && (
                                        <div className="flex-1 mx-4 px-3 py-1 rounded bg-black/20 font-mono text-xs truncate" style={{ color: colors.textMuted }}>
                                            {generatedSQL}
                                        </div>
                                    )}

                                    {/* Run and Clear Buttons */}
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
                                            onClick={handleClear}
                                            className="px-3 py-2 rounded-lg transition-all active:scale-95 hover:opacity-80 hover:scale-110 hover:shadow-md"
                                            style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {/* Form Area */}
                                <div className="flex-1 p-8 overflow-y-auto">
                                    <div className="max-w-md mx-auto">
                                        <h2 className="text-2xl font-bold mb-6 pb-4 border-b" style={{ color: colors.text, borderColor: colors.border }}>Configuration</h2>
                                        {renderInputForm()}
                                    </div>
                                </div>
                            </div>
                        </Panel>

                        <PanelResizeHandle className="h-1 hover:bg-orange-500/50 transition-colors" style={{ backgroundColor: colors.border }} />

                        {/* 2b. Bottom: AI Assistant (40%) */}
                        <Panel defaultSize={40} minSize={20} style={{ backgroundColor: colors.bgSecondary }}>
                            <div className="h-full flex flex-col">
                                <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottomColor: colors.border, borderBottomWidth: '1px' }}>
                                    <Wand2 className="w-5 h-5 text-orange-400" />
                                    <h2 className="font-semibold text-orange-500">AI Assistant</h2>
                                </div>
                                <div className="flex-1 overflow-auto scrollbar-thin p-4 space-y-3">
                                    {chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? '' : 'bg-orange-500/10 backdrop-blur-md border border-orange-500/20'}`}
                                                style={msg.role === 'user' ? { backgroundColor: colors.bgTertiary, color: colors.text } : { color: colors.text }}>
                                                {msg.role === 'ai' && <Sparkles className="w-4 h-4 text-orange-400 inline mr-2" />}
                                                <span className="text-sm">{msg.content}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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

                <PanelResizeHandle className="w-1 hover:bg-cyan-500/50 transition-colors" style={{ backgroundColor: colors.border }} />

                {/* 3. RIGHT PANE: Results (30%) */}
                <Panel defaultSize={30} minSize={20} style={{ backgroundColor: colors.bgSecondary }}>
                    <div className="h-full flex flex-col">
                        {/* Header with Logout */}
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
                                    onClick={onLogout}
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
                                                        {String(value)}
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
                                    <p className="text-sm mt-2" style={{ color: colors.textMuted, opacity: 0.7 }}>Select an action and run a query to see results here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}
