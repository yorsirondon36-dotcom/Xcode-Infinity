import { supabase } from './supabase';

interface DistributeCommissionParams {
  videoViewerId: string;
  videoValue: number;
}

export async function distributeVideoCommissions({
  videoViewerId,
  videoValue,
}: DistributeCommissionParams): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      throw new Error('Supabase configuration not found');
    }

    const apiUrl = `${supabaseUrl}/functions/v1/distribute-video-commissions`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        video_viewer_id: videoViewerId,
        video_value: videoValue,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to distribute commissions');
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error distributing video commissions:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function recordPurchaseCommission(
  buyerId: string,
  levelPrice: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('record_purchase_commission', {
      p_buyer_id: buyerId,
      p_level_price: levelPrice,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error recording purchase commission:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
