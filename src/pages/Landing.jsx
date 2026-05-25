import { Link } from 'react-router-dom';

const SPORTS = [
  { name: 'Gaelic Football', emoji: '⚽' },
  { name: 'Hurling', emoji: '🏑' },
  { name: 'Camogie', emoji: '🥍' },
  { name: 'Ladies Football', emoji: '👟' },
];

const COMING_SOON_SPORTS = [
  { name: 'Soccer', emoji: '⚽' },
  { name: 'Tennis', emoji: '🎾' },
  { name: 'Rally', emoji: '🚗' },
];

const FEATURES = [
  { icon: '📡', title: 'Live Score Updates', desc: 'Update scores, cards and subs in real time from your phone. Fans follow along as it happens.' },
  { icon: '📋', title: 'Match Timeline', desc: 'Every goal, point, card and sub is logged with the minute. A full game log at your fingertips.' },
  { icon: '📝', title: 'Automatic Match Reports', desc: 'AI-powered match reports generated from your live updates. Ready to copy, share or publish.' },
  { icon: '🤝', title: 'Sponsor Branding', desc: 'Promote local sponsors on every match page and report. Give them real visibility with every update.' },
  { icon: '📶', title: 'Works on Poor Signal', desc: 'Built for rural pitches. Enter updates offline and they sync when you get signal.' },
  { icon: '🔗', title: 'Public Sharing Links', desc: 'Each match gets a public link. Share on WhatsApp, Facebook or Twitter with one tap.' },
];

const STEPS = [
  { num: '01', title: 'Create a Match', desc: 'Set up the fixture — teams, competition, venue and lineup — in under 2 minutes.' },
  { num: '02', title: 'Update It Live', desc: 'Log goals, cards, subs and match events from the sideline as they happen.' },
  { num: '03', title: 'Publish & Share', desc: 'Generate a report, add photos, and share the public match link with your club community.' },
];

const FAQS = [
  { q: 'Do fans need an account?', a: 'No. Fans follow via a public link — no login, no app install needed. Anyone with the link can view the live match.' },
  { q: 'Does it work on mobile?', a: 'Yes, ClubReporter is designed mobile-first. It works great on any smartphone or tablet, straight from the browser.' },
  { q: 'What happens if signal is poor?', a: 'You can still enter updates on the pitch. They sync automatically once your connection improves. No data is lost.' },
  { q: 'Can I upload players by CSV?', a: 'Yes. Upload a CSV file with player names, numbers and positions and they\'re immediately available for lineup selection.' },
  { q: 'Which sports are supported?', a: 'Gaelic Football, Hurling, Camogie, Ladies Football, and Soccer. GAA scoring (goals + points) is handled automatically.' },
];

function DemoMatch() {
  return (
    <div className="bg-white rounded-2xl border-2 border-green-100 shadow-lg overflow-hidden max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest">🔴 Live · 54'</span>
        <span className="text-xs opacity-80">County Senior Football Championship</span>
      </div>
      {/* Score */}
      <div className="px-4 py-5 flex items-center justify-between">
        <div className="text-center flex-1">
          <p className="font-bold text-base leading-tight">Barryroe</p>
          <p className="text-3xl font-black text-green-700 mt-1">1-09</p>
        </div>
        <div className="text-muted-foreground text-sm font-bold px-3">v</div>
        <div className="text-center flex-1">
          <p className="font-bold text-base leading-tight">Kilbrittain</p>
          <p className="text-3xl font-black text-gray-500 mt-1">0-07</p>
        </div>
      </div>
      {/* HT score */}
      <div className="px-4 pb-2 text-center">
        <span className="text-xs text-muted-foreground">HT: 0-05 – 0-04</span>
      </div>
      {/* Sponsor */}
      <div className="px-4 pb-3 flex items-center justify-center gap-2">
        <div className="w-7 h-7 rounded bg-orange-100 border border-orange-200 flex items-center justify-center text-sm">🔧</div>
        <span className="text-xs text-muted-foreground">Sponsored by <strong>O&apos;Brien&apos;s Hardware</strong></span>
      </div>
      {/* Timeline */}
      <div className="border-t border-gray-100 divide-y divide-gray-50">
        {/* Photo entry */}
        <div className="px-4 py-2.5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-muted-foreground w-8 shrink-0">54'</span>
            <span className="text-sm">📸</span>
            <p className="text-xs text-gray-700 leading-snug font-semibold">Photo – Goal moment</p>
          </div>
          <img
            src="https://media.base44.com/images/public/6a11bfdd862d168224f11e9c/281ba408f_Sports3302383.jpg"
            alt="Goal moment"
            className="w-full rounded-lg object-cover max-h-36 ml-11"
            style={{ width: 'calc(100% - 2.75rem)' }}
          />
        </div>
        {[
          { min: "54'", icon: '🟢', text: 'GOAL – Ciarán Murphy (Barryroe)' },
          { min: "49'", icon: '🏳️', text: 'Point – Jamie Hurley (Barryroe)' },
          { min: "43'", icon: '🟡', text: 'Yellow card – D. O\'Callaghan (Kilbrittain)' },
        ].map((e, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-xs font-mono text-muted-foreground w-8 shrink-0">{e.min}</span>
            <span className="text-sm">{e.icon}</span>
            <p className="text-xs text-gray-700 leading-snug">{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/6a11bfdd862d168224f11e9c/4f6e840a5_3_20260524_183643_0001.png" alt="ClubReporter" className="w-8 h-8 object-contain rounded-md" />
            <span className="font-black text-gray-900 text-lg">ClubReporter<span className="text-[#1A9E6D]">.ie</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"
              className="text-gray-600 hover:text-gray-900 font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
              Log In
            </Link>
            <Link to="/signup"
              className="bg-[#0B1A2E] hover:bg-[#0d2040] text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-gradient-to-b from-[#e8f2f0] to-white px-4 pt-14 pb-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#e8f5f0] text-[#0B1A2E] rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6">
            🏆 For GAA &amp; Local Sports Clubs
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-5">
            Live match updates and reports for local sports clubs.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Create fixtures, update scores live, upload photos, promote sponsors and generate match reports from your phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup"
              className="bg-[#0B1A2E] hover:bg-[#0d2040] text-white font-black px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-slate-300 inline-block text-center">
              🎉 Start Free Trial — 14 Days Free
            </Link>
            <Link to="/login"
              className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 font-bold px-8 py-4 rounded-2xl text-lg transition-colors inline-block text-center">
              Sign In
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">Basic plan · No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* ── PRICING (inline on landing) ── */}
      <section className="px-4 py-14 bg-white border-b border-gray-100" id="pricing-hero">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-2">Simple, transparent pricing</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">All plans include a 14-day free trial on Basic. No hidden fees.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Club */}
            <div className="border-2 border-gray-200 rounded-2xl p-5">
              <p className="font-bold text-gray-500 text-xs uppercase tracking-wide mb-2">Club</p>
              <p className="text-3xl font-black text-gray-900 mb-0.5">€4.99<span className="text-sm font-normal text-gray-400">/mo</span></p>
              <p className="text-xs text-green-700 font-bold mb-4">14-day free trial</p>
              <ul className="space-y-1.5 mb-5">
                {['6 matches/month','Manual line-ups','Live incidents & timeline','Basic match report','Squad management'].map(f => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-gray-700"><span className="text-green-600 mt-0.5">✓</span>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full text-center border-2 border-green-700 text-green-700 hover:bg-green-50 font-bold py-2.5 rounded-xl text-sm transition-colors">Start Free Trial</Link>
            </div>
            {/* County */}
            <div className="border-2 border-green-700 rounded-2xl p-5 bg-green-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-700 text-white text-[10px] font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
              <p className="font-bold text-green-800 text-xs uppercase tracking-wide mb-2">County</p>
              <p className="text-3xl font-black text-gray-900 mb-0.5">€12.99<span className="text-sm font-normal text-gray-400">/mo</span></p>
              <p className="text-xs text-gray-400 mb-4">or €119.99/year</p>
              <ul className="space-y-1.5 mb-5">
                {['Everything in Club','Club logo & colours','Photo uploads','AI newspaper reports','Sponsor management','Multiple admins','Push notifications'].map(f => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-gray-700"><span className="text-green-600 mt-0.5">✓</span>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full text-center bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Get Started</Link>
            </div>
            {/* Press */}
            <div className="border-2 border-blue-600 rounded-2xl p-5 bg-blue-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">MEDIA</div>
              <p className="font-bold text-blue-800 text-xs uppercase tracking-wide mb-2">Press Pass</p>
              <p className="text-3xl font-black text-gray-900 mb-0.5">€34.99<span className="text-sm font-normal text-gray-400">/mo</span></p>
              <p className="text-xs text-gray-400 mb-4">or €299.99/year</p>
              <ul className="space-y-1.5 mb-5">
                {['Everything in County','Media profile (not club)','Cover multiple clubs & sports','Link reports to media website','Report attribution','Verified press badge'].map(f => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-gray-700"><span className="text-blue-600 mt-0.5">✓</span>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPORTS ── */}
      <section className="px-4 py-12 bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Sports Supported</p>
          <div className="flex flex-wrap justify-center gap-3">
            {SPORTS.map(s => (
              <div key={s.name} className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-5 py-2.5">
                <span className="text-lg">{s.emoji}</span>
                <span className="font-semibold text-sm text-gray-800">{s.name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-8 mb-4">Coming Soon</p>
          <div className="flex flex-wrap justify-center gap-3">
            {COMING_SOON_SPORTS.map(s => (
              <div key={s.name} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 opacity-70">
                <span className="text-lg">{s.emoji}</span>
                <span className="font-semibold text-sm text-gray-500">{s.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">Soon</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-2">Everything you need on match day</h2>
          <p className="text-center text-gray-500 mb-10">Built for club PROs, managers and supporters</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-2">How it works</h2>
          <p className="text-center text-gray-500 mb-10">Up and running in minutes, not hours</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map(s => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 bg-green-700 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO ── */}
      <section id="demo" className="px-4 py-16 bg-[#0B1A2E]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-2">See it in action</h2>
          <p className="text-blue-200 mb-10">A live match card — exactly what supporters see on their phone</p>
          <DemoMatch />
          <Link to="/signup"
            className="mt-8 inline-block bg-white text-[#0B1A2E] hover:bg-gray-100 font-black px-8 py-4 rounded-2xl text-base transition-colors shadow-lg">
            Sign Up and Start Reporting
          </Link>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-2">Simple pricing</h2>
          <p className="text-center text-gray-500 mb-10">No hidden fees. Cancel anytime.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Club */}
            <div className="border-2 border-gray-200 rounded-2xl p-6">
              <p className="font-bold text-gray-500 text-sm uppercase tracking-wide mb-2">Club</p>
              <p className="text-4xl font-black text-gray-900 mb-1">€4.99<span className="text-lg font-bold text-gray-500">/mo</span></p>
              <p className="text-xs text-gray-400 mb-1">or €44.99/year</p>
              <p className="text-sm text-gray-500 mb-5">Perfect for getting started</p>
              <ul className="space-y-2 mb-8">
                {['Create matches','Add line-ups manually','Record match incidents & timeline','Generate basic match report','View and edit fixtures','Basic squad management'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full text-center border-2 border-green-700 text-green-700 hover:bg-green-50 font-bold py-3 rounded-xl transition-colors">Get Started</Link>
            </div>

            {/* County */}
            <div className="border-2 border-green-700 rounded-2xl p-6 bg-green-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-700 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>
              <p className="font-bold text-green-800 text-sm uppercase tracking-wide mb-2">County</p>
              <p className="text-4xl font-black text-gray-900 mb-1">€12.99<span className="text-lg font-bold text-gray-500">/mo</span></p>
              <p className="text-xs text-gray-400 mb-1">or €119.99/year</p>
              <p className="text-sm text-gray-500 mb-5">For active clubs and multiple teams</p>
              <ul className="space-y-2 mb-8">
                {['Everything in Club','Club profile with logo & colours','Photo uploads in match timeline','Full match history','Social media links','Advanced report editing','AI newspaper-style reports','Multiple admin users','Sponsor management','Push notifications to followers'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full text-center bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition-colors shadow-md">Start County</Link>
            </div>

            {/* Press */}
            <div className="border-2 border-blue-600 rounded-2xl p-6 bg-blue-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">MULTI-CLUB</div>
              <p className="font-bold text-blue-800 text-sm uppercase tracking-wide mb-2">Press Pass</p>
              <p className="text-4xl font-black text-gray-900 mb-1">€34.99<span className="text-lg font-bold text-gray-500">/mo</span></p>
              <p className="text-xs text-gray-400 mb-1">or €299.99/year</p>
              <p className="text-sm text-gray-500 mb-5">For reporters and multi-club coverage</p>
              <ul className="space-y-2 mb-8">
                {['Everything in County','Media profile instead of club profile','Cover multiple clubs & sports','Link reports to media website','Attribution of reports to media outlet','Verified press badge on profile'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">Start Press Pass</Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── SPONSOR VALUE ── */}
      <section className="px-4 py-14 bg-gray-50 border-y border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">🤝</div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Give your sponsors real visibility</h2>
          <p className="text-gray-600 leading-relaxed">
            Every match page carries your sponsor's name, logo and link. Match reports mention them by name.
            Fans who read live updates see the sponsor on every visit — giving local businesses genuine exposure
            through the club they support.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-10">Frequently asked questions</h2>
          <div className="space-y-5">
            {FAQS.map(faq => (
              <div key={faq.q} className="border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-16 bg-[#0B1A2E] text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">Ready to report your next match?</h2>
          <p className="text-blue-200 mb-8">Join clubs already using ClubReporter to keep their community informed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-white text-[#0B1A2E] hover:bg-gray-100 font-black px-10 py-5 rounded-2xl text-xl transition-colors shadow-xl">Sign Up Now</Link>
            <Link to="/login" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold px-8 py-5 rounded-2xl text-base transition-colors">Log In</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-4 py-8 border-t border-gray-100 text-center text-xs text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-[#0B1A2E] rounded flex items-center justify-center">
            <span className="text-white font-black text-[9px]">CR</span>
          </div>
          <span className="font-bold text-gray-700">ClubReporter</span>
        </div>
        <p>© {new Date().getFullYear()} ClubReporter. Built for GAA and local sports clubs.</p>
      </footer>

    </div>
  );
}