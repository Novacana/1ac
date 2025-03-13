
/**
 * Activity logging utilities for GDPR compliance
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Logs user activity for GDPR compliance
 * @param userId User ID 
 * @param actionType Type of action
 * @param description Description of action
 * @param metadata Optional metadata about the action
 */
export const logGdprActivity = async (
  userId: string, 
  actionType: string, 
  description: string,
  metadata?: Record<string, any>
) => {
  try {
    const payload: Record<string, any> = {
      user_id: userId,
      action_type: actionType,
      description: description
    };
    
    // Add metadata if provided
    if (metadata) {
      payload.metadata = metadata;
    }
    
    await supabase.from('gdpr_logs').insert(payload);
  } catch (error) {
    console.error('Error logging GDPR activity:', error);
  }
};

/**
 * Gets GDPR activity logs for a user
 * @param userId User ID
 * @returns Array of GDPR activity logs
 */
export const getGdprActivityLogs = async (userId: string) => {
  const { data, error } = await supabase
    .from('gdpr_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching GDPR logs:', error);
    return [];
  }
  
  return data || [];
};
