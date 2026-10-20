import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabaseClient'
import { Resend } from 'resend'
import { WebClient } from '@slack/web-api'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

const slackToken = process.env.SLACK_BOT_TOKEN
const slackClient = slackToken ? new WebClient(slackToken) : null

// Zod schema for creator application form
const creatorApplicationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  socialLinks: z.object({
    youtube: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional(),
  niche: z.string().min(1, 'Niche is required'),
  mediaKitUrl: z.string().optional(),
  audienceDemographics: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = creatorApplicationSchema.parse(body)

    let dbRecord = null

    // Attempt insertion into Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { data, error } = await supabase
          .from('creator_applications')
          .insert([
            {
              full_name: validatedData.fullName,
              email: validatedData.email,
              phone: validatedData.phone,
              social_links: validatedData.socialLinks ?? {},
              niche: validatedData.niche,
              media_kit_url: validatedData.mediaKitUrl,
              audience_demographics: validatedData.audienceDemographics,
            },
          ])
          .select()

        if (!error && data) {
          dbRecord = data
        }
      } catch (err) {
        console.warn('Supabase creator insert warning:', err)
      }
    }

    // Send confirmation email via Resend if configured
    if (resend) {
      try {
        await resend.emails.send({
          from: 'DAN SERVICES <onboarding@danservices.com>',
          to: validatedData.email,
          subject: 'Welcome to DAN SERVICES Creator Network Application',
          html: `
            <h1>Thank you for applying!</h1>
            <p>We've received your creator application and our talent curation team will review your channels.</p>
            <p>Here's a summary of what you submitted:</p>
            <ul>
              <li>Full Name: ${validatedData.fullName}</li>
              <li>Email: ${validatedData.email}</li>
              <li>Niche: ${validatedData.niche}</li>
              <li>Media Kit: ${validatedData.mediaKitUrl || 'Not provided'}</li>
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
          channel: process.env.SLACK_APPLICATIONS_CHANNEL || '#applications',
          text: `
            🌟 *New Creator Network Application*:
            *Full Name*: ${validatedData.fullName}
            *Email*: ${validatedData.email}
            *Niche*: ${validatedData.niche}
            *Media Kit*: ${validatedData.mediaKitUrl || 'None'}
          `,
        })
      } catch (err) {
        console.warn('Slack message warning:', err)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Application received successfully. Our creator talent team will be in touch.',
      data: dbRecord || { ...validatedData, timestamp: new Date().toISOString() }
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