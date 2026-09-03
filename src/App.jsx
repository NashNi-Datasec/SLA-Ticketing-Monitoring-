import { ArrowRight, Check, ChevronRight, CircleAlert, Clock3, EyeOff, Menu, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const outcomes = [['42%', 'fewer late reviews'], ['6.2h', 'average time saved'], ['100%', 'audit-ready history']];
const promiseCards = [
  ['Detect drift early', 'SLA Guard highlights commitments that are moving toward breach before they become emergency work.'],
  ['Coordinate owners', 'Every assessment shows the accountable person, review state, and next operational handoff.'],
  ['Prove the trail', 'Exportable history keeps reviews, decisions, and evidence easy to explain when audit season arrives.'],
];

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

  return <main className="landing-page">
    <nav className="nav-shell" aria-label="Main navigation">
      <a className="brand" href="#top" aria-label="SLA Guard home"><span className="brand-mark"><ShieldCheck size={22} strokeWidth={2.5} /></span><span>SLA Guard</span></a>
      <div className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
        <a href="#platform" onClick={() => setIsMenuOpen(false)}>Platform</a><a href="#outcomes" onClick={() => setIsMenuOpen(false)}>Outcomes</a><a href="#workflow" onClick={() => setIsMenuOpen(false)}>Workflow</a><a href="#security-lab" onClick={() => setIsMenuOpen(false)}>Security lab</a><a href="#admin-control?admin=true" onClick={() => setIsMenuOpen(false)}>Admin control</a>
        <a className="nav-cta" href="#get-started" onClick={() => setIsMenuOpen(false)}>Book a walkthrough <ArrowRight size={16} /></a>
      </div>
      <button className="menu-button" type="button" aria-label="Toggle menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
    </nav>
    <section className="launch-hero" id="top">
      <div className="launch-copy"><p className="eyebrow launch-kicker"><Sparkles size={15} /> Continuous SLA command center</p><h1>SLA Guard keeps security reviews moving before deadlines get loud.</h1><p className="launch-summary">A focused operating view for security teams who need every assessment, evidence request, and owner commitment visible in one place.</p><div className="launch-actions" id="get-started"><a className="button button-primary" href="#workflow">Map the workflow <ArrowRight size={18} /></a><a className="text-link" href="#platform">View platform signals <ChevronRight size={17} /></a></div><div className="launch-trust-row"><span><Check size={16} /> Audit-ready history</span><span><Check size={16} /> Owner-level accountability</span><span><Check size={16} /> Risk-first queueing</span></div></div>
      <div className="launch-board" aria-label="SLA Guard operating board preview"><div className="launch-board-header"><span><ShieldCheck size={18} /> SLA Guard Ops</span><strong>Live queue</strong></div><div className="launch-risk-card"><small>At-risk commitment</small><strong>Payments API evidence review</strong><span>Due today · owner notified · escalation prepared</span></div><div className="launch-queue"><div><b>03</b><span>needs action</span></div><div><b>21</b><span>on track</span></div><div><b>08</b><span>owners active</span></div></div><div className="launch-row launch-row-hot"><span />Vendor attestation overdue<em>2h</em></div><div className="launch-row"><span />Data classification review<em>2d</em></div><div className="launch-row"><span />Merchant onboarding checks<em>8d</em></div></div>
    </section>
    <section className="launch-strip" id="outcomes"><p>Measured impact for teams that cannot afford quiet drift</p><div className="outcome-list">{outcomes.map(([value, label]) => <div className="outcome" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>
    <section className="launch-platform" id="platform"><div className="section-intro"><p className="eyebrow">PLATFORM SIGNALS</p><h2>Everything that can slip,<br />shown while it can still be saved.</h2></div><div className="launch-modules">{promiseCards.map(([title, detail]) => <article className="launch-module" key={title}><span><ShieldCheck size={18} /></span><h3>{title}</h3><p>{detail}</p></article>)}</div></section>
    <section className="launch-command" id="workflow"><div><p className="eyebrow">OPERATING RHYTHM</p><h2>Intake, triage, evidence, close.</h2><p>Use one queue to align reviewers, owners, and deadlines without waiting for status meetings to reveal what drifted.</p></div><ol className="steps"><li><span>01</span><div><h3>Capture the commitment</h3><p>Log the assessment, promised date, owner, and evidence request.</p></div></li><li><span>02</span><div><h3>Escalate by signal</h3><p>Prioritize work by risk, due date, and blocked ownership.</p></div></li><li><span>03</span><div><h3>Close with context</h3><p>Keep a clear record of the decision and what changed.</p></div></li></ol></section>
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