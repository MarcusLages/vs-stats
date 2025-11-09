import { Tracker } from "./tracker.js";

/**
 * data: {
 *      
 * }
 */
export class TimeTracker extends Tracker {
    constructor(context) {
        super();
        this.context = context;
        this.sessionStartTime = new Date();
        this.projectStartTime = this.loadProjectStartTime();
        this.weeklyTime = this.loadWeeklyTime();
        this.totalProjectTime = this.loadTotalProjectTime();
        this.lastUpdateTime = new Date();
        this.sessionTime = 0;
        this.projectWeekTime = 0;
    }

    start() {
        this.sessionStartTime = new Date();
        this.lastUpdateTime = new Date();

        // Update times second for testting
        this.updateInterval = setInterval(() => {
            this.updateTimes();
            this._onUpdate.fire(this.emitTimes())
        }, 1000);

        // Initial update
        this.updateTimes();
    }

    static formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }

    updateTimes() {
        const now = new Date();
        const timeDiff = now.getTime() - this.lastUpdateTime.getTime();
        
        this.sessionTime = this.getSessionTime() + timeDiff;
        this.weeklyTime += timeDiff;
        this.totalProjectTime += timeDiff;

        // Update project week time (tracks this week's project time)
        const weekStart = this.getStartOfWeek();
        if (this.projectStartTime > weekStart) {
            this.projectWeekTime = this.totalProjectTime + timeDiff;
        } else {
            this.projectWeekTime = this.weeklyTime + timeDiff;
        }
        
        this.lastUpdateTime = now;
        
        this.saveTimes();
    }

    getSessionTime() {
        return this.sessionTime;
    }

    getWeeklyTime() {
        return this.weeklyTime;
    }

    getTotalProjectTime() {
        return this.totalProjectTime;
    }

    getProjectWeekTime() {
        return this.projectWeekTime;
    }

    getStartOfWeek() {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        // Get sunday
        start.setDate(start.getDate() - start.getDay());
        return start;
    }

    // Storage functions using VS Code's workspaceState for project-specific tracking
    loadProjectStartTime() {
        const stored = this.context.workspaceState.get('projectStartTime');
        if (stored) {
            return new Date(stored);
        } else {
            return new Date();
}    }

    loadWeeklyTime() {
        const stored = this.context.workspaceState.get('weeklyTime');
        const weekStart = this.getStartOfWeek();
        const storedWeekStart = this.context.workspaceState.get('weekStart');

        // Reset weekly time if it's a new week
        if (!storedWeekStart || new Date(storedWeekStart) < weekStart) {
            this.context.workspaceState.update('weekStart', weekStart.toISOString());
            return 0;
        }

        return stored || 0;
    }

    loadTotalProjectTime() {
        const stored = this.context.workspaceState.get('totalProjectTime');
        return stored || 0;
    }

    saveTimes() {
        this.context.workspaceState.update('weeklyTime', this.weeklyTime);
        this.context.workspaceState.update('totalProjectTime', this.totalProjectTime);
        this.context.workspaceState.update('projectStartTime', this.projectStartTime);
    }

    emitTimes() {
        const times = {
            session: TimeTracker.formatTime(this.getSessionTime()),
            weekly: TimeTracker.formatTime(this.getWeeklyTime()),
            total: TimeTracker.formatTime(this.getTotalProjectTime()),
            weekProject: TimeTracker.formatTime(this.getProjectWeekTime())
        };

        // console.log('Time:', times);
        return times;
    }
}