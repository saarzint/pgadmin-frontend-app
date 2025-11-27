import React from 'react';
import { Bot, CheckCircle, GraduationCap, Award, FileText, Plane } from 'lucide-react';

interface ActiveAgentsCardProps {
  activeAgents: string[];
}

const ActiveAgentsCard: React.FC<ActiveAgentsCardProps> = ({ activeAgents }) => {
  const getAgentIcon = (agentName: string) => {
    const name = agentName.toLowerCase();
    if (name.includes('university') || name.includes('search')) return GraduationCap;
    if (name.includes('scholarship')) return Award;
    if (name.includes('application') || name.includes('requirements')) return FileText;
    if (name.includes('visa')) return Plane;
    return Bot;
  };

  const getAgentColor = (agentName: string) => {
    const name = agentName.toLowerCase();
    if (name.includes('university') || name.includes('search')) return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
    if (name.includes('scholarship')) return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' };
    if (name.includes('application') || name.includes('requirements')) return { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' };
    if (name.includes('visa')) return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' };
    return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-primary-dark" />
          <h2 className="text-lg font-bold text-primary-darkest">Active Agents</h2>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
          {activeAgents.length} active
        </span>
      </div>

      {activeAgents.length === 0 ? (
        <div className="text-center py-4">
          <Bot size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-gray">No active agents at the moment.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeAgents.map((agent, index) => {
            const Icon = getAgentIcon(agent);
            const colors = getAgentColor(agent);

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${colors.bg} border ${colors.border}`}
              >
                <div className={`p-2 rounded-lg bg-white`}>
                  <Icon size={16} className={colors.text} />
                </div>
                <span className="text-sm font-medium text-primary-darkest flex-1">
                  {agent}
                </span>
                <CheckCircle size={16} className="text-green-500" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveAgentsCard;
