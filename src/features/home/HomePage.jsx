import React from 'react';
import { 
  LuShoppingBag, 
  LuSearch, 
  LuTimer, 
  LuArrowRight, 
  LuPercent, 
  LuTruck, 
  LuChevronLeft, 
  LuChevronRight, 
  LuHeart, 
  LuStar, 
  LuShoppingCart, 
  LuBadgeCheck, 
  LuZap, 
  LuHeadphones 
} from "react-icons/lu";
import { MdOutlineLocalMall } from "react-icons/md";

const FreshCartLanding = () => {
  return (
    <>
      <style>
        {`
          :root {
            --primary: #1e3a8a;
            --secondary: #166534;
            --surface: #f8fafc;
          }
          .editorial-shadow {
            box-shadow: 0 32px 64px -12px rgba(44, 47, 48, 0.08);
          }
          .bento-hover:hover {
            transform: translateY(-4px);
            transition: all 0.3s ease;
          }
          body {
            min-height: max(884px, 100dvh);
            background-color: var(--surface);
          }
        `}
      </style>

      <div className="bg-slate-50 font-sans text-slate-900">
      
        <main className="pt-24 pb-32">
          {/* Hero Section */}
          <section className="px-6 max-w-7xl mx-auto mb-16">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#003366] min-h-[500px] flex items-center p-8 md:p-16">
              <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-600 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px]"></div>
              </div>
              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-white tracking-wider uppercase">Live in Lagos & Nairobi</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                    Fresh Groceries <br />
                    <span className="text-green-400">Delivered Fast</span>
                  </h1>
                  <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                    Convenience meets affordability. Get hand-picked fresh farm produce and daily essentials at your doorstep in under 45 minutes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-400 transition-all editorial-shadow">
                      Start Shopping
                    </button>
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="flex -space-x-3">
                        <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/100?img=32" alt="User" />
                        <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/100?img=44" alt="User" />
                      </div>
                      <div className="text-slate-300 text-sm">
                        <span className="font-bold text-white">10k+</span> Happy Customers
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block relative">
                  <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl">
                    <img alt="Fresh Produce" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 p-5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center gap-4 border border-white">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                      <LuTimer size={28} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Est. Delivery</div>
                      <div className="text-slate-900 font-black text-lg">24 Minutes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Search Bar */}
          <section className="px-6 max-w-4xl mx-auto -mt-12 relative z-20">
            <div className="bg-white p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4 border border-slate-100">
              <div className="flex-1 flex items-center px-4 gap-3 bg-slate-50 rounded-xl h-14">
                <LuSearch className="text-slate-400" size={20} />
                <input className="bg-transparent border-none focus:ring-0 w-full text-slate-700 placeholder:text-slate-400 font-medium" placeholder="Search for fresh mangoes, bread, or milk..." type="text" />
              </div>
              <button className="bg-slate-900 text-white px-8 h-14 rounded-xl font-bold hover:bg-slate-800 transition-all">
                Search
              </button>
            </div>
          </section>

          {/* Category Bento Grid */}
          <section className="px-6 max-w-7xl mx-auto mt-24 mb-24">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
                <p className="text-slate-500 mt-2 font-medium">Carefully curated for your daily needs</p>
              </div>
              <button className="text-green-600 font-bold flex items-center gap-2 hover:translate-x-1 transition-all">
                View All <LuArrowRight />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-6 h-[560px]">
              <div className="col-span-2 row-span-2 relative rounded-[2rem] overflow-hidden group bento-hover shadow-xl">
                <img alt="Fruits" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full uppercase mb-3 inline-block">Organic</span>
                  <h3 className="text-3xl font-black">Fresh Fruits</h3>
                  <p className="text-slate-300 text-sm mt-1">Straight from local orchards</p>
                </div>
              </div>
              <div className="relative rounded-[1.5rem] overflow-hidden group bento-hover shadow-lg bg-emerald-50">
                <img alt="Vegetables" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" src="https://images.unsplash.com/photo-1566385101042-1a000c1267c4?auto=format&fit=crop&w=400" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent"></div>
                <div className="absolute bottom-5 left-5 text-white"><h3 className="text-xl font-bold">Vegetables</h3></div>
              </div>
              {/* More items... */}
              <div className="relative rounded-[1.5rem] overflow-hidden group bento-hover shadow-lg bg-orange-50">
                <img alt="Meat" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400" />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent"></div>
                <div className="absolute bottom-5 left-5 text-white"><h3 className="text-xl font-bold">Meat & Poultry</h3></div>
              </div>
              <div className="relative rounded-[1.5rem] overflow-hidden group bento-hover shadow-lg bg-blue-50">
                <img alt="Beverages" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" src="https://images.unsplash.com/photo-1622484210800-208643806f40?auto=format&fit=crop&w=400" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                <div className="absolute bottom-5 left-5 text-white"><h3 className="text-xl font-bold">Beverages</h3></div>
              </div>
              <div className="relative rounded-[1.5rem] overflow-hidden group bento-hover shadow-lg bg-slate-100">
                <img alt="Essentials" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" src="https://images.unsplash.com/photo-1583209814613-5116e9a5a3ad?auto=format&fit=crop&w=400" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-5 left-5 text-white"><h3 className="text-xl font-bold">Essentials</h3></div>
              </div>
            </div>
          </section>

          {/* Promo Banners */}
          <section className="px-6 max-w-7xl mx-auto mb-24 flex flex-col md:flex-row gap-8">
            <div className="flex-1 rounded-[2rem] bg-blue-600 p-10 flex items-center justify-between overflow-hidden relative group">
              <div className="relative z-10 max-w-[65%] text-white">
                <h3 className="text-4xl font-black leading-tight">50% off first order</h3>
                <p className="text-blue-100 mt-3 mb-8 font-medium">Use code: <span className="bg-white/20 px-3 py-1 rounded-lg font-bold">FRESH50</span></p>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg group-hover:scale-105 transition-transform">Claim Offer</button>
              </div>
              <LuPercent className="text-white/10 text-[180px] absolute -right-8 -bottom-8 rotate-12" />
            </div>
            <div className="flex-1 rounded-[2rem] bg-green-600 p-10 flex items-center justify-between overflow-hidden relative group">
              <div className="relative z-10 max-w-[65%] text-white">
                <h3 className="text-4xl font-black leading-tight">Free delivery</h3>
                <p className="text-green-100 mt-3 mb-8 font-medium">On all orders above $20 this week</p>
                <button className="bg-white text-green-600 px-8 py-3 rounded-full font-bold shadow-lg group-hover:scale-105 transition-transform">Shop Now</button>
              </div>
              <LuTruck className="text-white/10 text-[180px] absolute -right-8 -bottom-8 rotate-12" />
            </div>
          </section>

          {/* Featured Products */}
          <section className="px-6 max-w-7xl mx-auto mb-24">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Deals of the Day</h2>
              <div className="flex gap-3">
                <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-green-600 hover:text-green-600 transition-all bg-white shadow-sm">
                  <LuChevronLeft size={24} />
                </button>
                <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-green-600 hover:text-green-600 transition-all bg-white shadow-sm">
                  <LuChevronRight size={24} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Sweet Bananas', price: '2.49', cat: 'Fruits', img: 'https://images.unsplash.com/photo-1571771894821-ad99026107b8?auto=format&fit=crop&w=400' },
                { title: 'Strawberries', price: '4.99', cat: 'Fruits', img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400' },
                { title: 'Fresh Milk', price: '3.15', cat: 'Essentials', img: 'https://images.unsplash.com/photo-1550583724-125581fe2f8a?auto=format&fit=crop&w=400' },
                { title: 'Sourdough', price: '5.50', cat: 'Bakery', img: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=400' }
              ].map((product, i) => (
                <div key={i} className="bg-white rounded-[2rem] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-50 group hover:shadow-2xl transition-all">
                  <div className="relative aspect-square rounded-[1.5rem] bg-slate-50 mb-5 overflow-hidden">
                    <img alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.img} />
                    <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <LuHeart size={20} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[11px] text-green-600 font-black uppercase tracking-widest mb-1">{product.cat}</p>
                        <h3 className="font-bold text-slate-900 text-lg">{product.title}</h3>
                      </div>
                      <p className="font-black text-slate-900 text-xl">${product.price}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <LuStar className="text-yellow-500 fill-yellow-500" size={14} />
                      <span className="text-xs text-slate-500 font-bold">4.8 (120 reviews)</span>
                    </div>
                    <button className="w-full mt-5 bg-slate-50 hover:bg-green-600 hover:text-white text-slate-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                      <LuShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trust Section */}
          <section className="bg-slate-900 text-white py-20 rounded-[3rem] mx-6">
            <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-3 gap-12 text-center md:text-left">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <LuBadgeCheck size={32} />
                </div>
                <h4 className="text-xl font-bold">100% Quality</h4>
                <p className="text-slate-400">Directly from verified local farmers to your kitchen.</p>
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <LuZap size={32} />
                </div>
                <h4 className="text-xl font-bold">Express Delivery</h4>
                <p className="text-slate-400">Our logistics team ensures delivery in under 45 mins.</p>
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <LuHeadphones size={32} />
                </div>
                <h4 className="text-xl font-bold">24/7 Support</h4>
                <p className="text-slate-400">We are always here to help with your orders.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default FreshCartLanding;