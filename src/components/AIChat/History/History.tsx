import { useState } from 'react';
import { X, Search, ChevronDown, MoreVertical } from 'lucide-react';
import { colors } from '../../../theme/colors';

interface HistoryItem {
    id: string;
    title: string;
    timeAgo: string;
    responseCount: number;
}

interface HistoryProps {
    isOpen: boolean;
    onClose: () => void;
}

const History = ({ isOpen, onClose }: HistoryProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBy, setFilterBy] = useState('All chats');
    const [sortBy, setSortBy] = useState('Date');

    // Sample history data
    const historyItems: HistoryItem[] = [
        { id: '1', title: 'Where do I start?', timeAgo: '2h ago', responseCount: 15 },
        { id: '2', title: 'How to improve my profile?', timeAgo: '2h ago', responseCount: 15 },
        { id: '3', title: 'How should I prepare for interviews?', timeAgo: '2h ago', responseCount: 15 },
        { id: '4', title: 'Where do I start?', timeAgo: '2h ago', responseCount: 15 },
        { id: '5', title: 'How should I prepare for interviews?', timeAgo: '2h ago', responseCount: 15 },
        { id: '6', title: 'How to improve my profile?', timeAgo: '2h ago', responseCount: 15 },
        { id: '7', title: 'Where do I start?', timeAgo: '2h ago', responseCount: 15 },
        { id: '8', title: 'How should I prepare for interviews?', timeAgo: '2h ago', responseCount: 15 },
        { id: '9', title: 'How to improve my profile?', timeAgo: '2h ago', responseCount: 15 },
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">History</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4">
                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                            style={{ borderRadius: '4px' }}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="px-6 pb-4 flex items-center justify-between">
                    <button
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 transition-colors"
                        style={{ borderRadius: '4px' }}
                    >
                        <span className="font-medium">{filterBy}</span>
                        <ChevronDown size={16} />
                    </button>
                    <button
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 transition-colors"
                        style={{ borderRadius: '4px' }}
                    >
                        <span className="font-medium">{sortBy}</span>
                        <ChevronDown size={16} />
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-6">
                    <div className="space-y-2">
                        {historyItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                style={{
                                    backgroundColor: colors.primary.gray,
                                    borderRadius: '4px'
                                }}
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 mb-1 truncate">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {item.timeAgo} · {item.responseCount} responses
                                    </p>
                                </div>

                                {/* More Options */}
                                <button className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0">
                                    <MoreVertical size={20} className="text-gray-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default History;
