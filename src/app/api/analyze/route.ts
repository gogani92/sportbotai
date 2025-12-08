/**
 * API Route: /api/analyze
 * 
 * Endpoint za AI analizu sportskog meča koristeći OpenAI GPT-4.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AnalyzeRequest, AnalyzeResponse, RiskLevel } from '@/types';

// Inicijalizuj OpenAI klijent
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/analyze
 * 
 * Prima podatke o meču i vraća AI analizu.
 */
export async function POST(request: NextRequest) {
  try {
    // Parsiraj request body
    const body: AnalyzeRequest = await request.json();

    // Proveri da li je API ključ konfigurisan
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not configured, using mock response');
      return NextResponse.json(generateMockAnalysis(body));
    }

    // Validacija obaveznih polja
    if (!body.sport || !body.league || !body.teamA || !body.teamB) {
      return NextResponse.json(
        { error: 'Nedostaju obavezna polja: sport, league, teamA, teamB' },
        { status: 400 }
      );
    }

    if (!body.odds || body.odds.home <= 0 || body.odds.away <= 0) {
      return NextResponse.json(
        { error: 'Kvote moraju biti veće od 0' },
        { status: 400 }
      );
    }

    // Kreiraj prompt za OpenAI
    const prompt = `Ti si stručnjak za analizu sportskih događaja. Analiziraj sledeći meč i daj objektivnu procenu.

MEČA:
- Sport: ${body.sport}
- Liga: ${body.league}
- Domaćin: ${body.teamA}
- Gost: ${body.teamB}
- Kvote: 1 (domaćin) = ${body.odds.home}, X (nerešeno) = ${body.odds.draw || 'N/A'}, 2 (gost) = ${body.odds.away}
${body.userPrediction ? `- Korisnikov tip: ${body.userPrediction}` : ''}
${body.stake ? `- Planirani ulog: €${body.stake}` : ''}

ZADATAK:
1. Proceni verovatnoće ishoda (homeWin, draw, awayWin) kao procenat (0-100)
2. Uporedi svoje procene sa implied probability iz kvota
3. Identifikuj da li postoji value (dobra vrednost) u nekoj kvoti
4. Odredi nivo rizika (LOW, MEDIUM, HIGH)
5. Napiši kratak summary analize na srpskom jeziku

VAŽNO:
- Budi objektivan i realan
- Ne garantuj ishode
- Uključi disclaimer o odgovornom klađenju
- Ako ne znaš dovoljno o timovima, koristi kvote kao glavnu indikaciju

Odgovori ISKLJUČIVO u JSON formatu:
{
  "probabilities": {
    "homeWin": <broj 0-100>,
    "draw": <broj 0-100 ili null ako nema nerešenog>,
    "awayWin": <broj 0-100>
  },
  "valueComment": "<komentar o value betovima, na srpskom>",
  "riskLevel": "<LOW|MEDIUM|HIGH>",
  "analysisSummary": "<detaljna analiza na srpskom, 2-3 rečenice>"
}`;

    // Pozovi OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Koristi gpt-4o-mini za brzinu i cenu
      messages: [
        {
          role: 'system',
          content: 'Ti si AI asistent za analizu sportskih događaja. Uvek odgovaraš na srpskom jeziku i vraćaš validan JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parsiraj AI odgovor
    const aiContent = completion.choices[0]?.message?.content || '';
    
    // Izvuci JSON iz odgovora
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to parse AI response:', aiContent);
      return NextResponse.json(generateMockAnalysis(body));
    }

    const aiResponse = JSON.parse(jsonMatch[0]);

    // Validiraj i formatiraj odgovor
    const response: AnalyzeResponse = {
      probabilities: {
        homeWin: Math.min(100, Math.max(0, aiResponse.probabilities?.homeWin || 33)),
        draw: aiResponse.probabilities?.draw ?? null,
        awayWin: Math.min(100, Math.max(0, aiResponse.probabilities?.awayWin || 33)),
      },
      valueComment: aiResponse.valueComment || 'Analiza kvota nije dostupna.',
      riskLevel: validateRiskLevel(aiResponse.riskLevel),
      analysisSummary: aiResponse.analysisSummary || 'Analiza nije dostupna.',
      responsibleGamblingNote:
        'Ova analiza je samo informativna i ne predstavlja finansijski savet. Klađenje nosi rizik gubitka novca. Nikada se ne kladite novcem koji ne možete priuštiti da izgubite. Ako osećate da imate problem sa klađenjem, potražite pomoć na kockfranja.hr ili pozovite 0800 200 233.',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    
    // Ako je OpenAI greška, vrati mock
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', error.message);
    }
    
    return NextResponse.json(
      { error: 'Interna greška servera' },
      { status: 500 }
    );
  }
}

/**
 * Validira risk level string
 */
function validateRiskLevel(level: string): RiskLevel {
  const normalized = level?.toUpperCase?.();
  if (normalized === 'LOW' || normalized === 'MEDIUM' || normalized === 'HIGH') {
    return normalized as RiskLevel;
  }
  return 'MEDIUM';
}

/**
 * Fallback: Generiše mock analizu ako OpenAI nije dostupan
 */
function generateMockAnalysis(data: AnalyzeRequest): AnalyzeResponse {
  const impliedHomeWin = data.odds?.home > 0 ? (1 / data.odds.home) * 100 : 33;
  const impliedDraw = data.odds?.draw > 0 ? (1 / data.odds.draw) * 100 : 33;
  const impliedAwayWin = data.odds?.away > 0 ? (1 / data.odds.away) * 100 : 33;

  const total = impliedHomeWin + impliedDraw + impliedAwayWin;
  const adjustmentFactor = total > 0 ? 100 / total : 1;

  const homeWin = Math.round(impliedHomeWin * adjustmentFactor);
  const draw = data.odds?.draw > 0 ? Math.round(impliedDraw * adjustmentFactor) : null;
  const awayWin = Math.round(impliedAwayWin * adjustmentFactor);

  let riskLevel: RiskLevel = 'MEDIUM';
  const maxOdds = Math.max(data.odds?.home || 2, data.odds?.away || 2);
  if (maxOdds > 3.5) riskLevel = 'HIGH';
  else if (maxOdds < 1.8) riskLevel = 'LOW';

  return {
    probabilities: { homeWin, draw, awayWin },
    valueComment: `Analiza bazirana na kvotama. Margin kladionice: ${(total - 100).toFixed(1)}%.`,
    riskLevel,
    analysisSummary: `Meč ${data.teamA || 'Tim A'} vs ${data.teamB || 'Tim B'}: Domaćin ${homeWin}%, ${draw !== null ? `nerešeno ${draw}%, ` : ''}gost ${awayWin}%.`,
    responsibleGamblingNote:
      'Ova analiza je samo informativna. Klađenje nosi rizik gubitka novca.',
  };
}
