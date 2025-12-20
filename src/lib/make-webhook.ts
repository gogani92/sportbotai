/**
 * Make.com Webhook Client for X/Twitter Posting
 * 
 * Alternative to paid X API subscription - uses Make.com's free tier
 * to post to X via their OAuth integration.
 * 
 * Setup:
 * 1. Create a Make.com account (free tier: 1000 ops/month)
 * 2. Create a new Scenario with:
 *    - Trigger: Webhooks > Custom webhook
 *    - Action: Twitter > Create a Tweet
 * 3. Copy the webhook URL to MAKE_WEBHOOK_URL env var
 */

const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

interface PostToXPayload {
  text: string;
  replyToId?: string;  // For threads
  mediaUrls?: string[];  // Images to attach
}

interface MakeWebhookResponse {
  success: boolean;
  tweetId?: string;
  error?: string;
}

/**
 * Send a tweet via Make.com webhook
 */
export async function postToXViaMake(payload: PostToXPayload): Promise<MakeWebhookResponse> {
  if (!MAKE_WEBHOOK_URL) {
    console.warn('[Make.com] MAKE_WEBHOOK_URL not configured');
    return { success: false, error: 'Webhook URL not configured' };
  }

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'tweet',
        text: payload.text,
        reply_to_id: payload.replyToId,
        media_urls: payload.mediaUrls,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status}`);
    }

    // Make.com returns the result from the X action
    const result = await response.json().catch(() => ({}));
    
    return {
      success: true,
      tweetId: result.tweetId || result.id,
    };
  } catch (error) {
    console.error('[Make.com] Webhook error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Post a thread (multiple tweets) via Make.com
 * Each tweet is sent with a small delay to ensure proper threading
 */
export async function postThreadViaMake(tweets: string[]): Promise<MakeWebhookResponse> {
  if (!MAKE_WEBHOOK_URL) {
    return { success: false, error: 'Webhook URL not configured' };
  }

  try {
    // Send the entire thread to Make.com - let it handle sequencing
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'thread',
        tweets: tweets,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[Make.com] Thread error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Post a scheduled content item (match preview, daily picks, etc.)
 */
export async function postScheduledContent(content: {
  type: 'match_preview' | 'daily_picks' | 'value_alert' | 'tip';
  text: string;
  data?: Record<string, unknown>;
}): Promise<MakeWebhookResponse> {
  if (!MAKE_WEBHOOK_URL) {
    return { success: false, error: 'Webhook URL not configured' };
  }

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'scheduled_post',
        content_type: content.type,
        text: content.text,
        data: content.data,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[Make.com] Scheduled post error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if Make.com integration is configured
 */
export function isMakeConfigured(): boolean {
  return !!MAKE_WEBHOOK_URL;
}
