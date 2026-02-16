
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { schedulerService, ScheduledItem } from '../services/schedulerService';
import { taskService } from '../services/taskService';
import { useCampaignStore } from '../store/CampaignContext';
import { Task } from '../types';

export const Scheduler: React.FC = () => {
  const { campaigns } = useCampaignStore();
  const [scheduled, setScheduled] = useState<ScheduledItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  useEffect(() => {
    setScheduled(schedulerService.getScheduledAds());
    // Only show incomplete tasks on the calendar
    setTasks(taskService.getTasks().filter(t => t.dueDate && !t.completed));
  }, []);

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDayClick = (day: number) => {
      const date = new Date(year, month, day);
      setSelectedDate(date);
  };

  const handleSchedule = () => {
      if (!selectedDate || !selectedCampaignId) return;
      
      const campaign = campaigns.find(c => c.id === selectedCampaignId);
      if (campaign) {
          schedulerService.scheduleCampaign(campaign, selectedDate);
          setScheduled(schedulerService.getScheduledAds());
          setSelectedCampaignId('');
      }
  };

  const handleUnschedule = (id: string) => {
      schedulerService.unschedule(id);
      setScheduled(schedulerService.getScheduledAds());
  };

  const getEventsForDay = (day: number) => {
      // Add Campaigns
      const campaignEvents = scheduled.filter(s => {
          const d = new Date(s.scheduledFor);
          return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
      }).map(c => ({ ...c, type: 'campaign' }));
      
      // Add Tasks
      const taskEvents = tasks.filter(t => {
          if (!t.dueDate) return false;
          const d = new Date(t.dueDate);
          return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
      }).map(t => ({ ...t, type: 'task', name: t.title }));

      return [...campaignEvents, ...taskEvents];
  };

  const isToday = (day: number) => {
      const today = new Date();
      return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
         <div>
            <h2 className="text-xl font-bold text-white">Campaign Scheduler</h2>
            <p className="text-slate-500 text-sm">Plan your content distribution and manage deadlines.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar View */}
          <div className="lg:col-span-2">
              <Card className="h-full border-slate-700/50">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">{monthNames[month]} {year}</h3>
                      <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={handlePrevMonth}>&lt;</Button>
                          <Button variant="secondary" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
                          <Button variant="secondary" size="sm" onClick={handleNextMonth}>&gt;</Button>
                      </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-px bg-slate-800 border border-slate-800 rounded-lg overflow-hidden">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                          <div key={d} className="bg-slate-900 p-2 text-center text-[10px] font-bold text-slate-500 uppercase">
                              {d}
                          </div>
                      ))}
                      
                      {/* Empty slots */}
                      {[...Array(firstDay)].map((_, i) => (
                          <div key={`empty-${i}`} className="bg-slate-900/50 h-24 md:h-32"></div>
                      ))}

                      {/* Days */}
                      {[...Array(daysInMonth)].map((_, i) => {
                          const day = i + 1;
                          const events = getEventsForDay(day);
                          const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month;

                          return (
                              <div 
                                key={day} 
                                onClick={() => handleDayClick(day)}
                                className={`h-24 md:h-32 p-2 relative cursor-pointer transition-colors border-t border-slate-800 ${
                                    isSelected ? 'bg-brand-900/20 shadow-inner' : 'bg-slate-900/30 hover:bg-slate-800'
                                } ${isToday(day) ? 'bg-slate-800/80' : ''}`}
                              >
                                  <span className={`text-xs font-bold ${isToday(day) ? 'text-brand-400' : 'text-slate-400'}`}>
                                      {day}
                                  </span>
                                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-20px)] custom-scrollbar">
                                      {events.map((ev: any) => (
                                          <div 
                                            key={ev.id} 
                                            className={`text-[9px] px-1.5 py-0.5 rounded truncate shadow-sm flex items-center gap-1 ${
                                                ev.type === 'campaign' 
                                                ? 'bg-brand-600 text-white' 
                                                : 'bg-slate-700/80 text-blue-200 border border-blue-500/30'
                                            }`}
                                            title={ev.type === 'campaign' ? `Campaign: ${ev.campaignName}` : `Task: ${ev.title}`}
                                          >
                                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                                  ev.type === 'campaign' ? 'bg-white' : 'bg-blue-400'
                                              }`}></span>
                                              {ev.type === 'campaign' ? ev.campaignName : ev.title}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
                  
                  <div className="flex gap-4 mt-4 text-[10px] text-slate-500 justify-end">
                      <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                          Campaign Launch
                      </div>
                      <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          Task Deadline
                      </div>
                  </div>
              </Card>
          </div>

          {/* Sidebar / Tools */}
          <div className="space-y-6">
              {/* Schedule Action */}
              <Card title="Schedule Ad Launch">
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Date</label>
                          <div className="bg-slate-900 p-2 rounded border border-slate-700 text-white text-sm">
                              {selectedDate ? selectedDate.toLocaleDateString() : 'Click a date on calendar'}
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Campaign</label>
                          <select 
                             className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white"
                             value={selectedCampaignId}
                             onChange={(e) => setSelectedCampaignId(e.target.value)}
                          >
                              <option value="">-- Choose Campaign --</option>
                              {campaigns.map(c => (
                                  <option key={c.id} value={c.id}>{c.name} ({c.platform})</option>
                              ))}
                          </select>
                      </div>

                      <Button 
                         className="w-full" 
                         disabled={!selectedDate || !selectedCampaignId}
                         onClick={handleSchedule}
                      >
                          Schedule Campaign
                      </Button>
                  </div>
              </Card>

              {/* Upcoming List */}
              <Card title="Upcoming Queue">
                 {scheduled.length === 0 ? (
                   <div className="text-center py-6 text-slate-500 text-xs">No active queue.</div>
                 ) : (
                   <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                     {scheduled.filter(item => new Date(item.scheduledFor) >= new Date()).map((item) => (
                       <div key={item.id} className="group flex items-center gap-3 p-2 bg-slate-900/50 rounded border border-slate-700/50 hover:border-slate-600">
                          <div className="flex flex-col items-center bg-slate-800 p-1.5 rounded w-12 shrink-0">
                              <span className="text-[8px] text-brand-400 font-bold uppercase">{new Date(item.scheduledFor).toLocaleString('default', { month: 'short' })}</span>
                              <span className="text-sm font-bold text-white">{new Date(item.scheduledFor).getDate()}</span>
                          </div>
                          <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{item.campaignName}</h4>
                              <p className="text-[9px] text-slate-500">{item.platform}</p>
                          </div>
                          <button 
                             onClick={(e) => { e.stopPropagation(); handleUnschedule(item.id); }}
                             className="ml-auto text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100"
                          >
                              ×
                          </button>
                       </div>
                     ))}
                   </div>
                 )}
              </Card>
          </div>
       </div>
    </div>
  );
};
