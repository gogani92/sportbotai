/**
 * Test Twitter/X API posting
 * Run with: npx tsx scripts/test-twitter.ts
 */

import crypto from 'crypto';
import { config as loadEnv } from 'dotenv';

// Load .env.local
loadEnv({ path: '.env.local' });

const config = {
  apiKey: process.env.TWITTER_API_KEY!,
  apiSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
};

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  cfg: typeof config
): string {
  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(
      Object.keys(params)
        .sort()
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')
    ),
  ].join('&');

  const signingKey = `${encodeURIComponent(cfg.apiSecret)}&${encodeURIComponent(cfg.accessTokenSecret)}`;
  return crypto.createHmac('sha1', signingKey).update(signatureBaseString).digest('base64');
}

function generateOAuthHeader(method: string, url: string, cfg: typeof config): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: cfg.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: cfg.accessToken,
    oauth_version: '1.0',
  };

  const signature = generateOAuthSignature(method, url, oauthParams, cfg);
  oauthParams.oauth_signature = signature;

  const headerString = Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');

  return `OAuth ${headerString}`;
}

async function testPost() {
  // Check credentials
  if (!config.apiKey || !config.apiSecret || !config.accessToken || !config.accessTokenSecret) {
    console.error('❌ Missing Twitter credentials in environment variables');
    console.log('Required: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET');
    process.exit(1);
  }

  const url = 'https://api.twitter.com/2/tweets';
  const text = `🧠 SportBot AI is live!\n\nTesting automated sports intelligence posting.\n\n${new Date().toISOString()}\n\n#SportBot #AIAnalysis`;
  
  console.log('📤 Posting test tweet...');
  console.log('Text:', text);
  console.log('');
  
  const authHeader = generateOAuthHeader('POST', url, config);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS! Tweet posted!');
      console.log('Tweet ID:', data.data.id);
      console.log('URL: https://twitter.com/i/web/status/' + data.data.id);
    } else {
      console.log('❌ Failed to post tweet');
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testPost();
