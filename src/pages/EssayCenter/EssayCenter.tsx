import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Lightbulb, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { cerebrasEssayService } from '../../services/api';
import type { EssayFeedbackResponse, GeneratedIdea, EssayFeedbackItem } from '../../services/api/cerebrasEssayService';

const EssayCenter = () => {
  const [topic, setTopic] = useState('');
  const [cogins1, setCogins1] = useState('');
  const [cogins2, setCogins2] = useState('');
  const [keyExperience, setKeyExperience] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [ideaError, setIdeaError] = useState<string | null>(null);

  // Essay Feedback states
  const [essayText, setEssayText] = useState('');
  const [essayType, setEssayType] = useState('');
  const [feedback, setFeedback] = useState<EssayFeedbackResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const availableTags = ['Leadership', 'Innovation', 'Community', 'Service', 'Creativity', 'Resilience'];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true);
    setIdeaError(null);
    setGeneratedIdeas([]);

    try {
      const ideas = await cerebrasEssayService.generateEssayIdeas({
        topic,
        cogins1,
        cogins2,
        keyExperiences: keyExperience,
        tags: selectedTags,
      });
      setGeneratedIdeas(ideas);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate ideas. Please try again.';
      setIdeaError(errorMessage);
      console.error('Error generating ideas:', error);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const essayTypes = [
    'Common App Personal Statement',
    'Supplemental Essay',
    'Activities Essay',
    'Why This College',
    'Community Essay',
    'Diversity Essay',
  ];

  const handleAnalyzeEssay = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setFeedback(null);

    try {
      const result = await cerebrasEssayService.analyzeEssay(essayText, essayType);
      setFeedback(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze essay. Please try again.';
      setAnalysisError(errorMessage);
      console.error('Error analyzing essay:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFeedbackIcon = (type: EssayFeedbackItem['type']) => {
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

  const getFeedbackLabel = (type: EssayFeedbackItem['type']) => {
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

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-primary';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-darkest">
              Essay Center
            </h1>
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-700">Powered by Cerebras AI</span>
            </div>
          </div>
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
                disabled={isGeneratingIdeas || (!topic && !keyExperience)}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${
                  isGeneratingIdeas || (!topic && !keyExperience)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white hover:shadow-md'
                }`}
              >
                {isGeneratingIdeas ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Essay Ideas
                  </>
                )}
              </button>
            </div>

            {/* Error Message for Ideas */}
            {ideaError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Error Generating Ideas</p>
                    <p className="text-red-600 text-sm mt-1">{ideaError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Ideas Section */}
            {generatedIdeas.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Generated Ideas
                  </h2>
                </div>
                <div className="space-y-4">
                  {generatedIdeas.map((idea, index) => (
                    <div
                      key={idea.id}
                      className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 text-base leading-relaxed">
                          {idea.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>{essayText.split(/\s+/).filter(w => w).length} words</span>
                  <span>{essayText.length} characters</span>
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyzeEssay}
                disabled={!essayText.trim() || !essayType || isAnalyzing}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${
                  !essayText.trim() || !essayType || isAnalyzing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white hover:shadow-md'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Your Essay...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Get Instant Feedback
                  </>
                )}
              </button>
            </div>

            {/* Error Message for Analysis */}
            {analysisError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Error Analyzing Essay</p>
                    <p className="text-red-600 text-sm mt-1">{analysisError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Results Section */}
            {feedback && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                      AI Feedback Results
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Score:</span>
                    <span className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                      {feedback.overallScore}
                    </span>
                    <span className="text-gray-500">/100</span>
                  </div>
                </div>

                {/* Score Visualization */}
                <div className="mb-6">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        feedback.overallScore >= 85 ? 'bg-green-500' :
                        feedback.overallScore >= 70 ? 'bg-primary' :
                        feedback.overallScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${feedback.overallScore}%` }}
                    />
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
