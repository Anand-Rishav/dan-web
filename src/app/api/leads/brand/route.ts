import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabaseClient'
import { Resend } from 'resend'
import { WebClient } from '@slack/web-api'
import { checkLeadRateLimit, getClientIp } from '@/lib/rateLimit'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

const slackToken = process.env.SLACK_BOT_TOKEN
const slackClient = slackToken ? new WebClient(slackToken) : null

// Zod schema for brand lead form
const brandLeadSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  budget: z.string().min(1, 'Budget is required'),
  platforms: z.array(z.string()).min(1, 'At least one platform is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  goal: z.string().min(1, 'Goal is required'),
  interestedCreator: z.string().optional(),
  calendlyUrl: z.string().url('Invalid Calendly URL').optional(),
})

export async function POST(request: Request) {
  try {
    // Spam defense 1/2: per-IP rate limit before doing any work.
    const rl = checkLeadRateLimit(request, 'brand')
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
      )
    }

    const body = await request.json()

    // Spam defense 2/2: honeypot. The field is invisible to humans; if a bot
    // filled it, answer with fake success and store nothing.
    if (typeof body.companyLinkedInUrl === 'string' && body.companyLinkedInUrl.trim() !== '') {
      console.warn('Brand lead honeypot triggered:', getClientIp(request))
      return NextResponse.json({
        success: true,
        message: 'Inquiry received successfully. Our team will reach out within 24 hours.',
        data: { timestamp: new Date().toISOString() }
      }, { status: 201 })
    }

    const validatedData = brandLeadSchema.parse(body)


    // Insert into Supabase when configured. No .select() here on purpose:
    // RLS is insert-only for anon, and PostgREST refuses to return the
    // inserted row without SELECT permission. If Supabase is configured
    // but the insert fails, surface a real error — never fake success.
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { error } = await supabase
        .from('brand_leads')
        .insert([
          {
            company_name: validatedData.companyName,
            contact_name: validatedData.contactName,
            email: validatedData.email,
            phone: validatedData.phone,
            website: validatedData.website || null,
            budget: validatedData.budget,
            platforms: validatedData.platforms,
            timeline: validatedData.timeline,
            goal: validatedData.goal,
            interested_creator: validatedData.interestedCreator || null,
            calendly_url: validatedData.calendlyUrl,
          },
        ])

      if (error) {
        console.error('Supabase brand lead insert failed:', error)
        return NextResponse.json(
          { error: 'Failed to save your inquiry. Please try again in a moment.' },
          { status: 500 }
        )
      }
      console.log('Brand lead saved to Supabase:', validatedData.email)
    }

    // Send confirmation email via Resend if configured
    if (resend) {
      try {
        await resend.emails.send({
          from: 'DAN SERVICES <onboarding@danservices.in>',
          to: validatedData.email,
          subject: 'Thank you for contacting DAN SERVICES',
          html: `
            <h1>Thank you for reaching out!</h1>
            <p>We've received your brand inquiry and our senior talent team will get back to you shortly.</p>
            <p>Here's a summary of what you submitted:</p>
            <ul>
              <li>Company: ${validatedData.companyName}</li>
              <li>Contact: ${validatedData.contactName}</li>
              <li>Email: ${validatedData.email}</li>
              <li>Website: ${validatedData.website || 'Not provided'}</li>
              <li>Budget: ${validatedData.budget}</li>
              <li>Platforms: ${validatedData.platforms.join(', ')}</li>
              <li>Timeline: ${validatedData.timeline}</li>
              <li>Goal: ${validatedData.goal}</li>
              ${validatedData.interestedCreator ? `<li>Interested Creator: ${validatedData.interestedCreator}</li>` : ''}
            </ul>
          `,
        })
      } catch (err) {
        console.warn('Resend send warning:', err)
      }
    }

    // Send Slack notification if configured
    if (slackClient) {
      try {
        await slackClient.chat.postMessage({
          channel: process.env.SLACK_LEADS_CHANNEL || '#leads',
          text: `
            🔥 *New Brand Lead*:
            *Company*: ${validatedData.companyName}
            *Contact*: ${validatedData.contactName}
            *Email*: ${validatedData.email}
            *Website*: ${validatedData.website || 'Not provided'}
            *Budget*: ${validatedData.budget}
            *Platforms*: ${validatedData.platforms.join(', ')}
            *Timeline*: ${validatedData.timeline}
            *Goal*: ${validatedData.goal}
            ${validatedData.interestedCreator ? `*Interested Creator*: ${validatedData.interestedCreator}` : ''}
          `,
        })
      } catch (err) {
        console.warn('Slack message warning:', err)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully. Our team will reach out within 24 hours.',
      data: { ...validatedData, timestamp: new Date().toISOString() }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
