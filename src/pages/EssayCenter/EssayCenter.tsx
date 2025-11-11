import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';

interface GeneratedIdea {
  id: string;
  text: string;
}

interface FeedbackItem {
  id: string;
  type: 'strength' | 'improvement' | 'suggestion' | 'insight';
  text: string;
}

interface EssayFeedback {
  overallScore: number;
  items: FeedbackItem[];
}

const EssayCenter = () => {
  const [topic, setTopic] = useState('');
  const [cogins1, setCogins1] = useState('');
  const [cogins2, setCogins2] = useState('');
  const [keyExperience, setKeyExperience] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);

  // Essay Feedback states
  const [essayText, setEssayText] = useState('');
  const [essayType, setEssayType] = useState('');
  const [feedback, setFeedback] = useState<EssayFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const availableTags = ['Leadership', 'Innovation', 'Community', 'Service', 'Creativity', 'Resilience'];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleGenerateIdeas = () => {
    // Simulate AI-generated ideas
    const ideas: GeneratedIdea[] = [
      {
        id: '1',
        text: 'Overcoming challenges in robotics...',
      },
      {
        id: '2',
        text: 'Volunteering at the community center taught new skills...',
      },
    ];
    setGeneratedIdeas(ideas);
  };

  const essayTypes = [
    'Common App Personal Statement',
    'Supplemental Essay',
    'Activities Essay',
    'Why This College',
    'Community Essay',
    'Diversity Essay',
  ];

  const handleAnalyzeEssay = () => {
    setIsAnalyzing(true);

    // Simulate AI analysis with a delay
    setTimeout(() => {
      const mockFeedback: EssayFeedback = {
        overallScore: 85,
        items: [
          {
            id: '1',
            type: 'strength',
            text: 'Strong opening hook that immediately engages the reader with vivid imagery and personal voice.',
          },
          {
            id: '2',
            type: 'strength',
            text: 'Excellent use of specific examples and anecdotes that bring your experiences to life.',
          },
          {
            id: '3',
            type: 'improvement',
            text: 'Consider strengthening the transition between paragraphs 2 and 3 for better flow.',
          },
          {
            id: '4',
            type: 'improvement',
            text: 'The conclusion could be more impactful by explicitly connecting back to your growth journey.',
          },
          {
            id: '5',
            type: 'suggestion',
            text: 'Try varying sentence structure in the third paragraph to create more dynamic rhythm.',
          },
          {
            id: '6',
            type: 'suggestion',
            text: 'Consider adding more reflection on how this experience shaped your future goals.',
          },
          {
            id: '7',
            type: 'insight',
            text: 'Your essay effectively demonstrates resilience and personal growth, key themes admissions officers value.',
          },
          {
            id: '8',
            type: 'insight',
            text: 'The authentic voice throughout makes your essay memorable and distinct from others.',
          },
        ],
      };
      setFeedback(mockFeedback);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getFeedbackIcon = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'strength':
        return <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />;
      case 'improvement':
        return <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />;
      case 'suggestion':
        return <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />;
      case 'insight':
        return <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0" />;
    }
  };

  const getFeedbackLabel = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'strength':
        return 'Strength';
      case 'improvement':
        return 'Area for Improvement';
      case 'suggestion':
        return 'Suggestion';
      case 'insight':
        return 'Insight';
    }
  };

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-darkest mb-1">
            Essay Center
          </h1>
          <p className="text-neutral-gray text-sm md:text-base">
            Brainstorm, write, and perfect your college essays with AI assistance
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Essay Brainstorming */}
          <div className="space-y-6">
            {/* Essay Brainstorming Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                Essay Brainstorming
              </h2>

              {/* Topic/Theme Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Topic/Theme
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter your essay topic or theme"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                />
              </div>

              {/* Cogins Section */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Cogins
                </label>
                <input
                  type="text"
                  value={cogins1}
                  onChange={(e) => setCogins1(e.target.value)}
                  placeholder='e.g., "Failure & Growth", "Robotics Club"'
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 mb-3"
                />
                <input
                  type="text"
                  value={cogins2}
                  onChange={(e) => setCogins2(e.target.value)}
                  placeholder='e.g., "Lost a competition, learned to code, built new robot"'
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                />
              </div>

              {/* Key Experiences/Stories */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Key Experiences/Stories
                </label>
                <textarea
                  value={keyExperience}
                  onChange={(e) => setKeyExperience(e.target.value)}
                  placeholder='e.g., "Lost a competition, learned to code, built new robot"'
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 resize-none"
                />
              </div>

              {/* Tags Selection */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-3">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'bg-primary-light border-primary text-primary-darkest'
                            : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-primary hover:bg-primary-light/50'
                        }`}
                      >
                        <span className="font-medium">{tag}</span>
                        {isSelected && (
                          <X className="w-4 h-4 text-red-500" strokeWidth={2.5} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateIdeas}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Generate Essay Ideas
              </button>
            </div>

            {/* Generated Ideas Section */}
            {generatedIdeas.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                  Generated Ideas
                </h2>
                <ol className="list-decimal list-inside space-y-3">
                  {generatedIdeas.map((idea) => (
                    <li
                      key={idea.id}
                      className="text-gray-700 text-base leading-relaxed pl-2"
                    >
                      {idea.text}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Right Column: Essay Feedback & Analysis */}
          <div className="space-y-6">
            {/* Essay Feedback and Analysis Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                Essay Feedback & Analysis
              </h2>

              {/* Essay Type Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Select Essay Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {essayTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setEssayType(type)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all text-left font-medium ${
                        essayType === type
                          ? 'bg-primary-light border-primary text-primary-darkest'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-primary hover:bg-primary-light/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Essay Text Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Paste Your Essay
                </label>
                <textarea
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Paste your essay here for instant AI-powered feedback and analysis..."
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 resize-none font-mono text-sm"
                />
                <div className="mt-2 text-right text-sm text-gray-500">
                  {essayText.length} characters
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyzeEssay}
                disabled={!essayText.trim() || !essayType || isAnalyzing}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm ${
                  !essayText.trim() || !essayType || isAnalyzing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white hover:shadow-md'
                }`}
              >
                {isAnalyzing ? 'Analyzing Your Essay...' : 'Get Instant Feedback'}
              </button>
            </div>

            {/* Feedback Results Section */}
            {feedback && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Feedback Results
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Overall Score:</span>
                    <span className="text-3xl font-bold text-primary">
                      {feedback.overallScore}
                    </span>
                    <span className="text-gray-500">/100</span>
                  </div>
                </div>

                {/* Feedback Items */}
                <div className="space-y-4">
                  {feedback.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="mt-0.5">{getFeedbackIcon(item.type)}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">
                          {getFeedbackLabel(item.type)}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayCenter;
