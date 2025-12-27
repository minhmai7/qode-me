'use client';

import { useState } from 'react';

export default function ManualImportPage() {
    const [jsonInput, setJsonInput] = useState('');
    const [category, setCategory] = useState('javascript');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const exampleJson = `[
  {
    "questionText": "What is the output of '2' + 2 in JavaScript?",
    "options": [
      { "optionText": "'22'", "isCorrect": true },
      { "optionText": "'4'", "isCorrect": false },
      { "optionText": "'NaN'", "isCorrect": false },
      { "optionText": "'undefined'", "isCorrect": false }
    ],
    "difficulty": "EASY"
  }
]`;

    const handleImport = async () => {
        setLoading(true);
        setResult(null);

        try {
            const questions = JSON.parse(jsonInput);
            
            if (!Array.isArray(questions)) {
                throw new Error('Invalid JSON format: Expected an array of questions.');
            }

            const response = await fetch('/api/admin/import-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions, category }),
            });

            const data = await response.json();
            setResult(data);

            if (data.success) {
                setJsonInput('');
            }
        }
        catch (error) {
            setResult({ error: error instanceof Error ? error.message : 'An unexpected error occurred.' });
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-3">
                        Question Import Center
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Import questions in bulk to expand your quiz database
                    </p>
                </div>
                
                {/* Main Import Form */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 mb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column - Form */}
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Import Configuration
                            </h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-semibold text-slate-200 mb-3">
                                        Target Category
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="react">React</option>
                                        <option value="nodejs">Node.js</option>
                                        <option value="typescript">TypeScript</option>
                                        <option value="css">CSS</option>
                                        <option value="html">HTML</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="jsonInput" className="block text-sm font-semibold text-slate-200 mb-3">
                                        Questions JSON
                                    </label>
                                    <textarea
                                        id="jsonInput"
                                        rows={12}
                                        value={jsonInput}
                                        onChange={(e) => setJsonInput(e.target.value)}
                                        placeholder={exampleJson}
                                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm transition-all resize-none"
                                    />
                                    <div className="mt-2 flex justify-between items-center text-sm text-slate-400">
                                        <span>Paste your JSON questions here</span>
                                        <span className="bg-slate-700 px-2 py-1 rounded text-xs">
                                            {jsonInput.length} characters
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleImport}
                                    disabled={loading || !jsonInput.trim()}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing Import...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            Import Questions
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Format Guide */}
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Format Guide
                            </h2>
                            
                            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-600/50">
                                <h3 className="text-lg font-semibold text-slate-200 mb-4">JSON Structure</h3>
                                <pre className="bg-slate-900/50 p-4 rounded-lg text-sm overflow-x-auto text-slate-300 font-mono border border-slate-600/30">
{exampleJson}
                                </pre>
                            </div>

                            <div className="mt-6 bg-slate-800/30 rounded-xl p-6 border border-slate-600/50">
                                <h3 className="text-lg font-semibold text-slate-200 mb-4">Field Requirements</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded mr-3 mt-0.5 font-mono">title</span>
                                        <div>
                                            <span className="text-slate-200 font-medium">Question Text</span>
                                            <p className="text-slate-400 text-sm">Required - Main question content</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded mr-3 mt-0.5 font-mono">options</span>
                                        <div>
                                            <span className="text-slate-200 font-medium">Answer Options</span>
                                            <p className="text-slate-400 text-sm">2-6 options, exactly 1 correct</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded mr-3 mt-0.5 font-mono">difficulty</span>
                                        <div>
                                            <span className="text-slate-200 font-medium">Difficulty Level</span>
                                            <p className="text-slate-400 text-sm">EASY, MEDIUM, or HARD</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded mr-3 mt-0.5 font-mono">description</span>
                                        <div>
                                            <span className="text-slate-200 font-medium">Description</span>
                                            <p className="text-slate-400 text-sm">Optional - Additional context</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <div className={`bg-white/10 backdrop-blur-md border rounded-2xl p-8 shadow-2xl ${
                        result.error 
                            ? 'border-red-400/50 bg-red-900/20' 
                            : 'border-green-400/50 bg-green-900/20'
                    }`}>
                        <div className="flex items-center mb-6">
                            {result.error ? (
                                <svg className="w-8 h-8 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            <h2 className="text-2xl font-semibold text-white">
                                {result.error ? 'Import Failed' : 'Import Complete'}
                            </h2>
                        </div>
                        
                        {result.error ? (
                            <div className="space-y-4">
                                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                                    <p className="text-red-200 font-medium">{result.error}</p>
                                    {result.details && (
                                        <pre className="mt-3 text-sm bg-red-800/30 p-3 rounded text-red-100 overflow-x-auto">
                                            {JSON.stringify(result.details, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-6 text-center">
                                        <div className="text-3xl font-bold text-green-300 mb-2">{result.imported}</div>
                                        <div className="text-green-200">Successfully Imported</div>
                                    </div>
                                    <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6 text-center">
                                        <div className="text-3xl font-bold text-blue-300 mb-2">{result.total}</div>
                                        <div className="text-blue-200">Total Questions</div>
                                    </div>
                                    <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-6 text-center">
                                        <div className="text-3xl font-bold text-yellow-300 mb-2">{result.failed}</div>
                                        <div className="text-yellow-200">Failed</div>
                                    </div>
                                </div>
                                
                                {result.failed > 0 && result.errors && (
                                    <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                                        <h3 className="text-yellow-200 font-semibold mb-2">Import Errors:</h3>
                                        <ul className="space-y-1">
                                            {result.errors.map((error: string, index: number) => (
                                                <li key={index} className="text-yellow-100 text-sm flex items-start">
                                                    <span className="text-yellow-400 mr-2">•</span>
                                                    {error}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}