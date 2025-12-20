/**
 * Test Twitter posting directly
 */

import crypto from 'crypto';

const config = {
  apiKey: process.env.TWITTER_API_KEY!,
  apiSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
};

console.log('\n🐦 Testing Twitter API...\n');

// Check config
console.log('Config check:');
console.log('  API Key:', config.apiKey ? `${config.apiKey.substring(0, 8)}...` : '❌ MISSING');
console.log('  API Secret:', config.apiSecret ? `${config.apiSecret.substring(0, 8)}...` : '❌ MISSING');
console.log('  Access Token:', config.accessToken ? `${config.accessToken.substring(0, 15)}...` : '❌ MISSING');
console.log('  Access Token Secret:', config.accessTokenSecret ? `${config.accessTokenSecret.substring(0, 8)}...` : '❌ MISSING');

if (!config.apiKey || !config.apiSecret || !config.accessToken || !config.accessTokenSecret) {
  console.error('\n❌ Missing Twitter credentials in .env.local');
  process.exit(1);
}

// OAuth signature function
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>
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

  const signingKey = `${encodeURIComponent(config.apiSecret)}&${encodeURIComponent(config.accessTokenSecret)}`;
  
  return crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');
}

function generateAuthHeader(method: string, url: string): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: config.apiKey,
    oauth_token: config.accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0',
  };

  oauthParams.oauth_signature = generateOAuthSignature(method, url, oauthParams);

  return 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');
}

async function testTweet() {
  const testMessage = `🤖 SportBot AI Test - ${new Date().toLocaleTimeString()} 

Testing automated posting... #SportBot #Test`;

  const url = 'https://api.twitter.com/2/tweets';
  const authHeader = generateAuthHeader('POST', url);

  console.log('\n📝 Posting test tweet...');
  console.log('Content:', testMessage.substring(0, 50) + '...');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: testMessage }),
    });

    const data = await response.json();
    
    console.log('\nResponse status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.data?.id) {
      console.log('\n✅ SUCCESS! Tweet posted:', `https://x.com/i/status/${data.data.id}`);
    } else {
      console.log('\n❌ FAILED:', data.detail || data.title || 'Unknown error');
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error);
  }
}

testTweet();
