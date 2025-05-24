
import { supabase } from '@/integrations/supabase/client';

export type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
  active: boolean;
  source: string | null;
}

/**
 * Get all newsletter subscribers
 */
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching newsletter subscribers:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
}

/**
 * Export subscribers to CSV
 */
export function exportSubscribersToCSV(subscribers: NewsletterSubscriber[]): string {
  const headers = ['Email', 'Subscribed Date', 'Status', 'Source'];
  const rows = subscribers.map(sub => [
    sub.email,
    new Date(sub.subscribed_at).toLocaleDateString(),
    sub.active ? 'Active' : 'Unsubscribed',
    sub.source || 'Website'
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csv;
}

/**
 * Delete a newsletter subscriber
 */
export async function deleteNewsletterSubscriber(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting newsletter subscriber:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting newsletter subscriber:', error);
    return false;
  }
}
