
import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCampaignStore } from '../store/CampaignContext';
import { Badge } from '../components/ui/Badge';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';
import { useAuth } from '../hooks/useAuth';
import { creditService } from '../services/creditService';

export const Dashboard: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { campaigns, isLoading } = useCampaignStore();
  const [credits, setCredits] = useState<{total: number, used: number} | null>(null);
  
  const recentCampaigns = campaigns.slice(0, 5);
  const totalAssets = campaigns.reduce((acc, c) => acc + (c.images?.length || 0), 0);
  
  const avgScore = campaigns.length > 0 
    ? Math.round(campaigns.reduce((acc, c) => acc + (c.directorOutput?.creativeStrength?.overall || 0), 0) / campaigns.length)
    : 0;

  useEffect(() => {
      if (user) {
          creditService.getState(user.id).then(setCredits);
      }
  }, [user]);

  // Dynamic insights based on real data
  const insights = [];
  if (campaigns.length > 0) {
      if (avgScore > 80) insights.push({ type: 'positive', text: `Great job! Your campaigns are averaging a high score of ${avgScore}/100.` });
      else if (avgScore < 50) insights.push({ type: 'warning', text: `Your average attention score is ${avgScore}. Try using more contrast in "Creative Controls".` });
      else insights.push({ type: 'tip', text: `Your campaigns are performing steadily at ${avgScore}/100.` });
  } else {
      insights.push({ type: 'tip', text: "Launch your first campaign to unlock AI performance insights." });
  }
  
  // Credit usage bar
  const creditPercent = credits ? Math.min((credits.used / credits.total) * 100, 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Command Center Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-brand-900/20 to-slate-900 border-brand-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all"></div>
          <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-2">Total Campaigns</h4>
          <p className="text-3xl font-black text-white">{campaigns.length}</p>
          <div className="mt-2 text-[10px] text-green-400 flex items-center gap-1">
             <span className="bg-green-900/30 px-1 rounded">Active</span> in Workspace
          </div>
        </Card>

        <Card className="relative overflow-hidden group">
           <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-2">Generated Creatives</h4>
           <p className="text-3xl font-black text-white">{totalAssets}</p>
           <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
               {/* Just a visual bar for asset volume, arbitrarily maxed at 100 for visual */}
               <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${Math.min(totalAssets, 100)}%` }}></div>
           </div>
           <p className="text-[9px] text-slate-500 mt-1">Assets ready for export</p>
        </Card>

        <Card className="relative overflow-hidden group">
           <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-2">Avg. Attention Score</h4>
           <div className="flex items-end gap-2">
               <p className={`text-3xl font-black ${avgScore >= 70 ? 'text-green-400' : avgScore >= 50 ? 'text-brand-400' : 'text-yellow-400'}`}>{avgScore}</p>
               <span className="text-xs text-slate-500 mb-1">/ 100</span>
           </div>
           <div className="mt-2 flex gap-1">
               {[1,2,3,4,5].map(i => (
                   <div key={i} className={`h-1.5 w-full rounded-sm ${avgScore >= i*20 ? 'bg-brand-500' : 'bg-slate-700'}`}></div>
               ))}
           </div>
        </Card>

        <Card className="relative overflow-hidden group bg-slate-800/50 border-slate-700/50">
           <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-2">Credits Remaining</h4>
           <p className="text-3xl font-black text-white">{credits ? credits.total - credits.used : '...'}</p>
           <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
               <div className="bg-white h-full" style={{width: `${100 - creditPercent}%`}}></div>
           </div>
           <Button onClick={() => onNavigate('billing')} size="sm" variant="outline" className="mt-3 w-full text-[10px] h-7">Top Up</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Quick Actions & Activity */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => onNavigate('create')} className="bg-brand-600 hover:bg-brand-500 text-white p-4 rounded-xl text-left transition-all shadow-lg shadow-brand-900/20 group border border-brand-500">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <div className="font-bold text-sm">New Campaign</div>
                    <div className="text-[10px] opacity-80">Start from scratch</div>
                </button>

                <button onClick={() => onNavigate('competitor')} className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl text-left transition-all border border-slate-700 hover:border-slate-600 group">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </div>
                    <div className="font-bold text-sm">Competitor Spy</div>
                    <div className="text-[10px] text-slate-400">Analyze winning ads</div>
                </button>

                <button onClick={() => onNavigate('batch')} className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl text-left transition-all border border-slate-700 hover:border-slate-600 group">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <div className="font-bold text-sm">Batch Create</div>
                    <div className="text-[10px] text-slate-400">Generate bulk assets</div>
                </button>

                <button onClick={() => onNavigate('studio')} className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl text-left transition-all border border-slate-700 hover:border-slate-600 group">
                    <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </div>
                    <div className="font-bold text-sm">Creative Studio</div>
                    <div className="text-[10px] text-slate-400">Edit & Overlay</div>
                </button>
            </div>

            {/* Performance Chart Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <PerformanceChart />
               <RecentActivity />
            </div>

            <Card title="Recent Campaigns">
                {isLoading ? (
                    <div className="py-12 text-center text-slate-500 text-sm">Loading campaigns...</div>
                ) : recentCampaigns.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm border-2 border-dashed border-slate-800 rounded-lg">
                    No active campaigns. Launch your first one now.
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase px-3 py-2 border-b border-slate-800">
                        <div className="col-span-5">Name</div>
                        <div className="col-span-2">Platform</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1"></div>
                    </div>
                    {recentCampaigns.map(c => (
                      <div key={c.id} className="grid grid-cols-12 items-center px-3 py-3 hover:bg-slate-800/30 rounded transition-colors group">
                        <div className="col-span-5 flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${c.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="font-bold text-white text-sm truncate">{c.name}</span>
                        </div>
                        <div className="col-span-2 text-xs text-slate-400">{c.platform}</div>
                        <div className="col-span-2 text-xs text-slate-500 font-mono">{new Date(c.createdAt).toLocaleDateString()}</div>
                        <div className="col-span-2">
                           <Badge color={c.status === 'completed' ? 'green' : 'yellow'}>{c.status}</Badge>
                        </div>
                        <div className="col-span-1 text-right">
                            <button onClick={() => onNavigate('results')} className="text-slate-500 hover:text-white">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </Card>
        </div>

        {/* 3. Insights Sidebar */}
        <div className="space-y-6">
            <Card title="AI Performance Insights" className="border-indigo-500/20 bg-slate-900/50">
                <div className="space-y-4">
                    {insights.map((insight, i) => (
                        <div key={i} className="flex gap-3 items-start p-3 rounded bg-slate-800/50 border border-slate-700/50">
                            <div className="mt-0.5 shrink-0">
                                {insight.type === 'positive' && <span className="text-green-400 text-lg">🚀</span>}
                                {insight.type === 'tip' && <span className="text-yellow-400 text-lg">💡</span>}
                                {insight.type === 'warning' && <span className="text-red-400 text-lg">⚡</span>}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{insight.text}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="bg-gradient-to-br from-purple-900/20 to-slate-900 p-4 rounded-xl border border-purple-500/20">
               <h4 className="text-purple-400 font-bold text-xs uppercase mb-2">Pattern of the Week</h4>
               <p className="text-white font-bold text-sm mb-1">The "Fake UI" Notification</p>
               <p className="text-xs text-slate-400 mb-3">Ads that look like iOS reminders have a 2.4x higher stop rate.</p>
               <Button size="sm" variant="secondary" onClick={() => onNavigate('templates')}>Explore Patterns</Button>
            </div>
        </div>
      </div>
    </div>
  );
};
