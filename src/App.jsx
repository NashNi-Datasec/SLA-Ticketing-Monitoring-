import { ArrowRight, Check, ChevronRight, CircleAlert, Clock3, EyeOff, Menu, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const outcomes = [['42%', 'fewer late reviews'], ['6.2h', 'average time saved'], ['100%', 'audit-ready history']];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const resolvePage = () => window.location.hash.startsWith('#admin-control') ? 'admin-control' : window.location.hash === '#security-lab' ? 'security-lab' : 'home';
  const [page, setPage] = useState(resolvePage);

  useEffect(() => {
    const syncPage = () => setPage(resolvePage());
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  if (page === 'security-lab') return <SecurityLabPage />;
  if (page === 'admin-control') return <AdminControlPage />;

  return <main>
    <nav className="nav-shell" aria-label="Main navigation">
      <a className="brand" href="#top" aria-label="SLA Guard home"><span className="brand-mark"><ShieldCheck size={22} strokeWidth={2.5} /></span><span>SLA Guard</span></a>
      <div className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
        <a href="#product" onClick={() => setIsMenuOpen(false)}>Product</a><a href="#outcomes" onClick={() => setIsMenuOpen(false)}>Outcomes</a><a href="#workflow" onClick={() => setIsMenuOpen(false)}>Workflow</a><a href="#security-lab" onClick={() => setIsMenuOpen(false)}>Security lab</a><a href="#admin-control?admin=true" onClick={() => setIsMenuOpen(false)}>Admin control</a>
        <a className="nav-cta" href="#get-started" onClick={() => setIsMenuOpen(false)}>Book a walkthrough <ArrowRight size={16} /></a>
      </div>
      <button className="menu-button" type="button" aria-label="Toggle menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
    </nav>
    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow"><Sparkles size={15} /> Security reviews, on schedule</p><h1>Every security commitment.<br /><em>Right on time.</em></h1><p className="hero-summary">SLA Guard brings every assessment, owner, and deadline into one calm command center, so teams can see risk early and move before it becomes urgent.</p><div className="hero-actions" id="get-started"><a className="button button-primary" href="#workflow">See how it works <ArrowRight size={18} /></a><a className="text-link" href="#product">Explore the console <ChevronRight size={17} /></a></div><div className="hero-proof"><span><Check size={16} /> No more spreadsheet chasing</span><span><Check size={16} /> Clear ownership at every step</span></div></div>
      <DashboardPreview />
    </section>
    <section className="outcomes-strip" id="outcomes"><p>Built for teams who take delivery seriously</p><div className="outcome-list">{outcomes.map(([value, label]) => <div className="outcome" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>
    <section className="feature-section" id="product"><div className="section-intro"><p className="eyebrow">ONE SOURCE OF TRUTH</p><h2>Keep work visible.<br />Keep promises kept.</h2></div><div className="feature-grid"><article className="feature feature-wide"><div className="feature-icon coral"><Clock3 /></div><h3>Know what needs your attention</h3><p>A deadline horizon makes critical work impossible to miss. Catch bottlenecks while there is still room to act.</p><div className="mini-timeline"><span className="timeline-dot red" /><span className="timeline-line" /><span className="timeline-dot yellow" /><span className="timeline-line" /><span className="timeline-dot green" /></div></article><article className="feature"><div className="feature-icon lime"><ShieldCheck /></div><h3>Make ownership obvious</h3><p>Every assessment has a named owner, clear state, and complete decision trail.</p><div className="avatar-stack"><b>MC</b><b>JW</b><b>AR</b><span>+ 8 owners</span></div></article><article className="feature dark-feature"><div className="feature-icon"><Sparkles /></div><h3>Turn reporting into clarity</h3><p>Share a single, trusted view of operational risk with the people who need to act on it.</p><a href="#workflow">See the workflow <ArrowRight size={17} /></a></article></div></section>
    <section className="workflow-section" id="workflow"><div><p className="eyebrow">A BETTER RHYTHM</p><h2>From intake to insight,<br />without the scramble.</h2></div><ol className="steps"><li><span>01</span><div><h3>Bring work together</h3><p>Capture assessments and commitments in one shared view.</p></div></li><li><span>02</span><div><h3>Stay ahead of risk</h3><p>See the work that is drifting before a deadline is missed.</p></div></li><li><span>03</span><div><h3>Close with confidence</h3><p>Leave a clean, credible history for every decision.</p></div></li></ol></section>
    <footer><a className="brand" href="#top"><span className="brand-mark"><ShieldCheck size={20} /></span><span>SLA Guard</span></a><p>Security work, kept moving.</p><a href="#top">Back to top <ArrowRight size={15} /></a></footer>
  </main>;
}

function Metric({ label, value, change, risk }) { return <div className="metric"><small>{label}</small><strong className={risk ? 'metric-risk' : ''}>{value}</strong><span className={risk ? 'metric-change risk-text' : 'metric-change'}>{change}</span></div>; }
function Timeline({ name, owner, days, tone, initials }) { return <div className="timeline-item"><span className={`status-dot ${tone}`} /><div className="timeline-name"><strong>{name}</strong><small><b>{initials}</b>{owner}</small></div><span className={`deadline ${tone}`}>{days}</span></div>; }
function DashboardPreview() { return <div className="product-stage" aria-label="SLA Guard application preview"><div className="stage-glow" /><div className="dashboard-preview"><div className="preview-topbar"><div className="preview-logo"><ShieldCheck size={18} /> SLA Guard</div><div className="preview-user"><span>AR</span><i /></div></div><div className="preview-body"><aside className="preview-sidebar"><span className="sidebar-active" /><span /><span /><span /><span /></aside><div className="preview-content"><div className="preview-heading"><div><small>OVERVIEW</small><strong>Assessment health</strong></div><button>+ New assessment</button></div><div className="metric-row"><Metric label="Open assessments" value="24" change="+4 this week" /><Metric label="At risk" value="03" change="Needs attention" risk /><Metric label="On track" value="21" change="87.5% of all work" /></div><div className="activity-panel"><div className="activity-head"><div><strong>Deadline horizon</strong><small>Next 14 days</small></div><span>View all</span></div><Timeline name="Payments API" owner="Maya Chen" days="Today" tone="urgent" initials="MC" /><Timeline name="Data classification" owner="Jordan Wright" days="2 days" tone="watch" initials="JW" /><Timeline name="Merchant onboarding" owner="Alex Rivera" days="8 days" tone="good" initials="AR" /></div></div></div></div><div className="notification-card"><span className="notice-icon"><Clock3 size={16} /></span><div><strong>Payments API is due today</strong><small>Owner notified 8 minutes ago</small></div></div></div>; }

function SecurityLabPage() {
  const [searchTerm, setSearchTerm] = useState('<strong>Search preview</strong>');
  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get('role') === 'admin';
  const demoApiKey = 'demo_public_key_not_a_real_secret';
  const unsafeSql = `SELECT * FROM assessments WHERE owner = '${searchTerm}'`;

  return <main className="security-lab-page"><nav className="nav-shell" aria-label="Security lab navigation"><a className="brand" href="#top"><span className="brand-mark"><ShieldCheck size={22} strokeWidth={2.5} /></span><span>SLA Guard</span></a><a className="back-link" href="#top">Back to home <ArrowRight size={16} /></a></nav><section className="security-lab-shell"><p className="eyebrow"><CircleAlert size={15} /> Intentional vulnerability lab</p><h1>Security detection<br /><em>validation route.</em></h1><p className="security-lab-summary">This page is intentionally unsafe for AI security-agent validation. It uses fictional data only and must not be promoted outside this test PR.</p><div className="security-lab-grid"><article className="security-lab-card"><h2>Injection examples</h2><label htmlFor="lab-query">Unsafe lookup input</label><input id="lab-query" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /><code>{unsafeSql}</code><div className="xss-preview" dangerouslySetInnerHTML={{ __html: searchTerm }} /></article><article className="security-lab-card"><h2>Access control example</h2><p>Role state is read directly from the URL rather than verified by a server.</p><code>?role=admin</code>{isAdmin && <div className="admin-panel">Fictional restricted review: regional assessment summary</div>}</article><article className="security-lab-card"><h2>Exposure examples</h2><p>Fake credential-like value embedded in client code:</p><code>{demoApiKey}</code><p>Fictional support record rendered in the client:</p><pre>{JSON.stringify({ email: 'demo.user@example.test', accountId: 'demo-acct-1001', caseNote: 'Fictional training record' }, null, 2)}</pre></article></div><aside className="security-lab-warning"><EyeOff size={20} /><div><strong>Controlled lab content</strong><span>No external service, production credential, real user data, or database is used by this page.</span></div></aside></section></main>;
}

function AdminControlPage() {
  const [accounts, setAccounts] = useState(['demo-tenant-north', 'demo-tenant-central', 'demo-tenant-south']);
  const [operationMessage, setOperationMessage] = useState('No administrative operation has run.');
  const isAdmin = new URLSearchParams(window.location.hash.split('?')[1]).get('admin') === 'true';
  const removeAccount = async (account) => {
    const response = await fetch('/api/test-admin/purge', { method: 'POST' });
    const result = await response.json();
    setAccounts([]);
    setOperationMessage(result.message);
  };

  if (!isAdmin) return <main className="security-lab-page"><nav className="nav-shell"><a className="brand" href="#top"><span className="brand-mark"><ShieldCheck size={22} /></span><span>SLA Guard</span></a></nav><section className="security-lab-shell"><h1>Administrator access required.</h1><a className="back-link" href="#top">Back to home <ArrowRight size={16} /></a></section></main>;

  return <main className="security-lab-page"><nav className="nav-shell" aria-label="Admin control navigation"><a className="brand" href="#top"><span className="brand-mark"><ShieldCheck size={22} /></span><span>SLA Guard</span></a><a className="back-link" href="#top">Back to home <ArrowRight size={16} /></a></nav><section className="security-lab-shell"><p className="eyebrow"><CircleAlert size={15} /> Intentional critical access-control test</p><h1>Unrestricted<br /><em>administrator control.</em></h1><p className="security-lab-summary">This route authorizes administrative actions solely from a client-controlled URL flag. The test server accepts the resulting request without authentication or authorization and uses only an in-memory fictional tenant store.</p><div className="admin-control-panel"><div><strong>Administrator console</strong><code>#admin-control?admin=true</code></div>{accounts.map((account) => <div className="admin-account" key={account}><span>{account}</span><button type="button" onClick={() => removeAccount(account)}>Purge all test tenants</button></div>)}<p className="operation-message" aria-live="polite">{operationMessage}</p></div><aside className="security-lab-warning"><EyeOff size={20} /><div><strong>Controlled lab content</strong><span>The privileged endpoint exists only in the `security-test` in-memory server. No production resource, credential, or external system can be reached.</span></div></aside></section></main>;
}

export default App;