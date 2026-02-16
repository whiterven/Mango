
export interface AutoGenConfig {
  id: string;
  brandId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  productName: string;
  active: boolean;
  lastRun: number;
}

const KEY = 'mango_autogen';

export const automationService = {
  getConfigs: (): AutoGenConfig[] => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  },

  addConfig: (config: Omit<AutoGenConfig, 'id' | 'lastRun'>) => {
    const configs = automationService.getConfigs();
    configs.push({
      ...config,
      id: crypto.randomUUID(),
      lastRun: 0
    });
    localStorage.setItem(KEY, JSON.stringify(configs));
  },

  toggleConfig: (id: string) => {
    const configs = automationService.getConfigs();
    const target = configs.find(c => c.id === id);
    if (target) {
      target.active = !target.active;
      localStorage.setItem(KEY, JSON.stringify(configs));
    }
  },

  deleteConfig: (id: string) => {
    const configs = automationService.getConfigs().filter(c => c.id !== id);
    localStorage.setItem(KEY, JSON.stringify(configs));
  },

  // Simulate a "run" check (would be server-side in real app)
  checkAndRun: () => {
    const configs = automationService.getConfigs();
    const now = Date.now();
    let ran = 0;

    configs.forEach(c => {
      if (!c.active) return;
      
      const day = 24 * 60 * 60 * 1000;
      let interval = day;
      if (c.frequency === 'weekly') interval = day * 7;
      if (c.frequency === 'monthly') interval = day * 30;

      if (now - c.lastRun > interval) {
        c.lastRun = now;
        ran++;
        // In real app, trigger generation queue here
        console.log(`[Auto] Generated campaign for ${c.productName}`);
      }
    });

    if (ran > 0) localStorage.setItem(KEY, JSON.stringify(configs));
    return ran;
  }
};
