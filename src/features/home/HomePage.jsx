import React from 'react';

export default function FreshCartDashboard() {
  return (
    <div className="w-full pb-32 bg-white text-[#2c2f30] min-h-[max(884px,100dvh)] font-['Manrope']">
      {/* TopAppBar */}
  
      <main className="mt-20 px-6">
        {/* Hero Search */}
        <section className="py-6">
          <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-6">
            Welcome back, <br />
            <span className="text-primary-container">Freshness awaits.</span>
          </h1>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            <input 
              className="w-full pl-12 pr-4 py-4 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all placeholder:text-slate-400 font-medium" 
              placeholder="Search fresh harvest, meats, or pantry..." 
              type="text" 
            />
          </div>
        </section>

        {/* Active Order Tracker */}
        <section className="mb-8">
          <div className="bg-primary p-6 rounded-lg relative overflow-hidden flex flex-col justify-between h-48">
            {/* Signature Gradient Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-90 z-0"></div>
            <div className="relative z-10">
              <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full backdrop-blur-md">Active Order</span>
              <h2 className="text-white font-headline text-2xl font-bold mt-3 leading-tight">Your harvest is arriving<br />in 15 mins</h2>
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-primary-container overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVgL46MjliT78tnjcXp6g4w4ZG2tNBt43GGJa6xjc3xBhCFBf8PHQYyxxW4eBuG71hcCnm0jBdpfdXfINk_LoLPpxn2F01-CmCiLCkYnuUqNSAiz9h6mC99IqIg1OxdAsjG0t3uq71N3waN3piMVI3KVlQpxnrbsQmxPsxuFS4-zdRMLQqLjiO3Z4-nXcp_xupJXqRapi-fEMQe6xUVr5NNWxlF_v-1bMALd-C2wb1aybWKGGpCcQY2doVevGTLlXSGgfEGudqqiY" alt="Harvest 1" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-primary-container overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoSusD1eMcD8KJ_kVJYHRu099ADJjPa-YnsRLhNS0a-e8a8STZZjxG6_cSJNBED9-dvFuHKwKrfieNHi_FSoe___CxqM2y5C_T22aEZMvBFrL28Tx4evP2QFMV4MrBz8KLlRqZlH26OisyZ7XK4uxCSLBvrLQw3E4y0i6tVqJxLuWpv6lvAJ8jWahLhdBDTEs-iiqPrjqKEoJE83VtBgFTY_tpta8aKekdHSjQeRjTv780PBYQK9CFURZ71xSX210K4fwWBI3NiEg" alt="Harvest 2" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-primary-container bg-primary-container flex items-center justify-center text-[10px] text-white font-bold">+3</div>
              </div>
              <button className="bg-white text-primary font-bold px-4 py-2 rounded-full text-sm active:scale-95 duration-200">Track Now</button>
            </div>
            {/* Abstract Blur Shape */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Category Horizontal Scroll */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-lg">Categories</h3>
            <button className="text-primary font-bold text-sm">View All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6">
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-tertiary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-3xl">nutrition</span>
              </div>
              <span className="text-xs font-bold text-slate-600">Fruits</span>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-secondary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-3xl">eco</span>
              </div>
              <span className="text-xs font-bold text-slate-600">Veggies</span>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">set_meal</span>
              </div>
              <span className="text-xs font-bold text-slate-600">Meat</span>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-600 text-3xl">egg</span>
              </div>
              <span className="text-xs font-bold text-slate-600">Dairy</span>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-600 text-3xl">bakery_dining</span>
              </div>
              <span className="text-xs font-bold text-slate-600">Bakery</span>
            </div>
          </div>
        </section>

        {/* Recommended For You (Bento Grid) */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-bold text-lg">Recommended for You</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Large Bento Card */}
            <div className="col-span-2 bg-surface-container-lowest rounded-lg p-6 relative overflow-hidden group">
              <div className="flex flex-col justify-between h-full relative z-10">
                <div className="max-w-[60%]">
                  <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-extrabold px-2 py-1 rounded-md mb-2 inline-block">BEST SELLER</span>
                  <h4 className="font-headline font-bold text-xl leading-tight">Premium Hass Avocados</h4>
                  <p className="text-sm text-slate-500 mt-1">Farm fresh from Limuru</p>
                  <p className="text-primary font-extrabold text-lg mt-4">KES 450 <span className="text-xs font-normal text-slate-400">/ 4 pack</span></p>
                </div>
                <button className="mt-4 bg-primary-container text-on-primary-container font-bold w-fit px-6 py-2 rounded-full active:scale-95 transition-all">Add to Cart</button>
              </div>
              <img className="absolute -right-4 -bottom-4 w-44 h-44 object-contain group-hover:scale-110 transition-transform duration-500" data-alt="Two ripe halved avocados showing stone and green flesh, clean studio photography with soft shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC20KkTZtgfWZaFdeZik2SNRNfoLW_qu5n1HxWJfoOKyRSS1fa5in3TNmhb2yvpaRZUTPf_tvpdnXSyDcC0_l3r9hQ-MAFmWcV2WK-Q4kZDwJkQ8V_l7tXcffQeReuPFTN7Ov8uoDYZZ1AetewPKBdEcafbfGC9D5zrML17jJ-kHTGQMHgiULrO-UM0Uht7ZdLHcTJ-k8ynl6ZPcSpJlAntN8FSzZpjeRNrtdN0Mgv86tL91yRaKSVFPAjIdFtj2QN2NNFVGvlxSdA" alt="Avocados" />
            </div>
            
            {/* Small Bento Card 1 */}
            <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col">
              <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-surface-container-low">
                <img className="w-full h-full object-cover" data-alt="Close up of multiple bright orange organic oranges with textured skin on a light grey background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAenBrG7fuARkTmjXdOBa_75wuXK7n6TyKk5Fa-7te2Q5YQy1ZMytgRhcbam6CSaLKwC_6g9D2CQ3hTlyJuMjSRwgw8JogGo6Mg1xYvNkDZ59PjzZhIjVddP71peOjYbX3FG80yRkhZ-e6rjP0Ax2Co8Y7xHhFE4TkXerw754GVF7j-B2Cdk1fpxfCOJARZ8TubIEAPrKYzbW2SzEmluiVZ5UVqDSR6-lYQHZ3BihgYFAnVRib5ZtozdjKhfFKnH-g-D8IWrQb42mY" alt="Oranges" />
              </div>
              <h4 className="font-bold text-sm leading-tight">Valencia Oranges</h4>
              <p className="text-primary font-bold text-sm mt-1">KES 120 <span className="text-[10px] font-normal text-slate-400">/kg</span></p>
              <button className="mt-3 border border-slate-100 rounded-full p-2 flex items-center justify-center hover:bg-slate-50">
                <span className="material-symbols-outlined text-primary text-xl">add</span>
              </button>
            </div>
            
            {/* Small Bento Card 2 */}
            <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col">
              <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-surface-container-low">
                <img className="w-full h-full object-cover" data-alt="A bunch of dark red organic apples shining under soft light on a clean background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDng3GUMDCHwSU8PFlHv7F54m0o2Ht_wOOe1ENXePA2Mwp9qK5yim5ESbj88BNmnv3QdBcT-xRfwEfdQphlADcxQ6UJ6FGT5Wv1rvygrUbu1cZ9XZFXW24SyyeUlT1wTD1B4bCgJGam0ck9vT0GrngdaT4VzDO1JLX_eCraY9Wt9avXQrLS3FiZVgaPfVM14caiV-2NL89fM7gt6UJFj0oRQDgx6OeV-c5Ls1VOLG85UtUP6Q-0076Hb8mpUN4oJukohSlapKCTxE" alt="Apples" />
              </div>
              <h4 className="font-bold text-sm leading-tight">Red Gala Apples</h4>
              <p className="text-primary font-bold text-sm mt-1">KES 350 <span className="text-[10px] font-normal text-slate-400">/kg</span></p>
              <button className="mt-3 border border-slate-100 rounded-full p-2 flex items-center justify-center hover:bg-slate-50">
                <span className="material-symbols-outlined text-primary text-xl">add</span>
              </button>
            </div>
          </div>
        </section>

        {/* Reorder Favorites */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-lg">Reorder Favorites</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-lg hover:bg-surface-bright transition-colors">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                <img className="w-full h-full object-cover" data-alt="A glass bottle of fresh organic milk with a simple label on a white background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHFbvU_9JGtf4vO1k8QxxCEwEK7VEMtWwUrc__3aBSo2Alj7PGI0F5XzEpjicbNVDCzelUSB62mBljhgF9wojfwwv6FzzZvFsZmReFqT0YvbEwv5g6lCsEySLlm_fLmN6ykhQw0lsBd53FOHhZwjEC0uS7wFHy31mXioGzLJAhfME1_Z7ataHuNCMfdeR2c99UWuz3vw6rqo7fRDmfpHl05nOnhi1_1PmlikNwpWB6AnWmL8xV0rrbFqAfJ-NXoQTLQGTvMr1H-yc" alt="Milk" />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-sm">Farm Fresh Whole Milk</h4>
                <p className="text-xs text-slate-500">1 Litre • KES 110</p>
              </div>
              <button className="bg-secondary text-white rounded-full px-4 py-2 text-xs font-bold">Add</button>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-lg hover:bg-surface-bright transition-colors">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                <img className="w-full h-full object-cover" data-alt="Fresh bunch of vibrant orange organic carrots with leafy green tops" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoeCNhpOn2Jli4Q7LyONUhKE-NzhhiX5zytvAqYdU3Or93H5g0wvoniutZWyO1R9mmhiS2SPLszAZuQrRqvxkoMrMCjPfeoT-eHHRQHC0w1VJdfVspAV1pZ1qpNeqXWuBGWBgtCj9VP37FBFZKKxhN--exm7kaKJqbMmtfdhrhevTcYGxYjDdsJYmpy3Qct2gpwnJwxZbbl2i_Jkla3xC0pUUMUlLZCwJHmISHq4SWEEsrGQWI3wKy4YR0PQJfMGRWvftGh-LIa4A" alt="Carrots" />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-sm">Baby Carrots</h4>
                <p className="text-xs text-slate-500">500g • KES 85</p>
              </div>
              <button className="bg-secondary text-white rounded-full px-4 py-2 text-xs font-bold">Add</button>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-white dark:bg-slate-900 z-50 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] border-t border-slate-100 dark:border-slate-800">
        <a className="flex flex-col items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-2xl px-5 py-2 font-['Manrope'] text-xs font-semibold active:scale-90 duration-150" href="#">
          <span className="material-symbols-outlined mb-1">storefront</span>
          Shop
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-2 font-['Manrope'] text-xs font-semibold hover:text-orange-500 transition-all active:scale-90 duration-150" href="#">
          <span className="material-symbols-outlined mb-1">search</span>
          Explore
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-2 font-['Manrope'] text-xs font-semibold hover:text-orange-500 transition-all active:scale-90 duration-150" href="#">
          <span className="material-symbols-outlined mb-1">receipt_long</span>
          Orders
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-2 font-['Manrope'] text-xs font-semibold hover:text-orange-500 transition-all active:scale-90 duration-150" href="#">
          <span className="material-symbols-outlined mb-1">person</span>
          Account
        </a>
      </nav>

      {/* Contextual FAB (Only on main dashboard) */}
      <button className="fixed bottom-28 right-6 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all z-40 border-4 border-white">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
      </button>
    </div>
  );
}