'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAiAssistant, useAffiliateRecommendations, useAffiliateContent, useAffiliatePerformanceSummary } from '@/lib/hooks/useAi';
import { Bot, Sparkles, TrendingUp, Search, MessageSquare, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AffiliateAiPage() {
  const chatMutation = useAiAssistant();
  const recMutation = useAffiliateRecommendations();
  const contentMutation = useAffiliateContent();
  const summaryMutation = useAffiliatePerformanceSummary();

  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);

  // Rec state
  const [niche, setNiche] = useState('');
  const [category, setCategory] = useState('none');
  const [recResult, setRecResult] = useState('');

  // Content state
  const [productId, setProductId] = useState('');
  const [platform, setPlatform] = useState('Twitter');
  const [tone, setTone] = useState('Professional');
  const [contentResult, setContentResult] = useState('');

  // Summary state
  const [summaryRange, setSummaryRange] = useState('THIS_MONTH');
  const [summaryResult, setSummaryResult] = useState('');

  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', text: chatMessage }]);
    try {
      const res = await chatMutation.mutateAsync(chatMessage);
      setChatHistory(prev => [...prev, { role: 'ai', text: res.reply || 'Error' }]);
      setChatMessage('');
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Error connecting to AI assistant.' }]);
    }
  };

  const handleRecommend = async () => {
    try {
      const res = await recMutation.mutateAsync({ niche, category: category === 'none' ? undefined : category });
      setRecResult(res.reply || 'No recommendations generated.');
    } catch (e) {
      setRecResult('Failed to load recommendations.');
    }
  };

  const handleContent = async () => {
    if (!productId) return;
    try {
      const res = await contentMutation.mutateAsync({ productId: Number(productId), platform, tone });
      setContentResult(res.reply || 'No content generated.');
    } catch (e) {
      setContentResult('Failed to generate content. Please ensure product ID is valid.');
    }
  };

  const handleSummary = async () => {
    try {
      const res = await summaryMutation.mutateAsync(summaryRange);
      setSummaryResult(res.reply || 'No summary generated.');
    } catch (e) {
      setSummaryResult('Failed to generate performance summary.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Bot className="text-indigo-600 h-8 w-8" />
          AI Tools
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Supercharge your affiliate workflow with AI. Note: AI-generated content should be reviewed before use.
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="chat" className="gap-2"><MessageSquare size={16}/> Assistant</TabsTrigger>
          <TabsTrigger value="recommend" className="gap-2"><Search size={16}/> Products</TabsTrigger>
          <TabsTrigger value="content" className="gap-2"><Sparkles size={16}/> Content</TabsTrigger>
          <TabsTrigger value="summary" className="gap-2"><TrendingUp size={16}/> Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Kart AI Assistant</CardTitle>
              <CardDescription>Ask questions about how to use the platform, how to get paid, and more.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900/50">
                  {chatHistory.length === 0 && (
                    <div className="text-center text-slate-500 mt-20">
                      How can I help you with Link Kart today?
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-4 py-2 bg-white dark:bg-slate-800 border flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> Thinking...
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={chatMessage} 
                    onChange={e => setChatMessage(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleChat()}
                    placeholder="E.g., How does the payout cycle work?"
                    disabled={chatMutation.isPending}
                  />
                  <Button onClick={handleChat} disabled={chatMutation.isPending || !chatMessage.trim()}>
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommend" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Products</CardTitle>
              <CardDescription>Discover relevant products from the marketplace based on your niche.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Niche/Keywords</label>
                  <Input placeholder="e.g. fitness, home office, pet care" value={niche} onChange={e => setNiche(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter by Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All Categories</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleRecommend} disabled={recMutation.isPending}>
                {recMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Recommendations
              </Button>
              {recResult && (
                <div className="mt-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900 whitespace-pre-wrap">
                  <div className="flex gap-2 items-center mb-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                    <Sparkles className="h-4 w-4" /> AI Recommendations
                  </div>
                  {recResult}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>Create promotional copy for a specific product ID.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product ID</label>
                  <Input placeholder="e.g. 1" type="number" value={productId} onChange={e => setProductId(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger><SelectValue placeholder="Platform" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Twitter">Twitter/X</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Instagram">Instagram Caption</SelectItem>
                      <SelectItem value="Blog">Blog Snippet</SelectItem>
                      <SelectItem value="Email">Email Newsletter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger><SelectValue placeholder="Tone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Fun">Fun & Casual</SelectItem>
                      <SelectItem value="Persuasive">Persuasive</SelectItem>
                      <SelectItem value="Urgent">Urgent / FOMO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleContent} disabled={contentMutation.isPending || !productId}>
                {contentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Copy
              </Button>
              {contentResult && (
                <div className="mt-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900 whitespace-pre-wrap">
                  <div className="flex gap-2 items-center mb-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                    <Sparkles className="h-4 w-4" /> Generated Content (Review before using)
                  </div>
                  {contentResult}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Get an AI summary of your metrics for a given date range.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-xs">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={summaryRange} onValueChange={setSummaryRange}>
                  <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODAY">Today</SelectItem>
                    <SelectItem value="THIS_MONTH">This Month</SelectItem>
                    <SelectItem value="LAST_30_DAYS">Last 30 Days</SelectItem>
                    <SelectItem value="THIS_YEAR">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSummary} disabled={summaryMutation.isPending}>
                {summaryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Metrics
              </Button>
              {summaryResult && (
                <div className="mt-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900 whitespace-pre-wrap">
                  <div className="flex gap-2 items-center mb-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                    <TrendingUp className="h-4 w-4" /> AI Performance Insights
                  </div>
                  {summaryResult}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
