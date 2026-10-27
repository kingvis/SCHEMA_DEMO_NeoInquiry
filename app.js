// ============================================================
//  NeoInquiry — Application Logic
//  NeoAistriq Demo Project
//  No frameworks, pure JavaScript — production-quality patterns
// ============================================================

'use strict';

// ── STATE ──────────────────────────────────────────────────
const state = {
  currentView: 'dashboard',
  selectedInboxItem: null,
  inboxFilter: 'all',
  triageChannel: 'email',
  agentStates: { triage: true, draft: true, followup: true, insight: true },
  animationsDone: {},
};

// ── DATA ───────────────────────────────────────────────────
const INBOX_DATA = [
  {
    id: 'inq-001',
    sender: 'Jordan Walsh',
    email: 'j.walsh@utexas.edu',
    subject: 'Esports Coaching Program Interest — UT Austin Varsity',
    preview: 'Hi, our varsity esports team is exploring structured coaching. GG Life came up in our research...',
    body: `Hi there,\n\nI'm the esports coordinator at UT Austin. Our varsity team has been exploring structured coaching programs and GG Life came up in our research as a strong option.\n\nWe currently have 24 competitive players across Valorant, League of Legends, and Rocket League. We're particularly interested in:\n- Structured weekly coaching sessions\n- Performance analytics and VOD review\n- Mental performance coaching\n\nCould you share curriculum details, pricing tiers, and availability for a discovery call this or next week?\n\nBest,\nJordan Walsh\nEsports Coordinator, UT Austin`,
    time: '2m ago',
    channel: 'email',
    priority: 'urgent',
    tags: ['urgent', 'email'],
    intent: 'Partnership / Program Enrollment',
    sentiment: 'Positive 😊',
    urgency: 'High',
    segment: 'Collegiate Esports',
    draft: `Hi Jordan,\n\nThank you for reaching out — we're excited about the possibility of working with UT Austin's varsity program!\n\nBased on your team's profile, I'd recommend our Collegiate Tier, which includes weekly 1:1 coaching, VOD review curriculum, team analytics, and a dedicated program coordinator.\n\nTeams in similar programs have seen 23% improvement in ranked performance within 60 days.\n\nI have availability this Thursday 2–4 PM CT for a 20-minute discovery call. Does that work for you?\n\nWarm regards,\nThe GG Life Team`,
    read: false,
  },
  {
    id: 'inq-002',
    sender: 'Priya Sharma',
    email: 'priya@techstartup.io',
    subject: 'Re: Following up — pricing question (2nd attempt)',
    preview: 'Hi, I sent an email 4 days ago about your AI ops pricing but havent heard back...',
    body: `Hi,\n\nI sent an email 4 days ago about your AI operations consulting pricing for our 50-person startup, but haven't heard back.\n\nWe're actively evaluating vendors right now and need to make a decision by end of week. If I don't hear back today, I'll unfortunately have to go with a competitor.\n\nCan someone please respond?\n\nPriya Sharma\nHead of Operations, TechStartup.io`,
    time: '14m ago',
    channel: 'email',
    priority: 'urgent',
    tags: ['urgent', 'email'],
    intent: 'Sales / Pricing',
    sentiment: 'Frustrated 😤',
    urgency: 'Critical — 2nd attempt',
    segment: 'SaaS / Startup',
    draft: `Hi Priya,\n\nI sincerely apologize for the delayed response — this fell through our cracks and that's on us.\n\nFor a 50-person startup, our AI Operations package starts at $3,500/month and includes workflow automation, agentic operations setup, and a dedicated implementation engineer.\n\nI'd love to get on a call today to walk you through it. I have time at 2 PM and 4 PM CT — which works better?\n\nAgain, I'm sorry for the wait. We'll make this right.\n\nBest,\nNeoAistriq Team`,
    read: false,
  },
  {
    id: 'inq-003',
    sender: 'Marcus Chen',
    email: 'mchen@college.edu',
    subject: 'Chat transcript — Student wanting esports career guidance',
    preview: 'Hey, I saw your Discord post about the GG Life program. Im a junior CS student also streaming on Twitch...',
    body: `[Chat Transcript — 11:32 AM]\n\nMarcus: Hey, I saw your Discord post about the GG Life program. I'm a junior CS student and also streaming on Twitch. I want to pursue esports professionally but don't know where to start.\n\nMarcus: Do you have any coaching programs for individual players? Not a team, just me trying to improve and maybe get noticed by orgs?\n\nMarcus: Also what games do you cover? I main Valorant and Apex.\n\n[End of transcript — no response sent]`,
    time: '1h ago',
    channel: 'chat',
    priority: 'high',
    tags: ['high', 'chat'],
    intent: 'Individual Coaching Inquiry',
    sentiment: 'Enthusiastic 🎮',
    urgency: 'High',
    segment: 'Individual / Student',
    draft: `Hey Marcus!\n\nLove the hustle — combining CS with competitive gaming is a great combo.\n\nWe do have individual coaching programs! For Valorant and Apex players, we offer:\n- Weekly 1-hour coaching sessions (strategy + aim)\n- VOD review and replay analysis\n- Goal tracking toward ranked improvement\n\nPricing starts at $149/month for 2 sessions/week.\n\nWant to jump on a free 30-minute intro call this week? I can match you with a coach who specializes in both your games.\n\n— GG Life Team`,
    read: false,
  },
  {
    id: 'inq-004',
    sender: 'Rebecca Torres',
    email: 'rtorres@membership.org',
    subject: 'AI adoption consulting — membership org use case',
    preview: 'We run a 12,000-member professional association and want to explore AI for member engagement and...',
    body: `Hello,\n\nWe run a 12,000-member professional association and are interested in exploring AI for:\n1. Automated member onboarding emails\n2. AI-powered FAQ / member support chatbot\n3. Renewal retention flows\n\nWe've heard about NeoAistriq through a referral from Fractal KX. Could you share relevant case studies and a rough estimate for a discovery engagement?\n\nRebecca Torres\nDirector of Member Experience`,
    time: '2h ago',
    channel: 'email',
    priority: 'high',
    tags: ['high', 'email'],
    intent: 'AI Consulting / Project Inquiry',
    sentiment: 'Positive, warm referral 🤝',
    urgency: 'Medium-High',
    segment: 'Membership / Associations',
    draft: `Hi Rebecca,\n\nGreat to hear you came through the Fractal KX network!\n\nAll three use cases you mentioned are exactly in our wheelhouse. We've helped similar membership organizations reduce support tickets by 60% and improve renewal rates by 18% through targeted AI automation.\n\nI'd love to put together a short discovery deck for your specific use case. Can we schedule a 30-minute call this week?\n\nBest,\nNeoAistriq Team`,
    read: true,
  },
  {
    id: 'inq-005',
    sender: 'Dev Kumar',
    email: 'dev@saasproduct.com',
    subject: 'Product & AI Engineering — need a technical co-builder',
    preview: 'Building a B2B SaaS product, need help with AI feature development. Currently have...',
    body: `Hi NeoAistriq,\n\nI'm building a B2B SaaS product in the HR tech space and need a technical partner for AI feature development. Currently have:\n- Basic product in React/Node\n- ~200 beta users\n- A seed round closing next month\n\nLooking for: RAG implementation, AI-powered candidate matching, and workflow automation.\n\nTimeline: 3 months, budget around $40-60K.\n\nDev Kumar\nFounder, SaaSProduct.com`,
    time: '3h ago',
    channel: 'email',
    priority: 'medium',
    tags: ['medium', 'email'],
    intent: 'Product Engineering Partnership',
    sentiment: 'Positive, funded 💰',
    urgency: 'Medium',
    segment: 'SaaS / Startup',
    draft: `Hi Dev,\n\nThis is a great fit for our Product & AI Engineering service.\n\nRAG implementation + candidate matching + workflow automation — we've delivered all three for similar-stage startups. Our typical 3-month engagement for this scope runs $45-55K with a dedicated engineer and weekly delivery reviews.\n\nGiven your seed round timing, let's move quickly. Can we do a technical discovery call in the next 48 hours?\n\nBest,\nNeoAistriq Engineering Team`,
    read: true,
  },
  {
    id: 'inq-006',
    sender: 'Aisha Patel',
    email: 'aisha@education.org',
    subject: 'WhatsApp inquiry — AI tutoring program for K12',
    preview: 'Hi! Saw your profile on LinkedIn. Do you build AI tutoring tools? We work with 5 schools and...',
    body: `[WhatsApp - Aisha Patel]\n\nHi! Saw your profile on LinkedIn. Do you build AI tutoring tools? We work with 5 schools and want to pilot an AI homework assistant for students. Budget is around $20K for a 6-month pilot. Is this something NeoAistriq does?\n\n[No response sent — 4 hours elapsed]`,
    time: '4h ago',
    channel: 'chat',
    priority: 'medium',
    tags: ['medium', 'chat'],
    intent: 'EdTech / AI Tutoring',
    sentiment: 'Curious, warm 📚',
    urgency: 'Medium',
    segment: 'Education / K12',
    draft: `Hi Aisha!\n\nYes — AI-powered learning tools for K12 are definitely in our scope. We've built conversational learning assistants that adapt to student level and track comprehension over time.\n\nFor a 5-school, 6-month pilot at $20K, we can scope a solid MVP with core tutoring features.\n\nAre you free for a 20-minute call this week to align on requirements?\n\n— NeoAistriq`,
    read: true,
  },
  {
    id: 'inq-007',
    sender: 'Tom Bradley',
    email: 'tom@gaming.io',
    subject: 'Gaming community — want AI moderation for Discord',
    preview: 'Hey, we run a 15K member gaming Discord. Moderation is killing us. We need AI help...',
    body: `Hey,\n\nWe run a 15K member gaming Discord server and manual moderation is killing our team. We're looking for AI-powered moderation that can:\n- Auto-flag toxic messages\n- Detect ban evasion\n- Generate daily mod reports\n\nBudget: $800-1200/month SaaS-style.\n\nTom`,
    time: '5h ago',
    channel: 'email',
    priority: 'low',
    tags: ['low', 'email'],
    intent: 'Gaming / Community Tool',
    sentiment: 'Neutral, pain-driven 😤',
    urgency: 'Low',
    segment: 'Gaming / Esports Community',
    draft: `Hey Tom,\n\nAI Discord moderation is a common pain point in large gaming communities — we've seen it firsthand.\n\nWe can build a custom moderation pipeline (GPT-4 + Discord API) that covers all three use cases. At your scale, a $999/month retainer for hosting + updates is reasonable.\n\nWant a quick demo of what this looks like in action?\n\n— NeoAistriq`,
    read: true,
  },
];

const FEED_DATA = [
  { icon: '📧', sender: 'Jordan Walsh', preview: 'Esports coaching program interest — UT Austin...', time: '2m', priority: 'urgent' },
  { icon: '💬', sender: 'Marcus Chen', preview: 'Individual Valorant coaching query — Discord chat', time: '12m', priority: 'high' },
  { icon: '📧', sender: 'Priya Sharma', preview: '2nd attempt — pricing, going to competitor EOD', time: '14m', priority: 'urgent' },
  { icon: '📱', sender: 'Aisha Patel', preview: 'K12 AI tutoring pilot — $20k budget, 5 schools', time: '1h', priority: 'medium' },
  { icon: '📧', sender: 'Rebecca Torres', preview: 'Membership org AI adoption — referral from FKX', time: '2h', priority: 'high' },
];

const TRIAGE_HISTORY = [
  { channel: 'Email', preview: 'Want to cancel subscription, unhappy with delivery time', label: 'urgent', labelText: 'URGENT', time: '3m ago' },
  { channel: 'Chat', preview: 'What are your pricing tiers for the AI ops package?', label: 'high', labelText: 'HIGH', time: '11m ago' },
  { channel: 'WhatsApp', preview: 'Do you have a referral program? A friend told me about you', label: 'auto', labelText: 'AUTO-RESOLVED', time: '22m ago' },
  { channel: 'Instagram', preview: 'Love your content! How do I get started with GG Life coaching?', label: 'medium', labelText: 'MEDIUM', time: '41m ago' },
  { channel: 'Email', preview: 'Following up on our meeting — ready to sign contract', label: 'high', labelText: 'HIGH', time: '1h ago' },
  { channel: 'Chat', preview: 'What is your refund policy?', label: 'auto', labelText: 'AUTO-RESOLVED', time: '1.2h ago' },
];

const PRESETS = {
  esports: `Hi, I'm the esports coordinator at Arizona State University. Our varsity team (30 players across Valorant and Overwatch 2) is looking for a structured coaching and analytics program for the upcoming spring season. We've heard great things about GG Life. Could you send us curriculum details, pricing for collegiate teams, and availability for a call this week? We need to finalize vendors by Friday.`,
  missed: `Hello, I emailed your team 3 days ago about pricing for your AI customer service automation. I haven't received any response. We're a 200-person insurance company and this is a high priority initiative for us. Our decision timeline is end of this month. If I don't hear back in the next few hours, I'll need to go with another vendor. Please respond ASAP.`,
  pricing: `Hi NeoAistriq! I'm evaluating AI consulting firms for a 6-month engagement. We're a Series A SaaS company (HR tech, $2M ARR) looking to implement AI across sales, support, and operations. What does a typical engagement look like and what's the investment range? Happy to schedule a call.`,
  angry: `This is the THIRD time I'm reaching out. I've been waiting 5 days for a response to my support ticket. My integration is completely broken and it's costing us money every day. I want to speak to someone senior immediately or I'm disputing the charge and posting this experience publicly.`,
};

const TOPIC_DATA = [
  { label: 'Esports Coaching', size: 'xl', color: '#6366f1' },
  { label: 'Pricing', size: 'lg', color: '#22d3ee' },
  { label: 'AI Consulting', size: 'lg', color: '#a855f7' },
  { label: 'Onboarding', size: 'md', color: '#22c55e' },
  { label: 'Follow-up', size: 'md', color: '#f97316' },
  { label: 'Membership Orgs', size: 'md', color: '#6366f1' },
  { label: 'SaaS Build', size: 'sm', color: '#22d3ee' },
  { label: 'Refund', size: 'sm', color: '#ef4444' },
  { label: 'Demo Request', size: 'md', color: '#a855f7' },
  { label: 'EdTech', size: 'sm', color: '#22c55e' },
  { label: 'Discord Moderation', size: 'sm', color: '#f97316' },
  { label: 'Support', size: 'sm', color: '#8b8fa8' },
];

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderLiveFeed();
  renderInbox();
  renderTriageHistory();
  renderTopicCloud();
  renderFunnelChart();
  animateCounters();
  drawChannelDonut();
  drawVolumeChart();
  drawResponseChart();
  drawSentimentChart();
  startLiveSimulation();
});

// ── VIEW SWITCHING ─────────────────────────────────────────
function switchView(viewId, el) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const view = document.getElementById(`view-${viewId}`);
  if (view) view.classList.add('active');
  if (el) el.classList.add('active');

  const labels = {
    dashboard: 'Command Center',
    inbox: 'Unified Inbox',
    'ai-triage': 'AI Triage Engine',
    analytics: 'Analytics & Outcomes',
    esports: 'GG Life Esports',
    agents: 'Agent Console',
  };
  document.getElementById('breadcrumb').textContent = labels[viewId] || viewId;
  state.currentView = viewId;

  // Run view-specific init
  if (viewId === 'analytics') {
    setTimeout(() => {
      drawResponseChart();
      drawSentimentChart();
      drawVolumeChart();
    }, 100);
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ── COUNTER ANIMATION ──────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

// ── LIVE FEED ──────────────────────────────────────────────
function renderLiveFeed(extraItem = null) {
  const container = document.getElementById('liveFeed');
  if (!container) return;
  const items = extraItem ? [extraItem, ...FEED_DATA] : FEED_DATA;
  container.innerHTML = items.slice(0, 6).map(item => `
    <div class="feed-item" onclick="switchView('inbox', document.querySelector('[data-view=inbox]'))">
      <span class="feed-channel-icon">${item.icon}</span>
      <div class="feed-body">
        <div class="feed-sender">${item.sender}</div>
        <div class="feed-preview">${item.preview}</div>
      </div>
      <div class="feed-meta">
        <div class="feed-time">${item.time}</div>
        <div style="text-align:right"><span class="priority-dot ${item.priority}"></span></div>
      </div>
    </div>
  `).join('');
}

// ── INBOX ──────────────────────────────────────────────────
function renderInbox(filter = 'all') {
  const container = document.getElementById('inboxList');
  if (!container) return;

  let items = [...INBOX_DATA];
  if (filter === 'urgent') items = items.filter(i => i.priority === 'urgent');
  else if (filter === 'email') items = items.filter(i => i.channel === 'email');
  else if (filter === 'chat') items = items.filter(i => i.channel === 'chat');
  else if (filter === 'unread') items = items.filter(i => !i.read);

  container.innerHTML = items.map(item => `
    <div class="inbox-item ${!item.read ? 'unread' : ''}" id="inbox-${item.id}" onclick="selectInboxItem('${item.id}')">
      <div class="inbox-item-header">
        <div class="inbox-sender" style="display:flex;align-items:center;gap:6px;">
          ${!item.read ? '<span style="width:7px;height:7px;border-radius:50%;background:var(--accent);flex-shrink:0;display:inline-block;"></span>' : ''}
          ${item.sender}
        </div>
        <div class="inbox-time">${item.time}</div>
      </div>
      <div class="inbox-subject">${item.subject}</div>
      <div class="inbox-preview">${item.preview}</div>
      <div class="inbox-tags">
        ${item.tags.map(t => `<span class="inbox-tag tag-${t}">${t.toUpperCase()}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function selectInboxItem(id) {
  const item = INBOX_DATA.find(i => i.id === id);
  if (!item) return;

  document.querySelectorAll('.inbox-item').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById(`inbox-${id}`);
  if (el) el.classList.add('selected');

  item.read = true;
  state.selectedInboxItem = id;

  const detail = document.getElementById('inboxDetail');
  detail.innerHTML = `
    <div class="detail-view">
      <div class="detail-header">
        <div class="detail-subject">${item.subject}</div>
        <div class="detail-meta">
          <span><strong>From:</strong> ${item.sender} &lt;${item.email}&gt;</span>
          <span><strong>Channel:</strong> ${item.channel}</span>
          <span><strong>Received:</strong> ${item.time}</span>
        </div>
      </div>
      <div class="detail-body">${item.body.replace(/\n/g, '<br>')}</div>

      <div class="ai-analysis-panel">
        <div class="ai-panel-header">
          <span style="font-size:16px">🧠</span>
          <span class="ai-panel-title">AI Analysis</span>
        </div>
        <div class="ai-chips">
          <span class="ai-chip chip-intent">Intent: ${item.intent}</span>
          <span class="ai-chip chip-sentiment">Sentiment: ${item.sentiment}</span>
          <span class="ai-chip chip-urgency">Urgency: ${item.urgency}</span>
          <span class="ai-chip chip-segment">Segment: ${item.segment}</span>
        </div>
        <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">
          Recommended action: <strong style="color:var(--text-secondary)">Respond within 30 minutes — ${item.urgency.includes('Critical') ? 'critical retention risk' : item.priority === 'urgent' ? 'high-value lead' : 'standard follow-up'}</strong>
        </div>
      </div>

      <div class="ai-draft-section">
        <div class="ai-draft-header">
          <div class="ai-draft-title">✍️ AI Draft Response</div>
          <button class="btn btn-ghost btn-sm" onclick="regenerateDraft('${id}')">↻ Regenerate</button>
        </div>
        <textarea class="draft-textarea" id="draft-${id}" rows="8">${item.draft}</textarea>
        <div class="draft-actions">
          <button class="btn btn-ghost btn-sm" onclick="showToast('Draft saved to CRM', 'info')">Save Draft</button>
          <button class="btn btn-primary btn-sm" onclick="sendDraft('${id}')">
            Send Response →
          </button>
        </div>
      </div>
    </div>
  `;
}

function filterInbox(filter, el) {
  document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  state.inboxFilter = filter;
  renderInbox(filter);
}

function sendDraft(id) {
  const item = INBOX_DATA.find(i => i.id === id);
  showToast(`Response sent to ${item.email} ✓`, 'success');
  const el = document.getElementById(`inbox-${id}`);
  if (el) el.style.opacity = '0.5';
  setTimeout(() => { if (el) el.remove(); }, 500);
  document.getElementById('inboxDetail').innerHTML = `
    <div class="detail-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9l20-7z"/></svg>
      <p>Response sent successfully!</p>
    </div>
  `;
}

function regenerateDraft(id) {
  const el = document.getElementById(`draft-${id}`);
  if (el) {
    el.style.opacity = '0.5';
    el.value = 'Generating with AI...';
    setTimeout(() => {
      const item = INBOX_DATA.find(i => i.id === id);
      el.value = item.draft + '\n\nP.S. I\'d be happy to jump on a quick call today to answer any questions directly.';
      el.style.opacity = '1';
      showToast('Draft regenerated by AI ✓', 'success');
    }, 1200);
  }
}

// ── AI TRIAGE ──────────────────────────────────────────────
function setChannel(channel, el) {
  document.querySelectorAll('.ch-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  state.triageChannel = channel;
}

function loadPreset(key) {
  const textarea = document.getElementById('triageInput');
  if (textarea) {
    textarea.value = PRESETS[key] || '';
    textarea.focus();
  }
}

function analyzeInquiry() {
  const input = document.getElementById('triageInput');
  const text = input?.value?.trim();
  if (!text) { showToast('Please enter an inquiry to analyze', 'error'); return; }

  const placeholder = document.getElementById('triagePlaceholder');
  const output = document.getElementById('triageOutput');

  if (placeholder) placeholder.style.display = 'flex';
  if (output) output.style.display = 'none';

  // Simulate AI analysis
  setTimeout(() => {
    const analysis = classifyInquiry(text);
    if (placeholder) placeholder.style.display = 'none';
    if (output) {
      output.style.display = 'flex';
      output.innerHTML = renderTriageOutput(analysis);
    }

    // Add to history
    prependTriageHistory({
      channel: state.triageChannel.charAt(0).toUpperCase() + state.triageChannel.slice(1),
      preview: text.substring(0, 70) + '...',
      label: analysis.priority.toLowerCase().replace(' ', '-'),
      labelText: analysis.priority.toUpperCase(),
      time: 'Just now',
    });
    showToast('AI analysis complete ✓', 'success');
  }, 1400);
}

function classifyInquiry(text) {
  const lower = text.toLowerCase();

  let priority = 'Medium';
  let intent = 'General Inquiry';
  let sentiment = 'Neutral';
  let urgency = 50;
  let sentimentScore = 50;
  let route = 'Standard Queue';
  let summary = '';
  let action = '';

  // Urgency signals
  if (/competitor|cancel|dispute|never heard|3rd time|third time|going with another|urgent|asap|today|immediately/.test(lower)) {
    priority = 'Urgent'; urgency = 92; route = 'Immediate Escalation';
  } else if (/2nd attempt|second attempt|follow.?up|deadline|end of week|by friday|by monday/.test(lower)) {
    priority = 'High'; urgency = 78; route = 'Priority Response';
  } else if (/interested|exploring|looking for|would like|could you|can you/.test(lower)) {
    priority = 'High'; urgency = 65; route = 'Sales Queue';
  }

  // Intent
  if (/esports|coaching|gg life|varsity|competitive|valorant|league|apex|rocket league/.test(lower)) {
    intent = 'Esports Program Inquiry';
    summary = 'Prospect interested in GG Life esports coaching program. Collegiate or individual segment.';
    action = 'Route to GG Life team. Draft response with program details and call booking link.';
  } else if (/pricing|cost|how much|budget|rate|investment|scope/.test(lower)) {
    intent = 'Pricing / Sales';
    summary = 'Prospect requesting pricing information. Likely in evaluation phase comparing vendors.';
    action = 'Share pricing overview, offer discovery call, create urgency with limited onboarding slots.';
  } else if (/cancel|refund|broken|issue|problem|not working/.test(lower)) {
    intent = 'Support / Complaint';
    summary = 'Existing customer with a service issue or complaint. Risk of churn.';
    action = 'Escalate to senior support immediately. Acknowledge delay, offer resolution + goodwill.';
  } else if (/ai|automation|workflow|agentic|consulting|implement/.test(lower)) {
    intent = 'AI Consulting / Services';
    summary = 'Business prospect exploring AI consulting engagement. Likely B2B decision maker.';
    action = 'Qualify budget and timeline. Offer discovery call. Share relevant case study.';
  } else {
    intent = 'General Inquiry';
    summary = 'Standard inquiry requiring human review and routing.';
    action = 'Review and route to appropriate team. Respond within 2 hours.';
  }

  // Sentiment
  if (/love|excited|great|happy|amazing|thank you|appreciate/.test(lower)) {
    sentiment = 'Positive 😊'; sentimentScore = 82;
  } else if (/frustrated|annoyed|upset|never heard|never responded|going to competitor|dispute|public/.test(lower)) {
    sentiment = 'Frustrated / Negative 😤'; sentimentScore = 18;
  } else if (/interested|exploring|looking|curious/.test(lower)) {
    sentiment = 'Curious / Interested 🤔'; sentimentScore = 65;
  }

  return { priority, intent, sentiment, urgency, sentimentScore, route, summary, action };
}

function renderTriageOutput(a) {
  const priorityColor = a.priority === 'Urgent' ? 'var(--red)' : a.priority === 'High' ? 'var(--orange)' : 'var(--accent)';
  const sentColor = a.sentimentScore > 60 ? 'var(--green)' : a.sentimentScore < 40 ? 'var(--red)' : 'var(--orange)';

  return `
    <div class="output-section">
      <div class="output-label">Priority Classification</div>
      <div class="output-value" style="color:${priorityColor};font-size:20px;">${a.priority}</div>
    </div>
    <div class="output-section">
      <div class="output-label">Detected Intent</div>
      <div class="output-value">${a.intent}</div>
    </div>
    <div class="output-section">
      <div class="output-label">Urgency Score</div>
      <div class="score-bar"><div class="score-fill" style="width:${a.urgency}%;background:${priorityColor};"></div></div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${a.urgency}/100</div>
    </div>
    <div class="output-section">
      <div class="output-label">Sentiment</div>
      <div class="output-value">${a.sentiment}</div>
      <div class="score-bar"><div class="score-fill" style="width:${a.sentimentScore}%;background:${sentColor};"></div></div>
    </div>
    <div class="output-section">
      <div class="output-label">Routing Decision</div>
      <div class="output-value" style="color:var(--cyan);">${a.route}</div>
    </div>
    <div class="output-section">
      <div class="output-label">AI Summary</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.5;">${a.summary}</div>
    </div>
    <div class="output-section">
      <div class="output-label">Recommended Action</div>
      <div style="font-size:13px;color:var(--accent-light);line-height:1.5;padding:10px;background:rgba(99,102,241,0.08);border-radius:8px;border:1px solid rgba(99,102,241,0.15);">→ ${a.action}</div>
    </div>
    <button class="btn btn-primary full-width" onclick="showToast('Routed to ${a.route} queue ✓', 'success')" style="margin-top:4px;">
      Apply Routing Decision →
    </button>
  `;
}

function renderTriageHistory() {
  const container = document.getElementById('triageHistory');
  if (!container) return;
  container.innerHTML = TRIAGE_HISTORY.map(item => `
    <div class="history-item">
      <span class="history-channel">${item.channel}</span>
      <span class="history-preview">${item.preview}</span>
      <span class="history-label hl-${item.label}">${item.labelText}</span>
      <span class="history-time">${item.time}</span>
    </div>
  `).join('');
}

function prependTriageHistory(item) {
  const container = document.getElementById('triageHistory');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'history-item';
  el.innerHTML = `
    <span class="history-channel">${item.channel}</span>
    <span class="history-preview">${item.preview}</span>
    <span class="history-label hl-${item.label}">${item.labelText}</span>
    <span class="history-time">${item.time}</span>
  `;
  el.style.animation = 'feedSlide 0.3s ease';
  container.prepend(el);
}

function runTriageDemo() {
  loadPreset('missed');
  setTimeout(() => analyzeInquiry(), 300);
}

// ── ANALYTICS ─────────────────────────────────────────────
function renderFunnelChart() {
  const container = document.getElementById('funnelChart');
  if (!container) return;

  const steps = [
    { label: 'Inquiries Received', count: 247, pct: 100, color: '#6366f1' },
    { label: 'Opened / Responded', count: 232, pct: 94, color: '#22d3ee' },
    { label: 'Discovery Call Booked', count: 142, pct: 57, color: '#a855f7' },
    { label: 'Proposal Sent', count: 89, pct: 36, color: '#f97316' },
    { label: 'Converted to Customer', count: 76, pct: 31, color: '#22c55e' },
  ];

  container.innerHTML = steps.map(s => `
    <div class="funnel-step">
      <div class="funnel-label">${s.label}</div>
      <div class="funnel-bar-wrap">
        <div class="funnel-bar-fill" style="width:${s.pct}%;background:${s.color};">${s.pct}%</div>
      </div>
      <div class="funnel-count">${s.count}</div>
    </div>
  `).join('');
}

function renderTopicCloud() {
  const container = document.getElementById('topicCloud');
  if (!container) return;
  const sizeMap = { xl: '16px', lg: '14px', md: '12px', sm: '11px' };
  const padMap = { xl: '8px 20px', lg: '7px 16px', md: '6px 14px', sm: '5px 12px' };
  container.innerHTML = TOPIC_DATA.map(t => `
    <span class="topic-pill" style="font-size:${sizeMap[t.size]};padding:${padMap[t.size]};color:${t.color};border-color:${t.color}40;background:${t.color}15;">${t.label}</span>
  `).join('');
}

function updateAnalytics(days) {
  showToast(`Analytics updated for last ${days} days`, 'info');
}

// ── CANVAS CHARTS ──────────────────────────────────────────
function drawChannelDonut() {
  const canvas = document.getElementById('channelDonut');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 80, cy = 80, r = 60, inner = 38;
  const segments = [
    { pct: 0.41, color: '#6366f1' },
    { pct: 0.33, color: '#22d3ee' },
    { pct: 0.16, color: '#a855f7' },
    { pct: 0.10, color: '#f97316' },
  ];
  let angle = -Math.PI / 2;
  segments.forEach(s => {
    const sweep = s.pct * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + sweep);
    ctx.fillStyle = s.color;
    ctx.fill();
    angle += sweep;
  });
  // Center hole
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, 2 * Math.PI);
  ctx.fillStyle = '#181a28';
  ctx.fill();
  // Center text
  ctx.fillStyle = '#f0f0ff';
  ctx.font = 'bold 14px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('247', cx, cy - 4);
  ctx.fillStyle = '#8b8fa8';
  ctx.font = '10px Inter';
  ctx.fillText('total', cx, cy + 12);
}

function drawVolumeChart() {
  const canvas = document.getElementById('volumeChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 500, H = 160;
  canvas.width = W; canvas.height = H;

  const data = [12, 18, 9, 23, 15, 28, 19, 32, 21, 17, 35, 28, 42, 31];
  const max = Math.max(...data);
  const pad = { top: 20, bottom: 30, left: 20, right: 20 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const step = chartW / (data.length - 1);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  [0.25, 0.5, 0.75, 1].forEach(f => {
    const y = pad.top + chartH * (1 - f);
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
  });

  const points = data.map((v, i) => ({
    x: pad.left + i * step,
    y: pad.top + chartH * (1 - v / max),
  }));

  // Area gradient
  const grad = ctx.createLinearGradient(0, pad.top, 0, H);
  grad.addColorStop(0, 'rgba(99,102,241,0.3)');
  grad.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.beginPath();
  ctx.moveTo(points[0].x, H - pad.bottom);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, H - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const cp1x = (points[i - 1].x + points[i].x) / 2;
    ctx.bezierCurveTo(cp1x, points[i - 1].y, cp1x, points[i].y, points[i].x, points[i].y);
  }
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#6366f1';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
  });

  // X labels
  const labels = ['Oct 14', '', '', 'Oct 17', '', '', 'Oct 20', '', '', 'Oct 23', '', '', 'Oct 26', 'Oct 27'];
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px Inter';
  ctx.textAlign = 'center';
  points.forEach((p, i) => {
    if (labels[i]) ctx.fillText(labels[i], p.x, H - 8);
  });
}

function drawResponseChart() {
  const canvas = document.getElementById('responseChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400, H = 200;
  canvas.width = W; canvas.height = H;

  const bars = [
    { label: '< 2m', value: 35, color: '#22c55e' },
    { label: '2–5m', value: 28, color: '#6366f1' },
    { label: '5–15m', value: 18, color: '#22d3ee' },
    { label: '15–60m', value: 12, color: '#f97316' },
    { label: '> 1h', value: 7, color: '#ef4444' },
  ];

  const max = Math.max(...bars.map(b => b.value));
  const pad = { top: 20, bottom: 40, left: 10, right: 10 };
  const barW = (W - pad.left - pad.right) / bars.length * 0.6;
  const gap = (W - pad.left - pad.right) / bars.length;
  const chartH = H - pad.top - pad.bottom;

  bars.forEach((bar, i) => {
    const bh = (bar.value / max) * chartH;
    const x = pad.left + i * gap + (gap - barW) / 2;
    const y = pad.top + chartH - bh;

    // Bar
    ctx.fillStyle = bar.color + '30';
    ctx.fillRect(x, y, barW, bh);
    ctx.fillStyle = bar.color;
    ctx.fillRect(x, y, barW, 3);

    // Gradient
    const g = ctx.createLinearGradient(x, y, x, y + bh);
    g.addColorStop(0, bar.color + '80');
    g.addColorStop(1, bar.color + '10');
    ctx.fillStyle = g;
    ctx.fillRect(x, y + 3, barW, bh - 3);

    // Value
    ctx.fillStyle = '#f0f0ff';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(bar.value + '%', x + barW / 2, y - 6);

    // Label
    ctx.fillStyle = '#8b8fa8';
    ctx.font = '10px Inter';
    ctx.fillText(bar.label, x + barW / 2, H - 10);
  });
}

function drawSentimentChart() {
  const canvas = document.getElementById('sentimentChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400, H = 200;
  canvas.width = W; canvas.height = H;

  const posData = [62, 68, 71, 65, 74, 78, 72, 80, 76, 84, 82, 87, 91, 94];
  const neuData = [25, 22, 20, 24, 18, 16, 19, 14, 17, 12, 14, 10, 8, 5];
  const pad = { top: 20, bottom: 30, left: 20, right: 20 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const step = chartW / (posData.length - 1);

  function drawLine(data, color, fillColor) {
    const points = data.map((v, i) => ({ x: pad.left + i * step, y: pad.top + chartH * (1 - v / 100) }));
    const grad = ctx.createLinearGradient(0, pad.top, 0, H);
    grad.addColorStop(0, fillColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.moveTo(points[0].x, H - pad.bottom);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, H - pad.bottom);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cpx = (points[i - 1].x + points[i].x) / 2;
      ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawLine(posData, '#22c55e', 'rgba(34,197,94,0.2)');
  drawLine(neuData, '#f97316', 'rgba(249,115,22,0.1)');

  // Legend
  ctx.fillStyle = '#22c55e'; ctx.fillRect(pad.left, H - 20, 10, 10);
  ctx.fillStyle = '#8b8fa8'; ctx.font = '10px Inter';
  ctx.fillText('Positive', pad.left + 14, H - 11);
  ctx.fillStyle = '#f97316'; ctx.fillRect(pad.left + 80, H - 20, 10, 10);
  ctx.fillStyle = '#8b8fa8';
  ctx.fillText('Neutral/Neg', pad.left + 94, H - 11);
}

// ── SIMULATE INCOMING ──────────────────────────────────────
let simCount = 0;
const simItems = [
  { icon: '📱', sender: 'Tyler Rhodes', preview: 'Instagram DM: interested in esports coaching for my kid', time: 'now', priority: 'high' },
  { icon: '💬', sender: 'Leila Hassan', preview: 'WhatsApp: Need urgent help with AI chatbot integration', time: 'now', priority: 'urgent' },
  { icon: '📧', sender: 'Chris Park', preview: 'Email: Referral from GG Life Discord — want to sign up today', time: 'now', priority: 'high' },
];

function simulateIncoming() {
  const item = simItems[simCount % simItems.length];
  simCount++;
  renderLiveFeed(item);
  showToast(`New ${item.priority} inquiry from ${item.sender}`, item.priority === 'urgent' ? 'error' : 'info');
  // Update badge
  const badge = document.querySelector('[data-view="inbox"] .nav-badge');
  if (badge) badge.textContent = parseInt(badge.textContent) + 1;
}

function runAITriage() {
  switchView('ai-triage', document.querySelector('[data-view="ai-triage"]'));
  setTimeout(() => {
    loadPreset('esports');
    setTimeout(() => analyzeInquiry(), 300);
  }, 200);
}

function startLiveSimulation() {
  // Add live log entries to agents periodically
  const logs = {
    'log-triage': [
      '✓ Classified inquiry #2850 → High Priority / Esports',
      '✓ Auto-resolved #2849 → FAQ Match (hours of operation)',
      '⚡ Escalated #2848 → Critical / Churning customer',
    ],
    'log-draft': [
      '✓ Draft ready for #2850 — esports program response',
      '✓ Draft accepted (sent) to j.walsh@utexas.edu',
      '✓ Tone adjustment: formal → casual for #2847',
    ],
    'log-followup': [
      '✓ T+2 follow-up sent to priya@techstartup.io',
      '✓ Reactivated: dev@saasproduct.com replied',
      '⚡ Escalating #2830 → no reply in 4 days',
    ],
  };

  setInterval(() => {
    Object.entries(logs).forEach(([id, entries]) => {
      const container = document.getElementById(id);
      if (!container) return;
      const entry = entries[Math.floor(Math.random() * entries.length)];
      const el = document.createElement('div');
      el.className = 'log-entry';
      el.textContent = entry;
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.5s';
      container.prepend(el);
      setTimeout(() => el.style.opacity = '1', 50);
      const children = container.querySelectorAll('.log-entry');
      if (children.length > 5) children[children.length - 1].remove();
    });
  }, 4000);
}

// ── AGENT TOGGLE ───────────────────────────────────────────
function toggleAgent(name) {
  const current = state.agentStates[name];
  state.agentStates[name] = !current;
  const track = document.querySelector(`#agent-${name} .toggle-track`);
  const statusEl = document.querySelector(`#agent-${name} .agent-status`);
  if (track) {
    track.classList.toggle('on', !current);
    track.classList.toggle('off', current);
  }
  if (statusEl) {
    statusEl.textContent = !current ? '● Running' : '○ Paused';
    statusEl.style.color = !current ? 'var(--green)' : 'var(--text-muted)';
  }
  showToast(`${name.charAt(0).toUpperCase() + name.slice(1)} Agent ${!current ? 'activated' : 'paused'}`, !current ? 'success' : 'info');
}

// ── NOTIFICATIONS ──────────────────────────────────────────
function showNotifications() {
  showToast('3 new inquiries require attention — 1 urgent', 'error');
}

// ── TOAST ──────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  const icons = { success: '✓', error: '⚡', info: 'ℹ' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span style="font-size:16px">${icons[type] || 'ℹ'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
