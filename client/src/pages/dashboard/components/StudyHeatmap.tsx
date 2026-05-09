import React, { useState } from 'react';
import { useStudyActivity } from '../../../hooks/queries/useCards';
import { ActivityCalendar, type Activity, type ThemeInput } from 'react-activity-calendar';

export default function StudyHeatmap() {
  const { data: activities, isLoading } = useStudyActivity();
  const [tooltip, setTooltip] = useState({ show: false, content: { date: '', countStr: '' }, x: 0, y: 0 });

  if (isLoading) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 h-64 animate-pulse mt-8"></div>
    );
  }

  const getLocalISODate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const activityMap = (activities || []).reduce((acc, curr) => {
    acc[curr.date] = curr.review_count;
    return acc;
  }, {} as Record<string, number>);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const theme: ThemeInput = {
    light: ['#2d2d2d', '#ffebb5', '#ffc86b', '#ff8933', '#e53b27'],
    dark: ['#2d2d2d', '#ffebb5', '#ffc86b', '#ff8933', '#e53b27'],
  };

  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count < 10) return 1;
    if (count < 25) return 2;
    if (count < 50) return 3;
    return 4;
  };

  const currentYear = today.getFullYear();
  const startDate = new Date(currentYear, 0, 1); // Jan 1st
  const endDate = new Date(currentYear, 11, 31); // Dec 31st

  const data: Activity[] = [];
  
  let currentStreak = 0;
  let maxStreak = 0;
  let hasBrokenStreak = false;
  let daysLearned = 0;
  let totalReviews = 0;
  let passedDays = 0;

  // Track backward from today for streak
  const tempDate = new Date(today);
  for (let i = 0; i < 365; i++) {
    const dateStr = getLocalISODate(tempDate);
    const count = activityMap[dateStr] || 0;
    
    if (tempDate.getFullYear() === currentYear) {
      totalReviews += count;
      passedDays++;
      if (count > 0) daysLearned++;
    }

    if (count > 0) {
      if (!hasBrokenStreak) currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      const isToday = tempDate.getTime() === today.getTime();
      if (!isToday) {
        hasBrokenStreak = true;
      }
    }
    tempDate.setDate(tempDate.getDate() - 1);
  }

  // Generate data points for the calendar
  const d = new Date(startDate);
  while (d <= endDate) {
    const dateStr = getLocalISODate(d);
    const count = activityMap[dateStr] || 0;
    
    // For future days in the same year, count is 0
    data.push({
      date: dateStr,
      count,
      level: getLevel(count)
    });
    
    d.setDate(d.getDate() + 1);
  }

  const dailyAverage = daysLearned > 0 ? Math.round(totalReviews / daysLearned) : 0;
  const daysLearnedPercentage = passedDays > 0 ? Math.round((daysLearned / passedDays) * 100) : 0;

  return (
    <div className="border border-neutral-800 rounded-3xl p-6 mt-8 animate-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Study Heatmap</h2>
          <p className="text-sm text-neutral-400">Your daily review contributions ({currentYear})</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-6 custom-scrollbar flex justify-center relative">
        <div className="min-w-max">
          <ActivityCalendar 
            data={data}
            theme={theme}
            colorScheme="dark"
            blockSize={10}
            blockRadius={2}
            blockMargin={3}
            fontSize={12}
            labels={{
              totalCount: `{{count}} reviews in ${currentYear}`,
            }}
            renderBlock={(block, activity) => {
              const isToday = activity.date === getLocalISODate(today);
              const newStyle = isToday ? { ...block.props.style, stroke: '#fff', strokeWidth: 2 } : block.props.style;
              
              const formattedDate = new Date(activity.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
              const countStr = `${activity.count} ${activity.count === 1 ? 'review' : 'reviews'}`;
              
              return React.cloneElement(block as any, {
                onMouseEnter: (e: React.MouseEvent) => {
                  const rect = (e.target as Element).getBoundingClientRect();
                  setTooltip({
                    show: true,
                    content: { date: formattedDate, countStr },
                    x: rect.left + rect.width / 2,
                    y: rect.top
                  });
                },
                onMouseLeave: () => setTooltip(prev => ({ ...prev, show: false })),
                style: { ...newStyle, cursor: 'pointer' }
              });
            }}
          />
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="mt-4 flex flex-wrap justify-center items-center gap-6 text-[13px] font-medium text-[#f5f5f5] pt-4 border-t border-neutral-800">
        <div>
          Daily average: <span className="text-[#ff8933]">{dailyAverage} cards</span>
        </div>
        <div>
          Days learned: <span className="text-[#ff8933]">{daysLearnedPercentage}%</span>
        </div>
        <div>
          Longest streak: <span className="text-[#ff8933]">{maxStreak} days</span>
        </div>
        <div>
          Current streak: <span className="text-[#e53b27]">{currentStreak} days</span>
        </div>
      </div>

      {/*Tooltip */}
      {tooltip.show && (
        <div 
          className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-full pb-2 animate-in fade-in duration-150"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="bg-black text-center px-3 py-2 rounded-lg shadow-xl border border-neutral-700 min-w-[120px]">
            <span className="text-[#9ca3af] text-[11px] block mb-1">{tooltip.content.date}</span>
            <strong className="text-[#ff8933] text-xs">{tooltip.content.countStr}</strong>
          </div>
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[2px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#333]"></div>
        </div>
      )}
    </div>
  );
}
