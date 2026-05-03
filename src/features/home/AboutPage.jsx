import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LuArrowRight,
  LuBadgeCheck,
  LuHeart,
  LuLeaf,
  LuMapPin,
  LuShoppingBag,
  LuShoppingCart,
  LuStar,
  LuTimer,
  LuTruck,
  LuUsers,
  LuZap,
} from 'react-icons/lu'
import { useAuthStore } from '../../store/authStore'

const AboutPage = () => {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const [activeTeamMember, setActiveTeamMember] = useState(null)

  // Team members
  const team = [
    {
      name: 'Amara Okafor',
      role: 'CEO & Co-Founder',
      image: 'https://i.pravatar.cc/200?img=32',
      bio: 'Former logistics executive with 15 years of experience in supply chain management across Africa.',
      linkedin: '#'
    },
    {
      name: 'David Mensah',
      role: 'CTO & Co-Founder',
      image: 'https://i.pravatar.cc/200?img=12',
      bio: 'Tech innovator who built three successful startups before revolutionizing grocery delivery.',
      linkedin: '#'
    },
    {
      name: 'Zainab Mohammed',
      role: 'Head of Operations',
      image: 'https://i.pravatar.cc/200?img=44',
      bio: 'Operations expert who ensures every delivery arrives fresh and on time.',
      linkedin: '#'
    },
    {
      name: 'John Mwangi',
      role: 'Head of Farmer Relations',
      image: 'https://i.pravatar.cc/200?img=52',
      bio: 'Works directly with 500+ local farmers to ensure quality and fair pricing.',
      linkedin: '#'
    },
    {
      name: 'Fatima Sow',
      role: 'Head of Customer Experience',
      image: 'https://i.pravatar.cc/200?img=45',
      bio: 'Passionate about creating the best shopping experience for our customers.',
      linkedin: '#'
    },
    {
      name: 'Kwame Asante',
      role: 'Head of Sustainability',
      image: 'https://i.pravatar.cc/200?img=60',
      bio: 'Leading our mission to reduce food waste and promote sustainable farming.',
      linkedin: '#'
    }
  ]

  // Milestones
  const milestones = [
    { year: '2020', title: 'Founded in Lagos', description: 'Started with a simple mission: make fresh groceries accessible to everyone.' },
    { year: '2021', title: '10,000 Customers', description: 'Reached our first major milestone with customers across 5 cities.' },
    { year: '2022', title: 'Expanded to Nairobi', description: 'Launched operations in Kenya, bringing fresh delivery to East Africa.' },
    { year: '2023', title: '500+ Farmer Partners', description: 'Built relationships with over 500 local farmers and producers.' },
    { year: '2024', title: '1 Million Deliveries', description: 'Celebrated our millionth delivery with zero compromise on freshness.' }
  ]

  // Values
  const values = [
    {
      icon: <LuLeaf size={32} />,
      title: 'Freshness First',
      description: 'Every product is sourced within 24 hours of delivery. We work directly with local farms to ensure peak freshness.',
      color: 'bg-green-500'
    },
    {
      icon: <LuUsers size={32} />,
      title: 'Community Driven',
      description: 'We support local farmers, create jobs, and invest in the communities we serve across Africa.',
      color: 'bg-blue-500'
    },
    {
      icon: <LuZap size={32} />,
      title: 'Lightning Fast',
      description: 'Our optimized logistics network ensures delivery in under 45 minutes in most urban areas.',
      color: 'bg-yellow-500'
    },
    {
      icon: <LuHeart size={32} />,
      title: 'Customer Obsessed',
      description: 'Every decision we make starts with our customers. Your satisfaction is our highest priority.',
      color: 'bg-red-500'
    }
  ]

  return (
    <>
      <style>
        {`
          .value-card:hover {
            transform: translateY(-8px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .team-card:hover .team-overlay {
            opacity: 1;
          }
          .team-overlay {
            opacity: 0;
            transition: all 0.3s ease;
          }
          .milestone-line {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 100%;
            background: linear-gradient(to bottom, #16a34a, #e2e8f0);
          }
        `}
      </style>

      <div className="bg-slate-50 font-sans text-slate-900 min-h-screen">
        {/* Navigation */}
       

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#003366] via-blue-900 to-green-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs font-bold tracking-wider uppercase">Our Story</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black leading-tight">
                  Bringing Freshness <br />
                  <span className="text-green-400">To Your Doorstep</span>
                </h1>
                <p className="text-lg text-blue-100 leading-relaxed max-w-lg">
                  We're on a mission to revolutionize how Africa eats. By connecting local farmers 
                  directly to urban households, we ensure fresher food, fairer prices, and a more 
                  sustainable food system for everyone.
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <div>
                    <div className="text-3xl font-black text-green-400">1M+</div>
                    <div className="text-sm text-blue-200">Deliveries Made</div>
                  </div>
                  <div className="w-px h-12 bg-white/20"></div>
                  <div>
                    <div className="text-3xl font-black text-green-400">500+</div>
                    <div className="text-sm text-blue-200">Farm Partners</div>
                  </div>
                  <div className="w-px h-12 bg-white/20"></div>
                  <div>
                    <div className="text-3xl font-black text-green-400">50k+</div>
                    <div className="text-sm text-blue-200">Happy Customers</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800"
                    alt="Fresh produce"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                        <LuTimer size={24} />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Average Delivery</div>
                        <div className="text-slate-900 font-black text-lg">Under 45 Minutes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We believe everyone deserves access to fresh, healthy food at affordable prices. 
                By cutting out middlemen and connecting farmers directly to consumers, we're making 
                that vision a reality across Africa.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl value-card transition-all group cursor-default"
                >
                  <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Timeline */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Our Journey</h2>
              <p className="text-slate-500">From a small startup to serving millions across Africa</p>
            </div>

            <div className="relative">
              {/* Timeline Line (Desktop) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-slate-200"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-slate-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all inline-block">
                        <div className="text-green-600 font-black text-sm mb-1">{milestone.year}</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{milestone.title}</h3>
                        <p className="text-slate-600 text-sm">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-12 h-12 rounded-full bg-green-500 text-white items-center justify-center font-bold shadow-lg flex-shrink-0 z-10">
                      {index + 1}
                    </div>
                    <div className="flex-1 hidden md:block"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">Our Impact</h2>
              <p className="text-slate-400">Making a difference in communities across Africa</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 border border-white/10 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LuLeaf size={32} className="text-white" />
                </div>
                <div className="text-3xl font-black text-green-400 mb-2">30%</div>
                <h3 className="text-lg font-bold mb-3">Less Food Waste</h3>
                <p className="text-slate-400 text-sm">
                  Our direct farm-to-table model has reduced food waste by 30% compared to traditional supply chains.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 border border-white/10 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LuUsers size={32} className="text-white" />
                </div>
                <div className="text-3xl font-black text-blue-400 mb-2">500+</div>
                <h3 className="text-lg font-bold mb-3">Farmers Supported</h3>
                <p className="text-slate-400 text-sm">
                  We work with over 500 small-scale farmers, providing them with stable income and fair prices.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 border border-white/10 text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LuMapPin size={32} className="text-white" />
                </div>
                <div className="text-3xl font-black text-yellow-400 mb-2">12</div>
                <h3 className="text-lg font-bold mb-3">Cities Served</h3>
                <p className="text-slate-400 text-sm">
                  Operating in 12 major cities across Nigeria, Kenya, and Ghana with plans for expansion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Meet Our Team</h2>
              <p className="text-slate-500">The passionate people behind FreshCart</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div 
                  key={index}
                  className="group relative"
                  onMouseEnter={() => setActiveTeamMember(index)}
                  onMouseLeave={() => setActiveTeamMember(null)}
                >
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all">
                    <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-green-600/90 flex items-center justify-center team-overlay ${activeTeamMember === index ? 'opacity-100' : ''}`}>
                        <a href={member.linkedin} className="text-white font-bold text-sm hover:underline">
                          View Profile
                        </a>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
                      <p className="text-green-600 font-medium text-sm mb-3">{member.role}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Trusted Partners</h2>
              <p className="text-slate-500">Working with the best farms and producers across Africa</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-8 flex items-center justify-center h-24 hover:shadow-md transition-all">
                  <div className="text-slate-400 font-black text-lg tracking-wider">
                    Partner {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl font-black mb-4">Ready to Experience FreshCart?</h2>
                <p className="text-green-100 mb-8 text-lg">
                  Join thousands of happy customers who get fresh groceries delivered to their doorstep every day.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => navigate('/products')}
                    className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all shadow-xl"
                  >
                    Start Shopping
                  </button>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-slate-900 text-white py-20 rounded-[3rem] mx-6 mb-8">
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
                <LuTimer size={32} />
              </div>
              <h4 className="text-xl font-bold">Express Delivery</h4>
              <p className="text-slate-400">Our logistics team ensures delivery in under 45 mins.</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <LuBadgeCheck size={32} />
              </div>
              <h4 className="text-xl font-bold">24/7 Support</h4>
              <p className="text-slate-400">We are always here to help with your orders.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutPage