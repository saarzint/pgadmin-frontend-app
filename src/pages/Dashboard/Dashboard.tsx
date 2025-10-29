import { MetricsSummary, Welcome } from "../../components";

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="w-full px-6">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-6 space-y-6">
                        <Welcome />
                        {/* Add more main content components here */}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-6 space-y-6">
                        <MetricsSummary />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;