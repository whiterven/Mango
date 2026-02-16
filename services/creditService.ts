
const KEY = 'mango_credits';

export interface CreditState {
  total: number;
  used: number;
  history: { date: string, amount: number, action: string }[];
}

const DEFAULT_STATE: CreditState = {
  total: 50, // Starter plan default
  used: 0,
  history: []
};

export const creditService = {
  getState: (): CreditState => {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  },

  deduct: (amount: number, action: string): boolean => {
    const state = creditService.getState();
    if (state.used + amount > state.total) return false;

    state.used += amount;
    state.history.unshift({
      date: new Date().toISOString(),
      amount,
      action
    });
    
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  },

  reset: () => {
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_STATE));
  },

  upgrade: (plan: 'pro' | 'agency') => {
    const state = creditService.getState();
    state.total = plan === 'pro' ? 1000 : 10000;
    localStorage.setItem(KEY, JSON.stringify(state));
  }
};
