'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Link2, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AffiliateLinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await api.affiliateLinks.list();
        setLinks(Array.isArray(res) ? res : (res?.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Links</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your generated affiliate links.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Links</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-12">
              <Link2 size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Links Yet</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                Go to the marketplace and generate links for products you want to promote.
              </p>
              <Button asChild variant="outline">
                <a href="/marketplace">Browse Marketplace</a>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Tracking Code</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        {link.productName}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-500">
                        {link.code}
                      </TableCell>
                      <TableCell className="text-right text-slate-500 dark:text-slate-400">
                        {link.clicksCount || 0}
                      </TableCell>
                      <TableCell className="text-right text-slate-500 dark:text-slate-400">
                        {link.conversionsCount || 0}
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                        ₹{link.totalCommission || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(link.trackingUrl || `http://localhost:8080/t/${link.code}`)} className="h-8 w-8 text-slate-500 hover:text-indigo-600">
                            <Copy size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-500 hover:text-indigo-600">
                            <a href={link.trackingUrl || `/r/${link.code}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={16} />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
