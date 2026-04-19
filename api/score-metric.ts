import { groq } from '@ai-sdk/groq';
import { generateText, Output } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;
export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `System Role
 You are an ATS scoring engine.
 Evaluate candidate against JD.
 Today is ${new Date().toString()}.

 Core Task
 1.	Analyze: Silently evaluate the JD for "Must-Haves" vs "Nice-to-Haves."
 2.	Contextualize: Review the Resume. Treat [redacted] as a "Confirmed Entry"—for example, if it says "Worked at [redacted]," acknowledge the professional tenure without penalizing the lack of a company name.
 3.	Reasoning: For each scoring category, provide a brief internal justification.
 4.	Final Output: Provide a strictly structured JSON object following the schema below.
 Scoring Rubric (Scale 0-100)
 • Technical/Functional Alignment: Direct match of tools, methodologies, or specific industry functions.
 • Seniority & Impact: Does the candidate's level of responsibility (Junior, Mid, Senior, Lead) match the JD? Value quantified results (e.g., "Increased X by 20%") over vague descriptions.
 • Educational & Certification Merit: Alignment of academic background or specialized professional certifications.
 Strict Constraints
 • No PII Bias: Do not lower scores because information is [redacted].
 • Markdown Precision: Interpret Markdown syntax (headers, lists, bolding) as indicators of information hierarchy and importance.
 • Output Only JSON: Do not provide any conversational text before or after the JSON block.
 JSON Schema Requirement
 {
 "internal_reasoning": {
 "skills_logic": "string",
 "experience_logic": "string",
 "gap_analysis": "Identify top 2 missing elements."
 },
 "scores": {
 "functional_alignment": number,
 "seniority_impact": number,
 "education_merit": number,
 },
 "fit_status": "Highly Recommended / Proceed to Screen / Backup / Reject"
 }`;

export async function POST(request: Request) {
  const schema = z.object({
    internal_reasoning: z.object({
      skills_logic: z.string(),
      experience_logic: z.string(),
      gap_analysis: z.string(),
    }),
    scores: z.object({
      functional_alignment: z.number(),
      seniority_impact: z.number(),
      education_merit: z.number(),
    }),
    fit_status: z.string(),
  });
  const { resumeMarkdown, jobDescription } = await request.json();

  if (!resumeMarkdown || !jobDescription) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const prompt = `${SYSTEM_PROMPT}

 Input Variables
 • Job Description: ${jobDescription}
 • Resume (Markdown): ${resumeMarkdown}`;

  const { output } = await generateText({
    model: groq('openai/gpt-oss-20b'),
    output: Output.object({
      schema,
    }),
    prompt,
    temperature: 0,
    topP: 1,
  });

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
