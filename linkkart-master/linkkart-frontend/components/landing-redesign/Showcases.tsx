'use client';

export function Showcases() {
  return (
    <>
      {/* Campaign Management Showcase */}
      <section className="py-24 bg-surface-lavender relative overflow-hidden" id="campaigns">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[42px] md:text-[52px] font-[800] text-text-heading leading-[1.1] tracking-tight mb-6">
              Run Every Campaign From One Place.
            </h2>
            <p className="text-[18px] font-[500] text-text-body leading-[1.65]">
              Create campaigns, connect products, manage participating affiliates, and keep your partnership workflow organized.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-surface rounded-[28px] border border-border-light card-shadow-lg overflow-hidden">
              <div className="h-12 border-b border-border-light bg-[#FAFAFA] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
                <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
                <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
              </div>
              <div className="p-8 bg-page">
                <div className="flex justify-between items-center mb-6 border-b border-border-light pb-6">
                  <div>
                    <h3 className="text-[20px] font-[800] text-text-heading">Campaigns</h3>
                    <p className="text-[14px] text-text-body font-[500]">Manage your active partnership initiatives.</p>
                  </div>
                  <button className="btn-primary !h-10 !px-4 !text-[14px]">
                    + New Campaign
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Summer 2026 Electronics Promo', status: 'Active', color: 'bg-accent-green/20 text-accent-green', affiliates: 42, conv: 320 },
                    { name: 'Q3 Creator Outreach', status: 'Active', color: 'bg-accent-green/20 text-accent-green', affiliates: 18, conv: 105 },
                    { name: 'Black Friday Early Access', status: 'Draft', color: 'bg-border-light text-text-muted', affiliates: 0, conv: 0 }
                  ].map((camp, i) => (
                    <div key={i} className="bg-white p-5 rounded-[16px] border border-border-light flex items-center justify-between hover:border-border-strong transition-colors card-shadow-sm">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[16px] font-[700] text-text-heading">{camp.name}</span>
                          <span className={`px-2.5 py-1 rounded-full text-[12px] font-[700] ${camp.color}`}>{camp.status}</span>
                        </div>
                        <p className="text-[14px] text-text-body font-[500]">{camp.affiliates} affiliates participating</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[20px] font-[800] text-text-heading">{camp.conv}</p>
                        <p className="text-[12px] text-text-body font-[600] uppercase tracking-wider">Conversions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Discovery Showcase */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative">
              <div className="bg-surface-section rounded-[32px] p-8 border border-border-light relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[80px] opacity-60" />
                
                <div className="space-y-4 relative z-10">
                  <h4 className="text-[18px] font-[800] text-text-heading mb-6">Recommended Partners</h4>
                  
                  {[
                    { name: 'Tech Reviews Daily', niche: 'Technology', reach: '50K+', img: 'bg-accent-blue/20' },
                    { name: 'Lifestyle Maven', niche: 'Fashion', reach: '120K+', img: 'bg-accent-sky/20' },
                    { name: 'Gaming Central', niche: 'Gaming', reach: '85K+', img: 'bg-surface-strong' }
                  ].map((aff, i) => (
                    <div key={i} className="bg-white p-4 rounded-[16px] card-shadow-sm border border-border-light flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${aff.img} border-2 border-white flex items-center justify-center text-[20px]`}>
                        📸
                      </div>
                      <div className="flex-1">
                        <h5 className="text-[15px] font-[700] text-text-heading">{aff.name}</h5>
                        <p className="text-[13px] text-text-body font-[500]">{aff.niche} • {aff.reach} Audience</p>
                      </div>
                      <button className="px-4 py-2 bg-surface-lavender text-primary-brand text-[13px] font-[700] rounded-lg hover:bg-surface-strong transition-colors border border-border-light">
                        Invite
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[42px] md:text-[52px] font-[800] text-text-heading leading-[1.1] tracking-tight mb-6">
                Find Partners That Fit Your Brand.
              </h2>
              <p className="text-[18px] font-[500] text-text-body leading-[1.65] mb-8">
                Businesses can discover relevant affiliates using profile information and discovery preferences. Connect with creators and marketers who align with your target audience.
              </p>
              <button className="btn-primary">
                Start Discovering
              </button>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
