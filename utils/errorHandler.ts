
export interface NormalizedError {
  message: string;
  code?: string;
  details?: any;
}

export const normalizeError = (error: any): NormalizedError => {
  if (!error) return { message: 'Unknown error occurred' };

  // Supabase/Postgrest Error
  if (error.code && error.message) {
    return {
      message: error.message,
      code: error.code,
      details: error.details
    };
  }

  // Standard Error
  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: String(error) };
};
