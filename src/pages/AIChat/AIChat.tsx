import { useState } from 'react';
import { History as HistoryIcon, MoreVertical, Paperclip, Mic, ChevronDown } from 'lucide-react';
import { colors } from '../../theme/colors';
import { History } from '../../components/AIChat/History';

const AIChat = () => {
    const [message, setMessage] = useState('');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const suggestedQuestions = [
        "How do I start if I haven't picked a university?",
        "How can I make my profile stronger?",
        "Which deadlines matter most?",
        "How should I prepare for interviews?"
    ];

    const handleQuestionClick = (question: string) => {
        setMessage(question);
    };

    return (
        <>
            <div className="h-screen flex flex-col bg-white-50">
                {/* Header */}
                <header className="bg-white px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">AI Chat</h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsHistoryOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 transition-colors"
                            style={{
                                borderRadius: '4px',
                                backgroundColor: colors.primary.gray
                            }}
                        >
                            <HistoryIcon size={20} />
                            <span className="font-medium">History</span>
                        </button>
                        <button className="p-2 transition-colors" style={{
                            borderRadius: '4px',
                            backgroundColor: colors.primary.gray
                        }}>
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </header>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 py-8">
                <div className="max-w-2xl w-full flex flex-col items-center">
                    {/* AI Avatar */}
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-6"></div>

                    {/* Welcome Message */}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        AI Admissions Counselor
                    </h2>
                    <p className="text-gray-600 mb-12 text-center">
                        I'm here to guide you through your admissions journey.
                    </p>

                    {/* Suggested Questions */}
                    <div className="w-full space-y-3">
                        {suggestedQuestions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuestionClick(question)}
                                className="w-full px-6 py-4 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                                style={{
                                    backgroundColor: colors.primary.gray,
                                    borderRadius: '4px'
                                }}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-300 shadow-sm" style={{
                        borderRadius: '4px'
                    }}>
                        {/* Input Field */}
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask your question..."
                            className="w-full px-4 py-3 text-gray-800 placeholder-gray-500 resize-none focus:outline-none rounded-t-xl"
                            rows={1}
                            style={{ minHeight: '60px' }}
                        />

                        {/* Actions Bar */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Paperclip size={20} />
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                    <span className="w-3 h-3 bg-gray-400 rounded-sm"></span>
                                    <span className="text-sm font-medium">Change goal</span>
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Mic size={20} />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <div className="flex gap-0.5">
                                        <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
                                        <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
                                        <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* History Sidebar */}
            <History isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </>
    );
};

export default AIChat;
