'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAiAssistant, useMerchantProductContent, useCampaignInsights } from '@/lib/hooks/useAi';
import { Bot, Sparkles, TrendingUp, MessageSquare, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MerchantAiPage() {
  const chatMutation = useAiAssistant();
  const productContentMutation = useMerchantProductContent();
  const insightsMutation = useCampaignInsights();

  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);

  // Product content state
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [tone, setTone] = useState('Professional');
  const [contentResult, setContentResult] = useState('');

  // Insights state
  const [campaignId, setCampaignId] = useState('');
  const [dateRange, setDateRange] = useState('THIS_MONTH');
  const [insightsResult, setInsightsResult] = useState('');

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

  const handleProductContent = async () => {
    if (!productName || !features) return;
    try {
      const res = await productContentMutation.mutateAsync({ productName, features, tone });
      setContentResult(res.reply || 'No content generated.');
    } catch (e) {
      setContentResult('Failed to generate product content.');
    }
  };

  const handleInsights = async () => {
    try {
      const res = await insightsMutation.mutateAsync({ campaignId: Number(campaignId) || 0, dateRange });
      setInsightsResult(res.reply || 'No insights generated.');
    } catch (e) {
      setInsightsResult('Failed to generate campaign insights.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Bot className="text-indigo-600 h-8 w-8" />
          AI Tools for Merchants
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Optimize your products and analyze your campaigns with AI. Note: AI outputs are advisory only.
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="chat" className="gap-2"><MessageSquare size={16}/> Assistant</TabsTrigger>
          <TabsTrigger value="product" className="gap-2"><Sparkles size={16}/> Product Content</TabsTrigger>
          <TabsTrigger value="insights" className="gap-2"><TrendingUp size={16}/> Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Kart AI Assistant</CardTitle>
              <CardDescription>Ask questions about how to manage affiliates, clear commissions, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900/50">
                  {chatHistory.length === 0 && (
                    <div className="text-center text-slate-500 mt-20">
                      How can I help you manage your store today?
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
                    placeholder="E.g., How do I approve a pending payout?"
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

        <TabsContent value="product" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Product Content</CardTitle>
              <CardDescription>Draft SEO-optimized titles and descriptions for your new products.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <Input placeholder="e.g. Wireless Noise-Cancelling Headphones" value={productName} onChange={e => setProductName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger><SelectValue placeholder="Tone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="Luxurious">Luxurious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Features (Bullet points or draft text)</label>
                <Textarea 
                  placeholder="- 40hr battery life&#10;- Bluetooth 5.3&#10;- Over-ear design" 
                  value={features} 
                  onChange={e => setFeatures(e.target.value)} 
                  rows={4}
                />
              </div>
              <Button onClick={handleProductContent} disabled={productContentMutation.isPending || !productName || !features}>
                {productContentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Content
              </Button>
              {contentResult && (
                <div className="mt-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900 whitespace-pre-wrap">
                  <div className="flex gap-2 items-center mb-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                    <Sparkles className="h-4 w-4" /> Suggested Content (Copy to use when creating a product)
                  </div>
                  {contentResult}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Insights</CardTitle>
              <CardDescription>Analyze your overall store performance or specific campaigns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign ID (Optional, leave blank for overall)</label>
                  <Input placeholder="e.g. 1" type="number" value={campaignId} onChange={e => setCampaignId(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODAY">Today</SelectItem>
                      <SelectItem value="LAST_7_DAYS">Last 7 Days</SelectItem>
                      <SelectItem value="THIS_MONTH">This Month</SelectItem>
                      <SelectItem value="THIS_YEAR">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleInsights} disabled={insightsMutation.isPending}>
                {insightsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Metrics
              </Button>
              {insightsResult && (
                <div className="mt-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900 whitespace-pre-wrap">
                  <div className="flex gap-2 items-center mb-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                    <TrendingUp className="h-4 w-4" /> AI Performance Insights
                  </div>
                  {insightsResult}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
