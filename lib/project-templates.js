import { writeFile, createFolder } from './utils.js';
import path from 'path';

export const applyProjectTemplate = (projectPath, templateName, projectName, framework, options = {}) => {
    const {
        firebaseServices,
        shadcnComponents,
        aiProviders,
        aiFeatures,
        includePayments,
        useShadcnUI,
        cssFramework
    } = options;

    const templates = {
        'ai-saas': createAISaasTemplate,
        'ecommerce': createEcommerceTemplate,
        'social': createSocialMediaTemplate,
        'project-mgmt': createProjectManagementTemplate,
        'learning': createLearningPlatformTemplate,
        'basic': createBasicAppTemplate
    };

    const templateFunction = templates[templateName];
    if (templateFunction) {
        console.log(`🔧 Configuring ${templateName} with real features...`);
        templateFunction(projectPath, projectName, framework, options);
        
        // Generate environment configuration
        createEnvironmentConfig(projectPath, templateName, options);
        
        // Create deployment configuration
        createDeploymentConfig(projectPath, templateName, framework);
        
        console.log(`✅ ${templateName} application generated successfully!`);
        console.log(`\n📖 Next steps:`);
        console.log(`   1. cd ${projectName}`);
        console.log(`   2. npm install`);
        console.log(`   3. Copy .env.example to .env.local and add your API keys`);
        console.log(`   4. npm run dev`);
        console.log(`   5. Deploy to Vercel with: npx vercel`);
    }
};

// AI SaaS Platform - Complete content generation platform with OpenAI integration
const createAISaasTemplate = (projectPath, projectName, framework, options) => {
    const { aiProviders, aiFeatures, includePayments, useShadcnUI } = options;
    
    // Create folder structure
    const srcPath = path.join(projectPath, "src");
    const foldersToCreate = [
        "components/ai",
        "components/dashboard", 
        "components/billing",
        "app/dashboard",
        "app/api/ai",
        "app/api/billing",
        "lib/ai",
        "lib/stripe",
        "lib/supabase",
        "types",
        "hooks",
        "utils"
    ];

    foldersToCreate.forEach(folder => {
        createFolder(path.join(srcPath, folder));
    });

    // Generate core AI SaaS components
    createSupabaseConfig(projectPath);
    createAIProviderConfig(projectPath, aiProviders);
    
    if (includePayments) {
        createStripeConfig(projectPath);
        createBillingComponents(projectPath, useShadcnUI);
    }
    
    createAIComponents(projectPath, aiFeatures, useShadcnUI);
    createDashboardComponents(projectPath, useShadcnUI);
    createAPIRoutes(projectPath, aiProviders, includePayments);
    createDatabaseSchema(projectPath);
    createAuthComponents(projectPath, useShadcnUI);
    
    console.log(`🤖 AI SaaS Platform configured with:`);
    console.log(`   • AI Providers: ${aiProviders?.join(', ') || 'OpenAI'}`);
    console.log(`   • Features: ${aiFeatures?.join(', ') || 'Text generation, Chat'}`);
    if (includePayments) console.log(`   • Stripe billing integration`);
    console.log(`   • User authentication & workspaces`);
    console.log(`   • Usage tracking & analytics`);
};

// Supabase configuration
const createSupabaseConfig = (projectPath) => {
    const configContent = `import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_status: 'free' | 'pro' | 'enterprise'
          usage_count: number
          usage_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: 'free' | 'pro' | 'enterprise'
          usage_count?: number
          usage_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: 'free' | 'pro' | 'enterprise'
          usage_count?: number
          usage_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          type: 'text' | 'image' | 'code'
          prompt: string
          result: string
          tokens_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'text' | 'image' | 'code'
          prompt: string
          result: string
          tokens_used: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'text' | 'image' | 'code'
          prompt?: string
          result?: string
          tokens_used?: number
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Generation = Database['public']['Tables']['generations']['Row']
`;

    writeFile(path.join(projectPath, "src", "lib", "supabase", "client.ts"), configContent);
};

// AI Provider configuration
const createAIProviderConfig = (projectPath, providers = ['openai']) => {
    const configContent = `import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

// OpenAI Configuration
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Anthropic Configuration  
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// AI Provider Types
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'groq'

export interface AIRequest {
  provider: AIProvider
  model: string
  prompt: string
  maxTokens?: number
  temperature?: number
}

export interface AIResponse {
  text: string
  tokensUsed: number
  provider: AIProvider
  model: string
}

// Generate text using specified AI provider
export async function generateText(request: AIRequest): Promise<AIResponse> {
  try {
    switch (request.provider) {
      case 'openai':
        const openaiResponse = await openai.chat.completions.create({
          model: request.model || 'gpt-4',
          messages: [{ role: 'user', content: request.prompt }],
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature || 0.7,
        })
        
        return {
          text: openaiResponse.choices[0]?.message?.content || '',
          tokensUsed: openaiResponse.usage?.total_tokens || 0,
          provider: 'openai',
          model: request.model || 'gpt-4'
        }

      case 'anthropic':
        const anthropicResponse = await anthropic.messages.create({
          model: request.model || 'claude-3-sonnet-20240229',
          max_tokens: request.maxTokens || 1000,
          messages: [{ role: 'user', content: request.prompt }],
        })
        
        const text = anthropicResponse.content[0]?.type === 'text' ? anthropicResponse.content[0].text : ''
        
        return {
          text,
          tokensUsed: anthropicResponse.usage?.input_tokens + anthropicResponse.usage?.output_tokens || 0,
          provider: 'anthropic',
          model: request.model || 'claude-3-sonnet-20240229'
        }

      default:
        throw new Error(\`Provider \${request.provider} not supported\`)
    }
  } catch (error) {
    console.error('AI Generation Error:', error)
    throw error
  }
}

// Available models by provider
export const AI_MODELS = {
  openai: [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
  ],
  anthropic: [
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast responses' },
  ],
}
`;

    writeFile(path.join(projectPath, "src", "lib", "ai", "providers.ts"), configContent);
};

// Stripe configuration for billing
const createStripeConfig = (projectPath) => {
    const configContent = `import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 10,
    features: ['10 AI generations per month', 'Basic support'],
  },
  pro: {
    name: 'Pro',
    price: 29,
    credits: 1000,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: ['1,000 AI generations per month', 'Priority support', 'All AI models'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    credits: 5000,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: ['5,000 AI generations per month', 'Priority support', 'Custom AI models', 'API access'],
  },
}

export async function createCheckoutSession(
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'required',
    customer_creation: 'always',
    metadata: {
      userId,
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}
`;

    writeFile(path.join(projectPath, "src", "lib", "stripe", "config.ts"), configContent);
};

// Main AI Chat Component
const createAIComponents = (projectPath, features = ['text-generation'], useShadcnUI) => {
    const chatComponentContent = `'use client'

import { useState } from 'react'
import { generateText } from '@/lib/ai/providers'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
${useShadcnUI ? `import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'` : ''}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [provider, setProvider] = useState<'openai' | 'anthropic'>('openai')
  const [model, setModel] = useState('gpt-4')

  const handleSend = async () => {
    if (!input.trim() || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsGenerating(true)

    try {
      // Generate AI response
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          model,
          prompt: input,
          userId: user.id
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant', 
          content: data.text,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])

        // Save to database
        await supabase.from('generations').insert({
          user_id: user.id,
          type: 'text',
          prompt: input,
          result: data.text,
          tokens_used: data.tokensUsed
        })

        // Update user usage
        await supabase
          .from('profiles')
          .update({ usage_count: (user.usage_count || 0) + 1 })
          .eq('id', user.id)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Generation error:', error)
      // Show error message
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      ${useShadcnUI ? `
      <Card>
        <CardHeader>
          <CardTitle>AI Chat Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {provider === 'openai' && (
                  <>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </>
                )}
                {provider === 'anthropic' && (
                  <>
                    <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-[400px] border rounded-lg p-4 space-y-4 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground">
                Start a conversation with AI...
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={\`flex \${message.role === 'user' ? 'justify-end' : 'justify-start'}\`}
              >
                <div
                  className={\`max-w-[80%] rounded-lg p-3 \${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }\`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              className="flex-1"
              rows={3}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isGenerating}
              className="self-end"
            >
              {isGenerating ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </CardContent>
      </Card>` : `
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-2xl font-bold mb-6">AI Chat Assistant</h2>
        
        <div className="flex gap-4 mb-4">
          <select 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </select>

          <select 
            value={model} 
            onChange={(e) => setModel(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {provider === 'openai' && (
              <>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </>
            )}
            {provider === 'anthropic' && (
              <>
                <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              </>
            )}
          </select>
        </div>

        <div className="min-h-[400px] border rounded-lg p-4 space-y-4 overflow-y-auto mb-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500">
              Start a conversation with AI...
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={\`flex \${message.role === 'user' ? 'justify-end' : 'justify-start'}\`}
            >
              <div
                className={\`max-w-[80%] rounded-lg p-3 \${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }\`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            className="flex-1 border rounded px-3 py-2 resize-none"
            rows={3}
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim() || isGenerating}
            className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-gray-300 self-end"
          >
            {isGenerating ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>`}
    </div>
  )
}
`;

    writeFile(path.join(projectPath, "src", "components", "ai", "AIChat.tsx"), chatComponentContent);
};

// Create API routes
const createAPIRoutes = (projectPath, providers, includePayments) => {
    // AI Generation API
    const aiGenerateApiContent = `import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/ai/providers'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { provider, model, prompt, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    // Check user's usage limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('usage_count, usage_limit, subscription_status')
      .eq('id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (profile.usage_count >= profile.usage_limit) {
      return NextResponse.json({ 
        error: 'Usage limit exceeded. Please upgrade your plan.' 
      }, { status: 429 })
    }

    // Generate AI response
    const response = await generateText({
      provider,
      model,
      prompt,
      maxTokens: 1000,
      temperature: 0.7
    })

    return NextResponse.json({
      success: true,
      text: response.text,
      tokensUsed: response.tokensUsed,
      provider: response.provider,
      model: response.model
    })
  } catch (error) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}
`;

    writeFile(path.join(projectPath, "src", "app", "api", "ai", "generate", "route.ts"), aiGenerateApiContent);

    // Billing webhook if payments enabled
    if (includePayments) {
        const webhookApiContent = `import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        const userId = session.metadata?.userId

        if (userId) {
          // Update user subscription
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'pro',
              usage_limit: 1000,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
        }
        break

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const subscription = event.data.object
        const customerId = subscription.customer

        // Find user by customer ID and downgrade
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }
}
`;

        writeFile(path.join(projectPath, "src", "app", "api", "billing", "webhook", "route.ts"), webhookApiContent);
    }
};

// Environment configuration
const createEnvironmentConfig = (projectPath, templateName, options) => {
    let envContent = `# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
`;

    if (templateName === 'ai-saas') {
        const { aiProviders, includePayments } = options;
        
        if (aiProviders?.includes('openai')) {
            envContent += `
# OpenAI
OPENAI_API_KEY=your_openai_api_key
`;
        }
        
        if (aiProviders?.includes('anthropic')) {
            envContent += `
# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key
`;
        }
        
        if (includePayments) {
            envContent += `
# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRO_PRICE_ID=your_stripe_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=your_stripe_enterprise_price_id
`;
        }
    }

    writeFile(path.join(projectPath, ".env.example"), envContent);
};

// Deployment configuration
const createDeploymentConfig = (projectPath, templateName, framework) => {
    // Vercel deployment config
    const vercelConfig = {
        "version": 2,
        "builds": [
            {
                "src": "package.json",
                "use": "@vercel/next"
            }
        ],
        "env": {
            "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
            "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
            "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-key"
        }
    };

    if (templateName === 'ai-saas') {
        vercelConfig.env.OPENAI_API_KEY = "@openai-api-key";
        vercelConfig.env.ANTHROPIC_API_KEY = "@anthropic-api-key";
        vercelConfig.env.STRIPE_SECRET_KEY = "@stripe-secret-key";
        vercelConfig.env.STRIPE_WEBHOOK_SECRET = "@stripe-webhook-secret";
    }

    writeFile(path.join(projectPath, "vercel.json"), JSON.stringify(vercelConfig, null, 2));

    // Package.json scripts for deployment
    const packageJsonPath = path.join(projectPath, "package.json");
    // Note: We should read and modify existing package.json instead of overwriting
};

// Placeholder functions for other templates
const createEcommerceTemplate = () => {
    console.log("🛒 E-commerce template coming soon...");
};

const createSocialMediaTemplate = () => {
    console.log("📱 Social media template coming soon...");
};

const createProjectManagementTemplate = () => {
    console.log("📊 Project management template coming soon...");
};

const createLearningPlatformTemplate = () => {
    console.log("🎓 Learning platform template coming soon...");
};

const createBasicAppTemplate = () => {
    console.log("🏠 Basic app template coming soon...");
};

// Additional helper functions
const createDashboardComponents = (projectPath, useShadcnUI) => {
    // Dashboard layout component will go here
    console.log("📊 Dashboard components created");
};

const createBillingComponents = (projectPath, useShadcnUI) => {
    // Billing and subscription components will go here
    console.log("💳 Billing components created");
};

const createDatabaseSchema = (projectPath) => {
    const schemaContent = `-- Enable the extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'enterprise')),
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER DEFAULT 10,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create generations table
CREATE TABLE generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'code')),
  prompt TEXT NOT NULL,
  result TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  provider TEXT DEFAULT 'openai',
  model TEXT DEFAULT 'gpt-4',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own generations" ON generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own generations" ON generations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

    writeFile(path.join(projectPath, "supabase", "migrations", "001_initial.sql"), schemaContent);
};

const createAuthComponents = (projectPath, useShadcnUI) => {
    const authHookContent = `'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase/client'

interface AuthContextType {
  user: (User & { profile?: Profile }) | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
      }

      setUser({ ...authUser, profile: profile || undefined })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
`;

    writeFile(path.join(projectPath, "src", "hooks", "useAuth.tsx"), authHookContent);
};