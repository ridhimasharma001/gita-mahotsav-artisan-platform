import { useMemo, useState } from 'react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight,
  Copy, MapPin, MessageCircle, Phone, Search, Share2, X, Printer,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { artisans, categories, getArtisan, type Artisan } from './artisan_data';

function Header() {
  const [location] = useLocation();
  return <header className="topbar">
    <Link href="/" className="brand" data-testid="link-home">
      <span className="brand-mark">M</span>
      <span className="brand-name">mahotsav<span>.</span></span>
    </Link>
    <nav className="nav-links" aria-label="Main navigation">
      <Link href="/" className={location === '/' ? 'active' : ''} data-testid="link-discover">Discover</Link>
      <Link href="/admin" className={`nav-organizer ${location === '/admin' ? 'active' : ''}`} data-testid="link-organizer">For organizers</Link>
    </nav>
  </header>;
}

function Footer() {
  return <footer className="footer"><span>MAHOTSAV CRAFTS &nbsp;·&nbsp; Made by hand, remembered for generations.</span><span>Meet the maker. Carry the story.</span></footer>;
}

function Home() {
  const [category, setCategory] = useState('All crafts');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => artisans.filter((artisan) => {
    const matchesCategory = category === 'All crafts' || artisan.category === category;
    const searchText = `${artisan.name} ${artisan.craft} ${artisan.category} ${artisan.origin} ${artisan.stallNumber}`.toLowerCase();
    return matchesCategory && searchText.includes(query.toLowerCase().trim());
  }), [category, query]);
  return <div className="app-shell">
    <Header />
    <main className="home-main">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">A fair full of living traditions</div>
          <h1>Find the hands<br />behind the <em>craft.</em></h1>
          <p>Meet the makers carrying India’s craft traditions forward. Find their stalls, hear their stories, and take home something with a soul.</p>
        </div>
        <div className="hero-art">
          <img src="/phulkari.jpg" alt="A maker stitching vivid phulkari embroidery by hand" />
          <div className="hero-note">THREADS THAT HOLD A STORY</div>
          <div className="hero-stamp">MADE<br />BY HAND</div>
        </div>
      </section>
      <section className="directory-section" aria-labelledby="directory-heading">
        <div className="section-head">
          <div><h2 id="directory-heading">Meet the makers</h2><p>Find your next favourite thing, and the person who made it.</p></div>
          <label className="search-box"><Search size={18} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a maker, craft or place" aria-label="Search makers" data-testid="input-search" /></label>
        </div>
        <div className="filter-row" role="group" aria-label="Filter by craft">
          {categories.map((item) => <button key={item} className={`filter-pill ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)} aria-pressed={category === item} data-testid={`filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}
        </div>
        <div className="artisan-grid" data-testid="artisan-directory">
          {filtered.map((artisan) => <ArtisanCard key={artisan.id} artisan={artisan} />)}
          {filtered.length === 0 && <div className="empty-state"><strong>No makers found just yet.</strong>Try another name or choose a different craft.</div>}
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}

function ArtisanCard({ artisan }: { artisan: Artisan }) {
  return <Link href={`/artisan/${artisan.id}`} className="artisan-card" data-testid={`card-artisan-${artisan.id}`}>
    <div className="card-image"><img src={artisan.coverImage} alt={`${artisan.craft} by ${artisan.name}`} /><span className="craft-tag">{artisan.craft}</span></div>
    <div className="card-body">
      <div className="card-title-row"><h3 data-testid={`text-artisan-name-${artisan.id}`}>{artisan.name}</h3><span className="stall-mini">STALL {artisan.stallNumber}</span></div>
      <div className="artisan-meta"><MapPin size={14} />{artisan.origin}</div>
      <div className="card-footer"><span>Meet the maker <ArrowUpRight size={14} /></span><span>{artisan.category}</span></div>
    </div>
  </Link>;
}

function useToastMessage() {
  const [message, setMessage] = useState('');
  const show = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2600);
  };
  return { message, show };
}

function Toast({ message }: { message: string }) {
  return message ? <div className="toast-message" role="status" data-testid="status-toast">{message}</div> : null;
}

function Profile({ params }: { params: { id?: string } }) {
  const artisan = params.id ? getArtisan(params.id) : undefined;
  const [expanded, setExpanded] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const { message, show } = useToastMessage();
  if (!artisan) return <div className="app-shell"><Header /><main className="profile-main"><Link className="back-link" href="/"><ArrowLeft size={16} /> Back to makers</Link><div className="empty-state"><strong>We couldn’t find this maker.</strong>The fair is always adding new stories. Head back to the directory to explore.</div></main></div>;
  const profileUrl = `${window.location.origin}/#/artisan/${artisan.id}`;
  const waUrl = `https://wa.me/${artisan.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi! I saw your stall at Gita Mahotsav and want to inquire about your products: ${profileUrl}`)}`;
  const downloadVcf = () => {
    const escapeVCard = (value: string) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${escapeVCard(artisan.name)}\nTEL;TYPE=CELL:${escapeVCard(artisan.phone)}\nORG:${escapeVCard(artisan.craft)}\nADR:;;${escapeVCard(artisan.origin)};;;;\nNOTE:Stall ${escapeVCard(artisan.stallNumber)} · Mahotsav Crafts\nEND:VCARD`;
    const url = URL.createObjectURL(new Blob([vcf], { type: 'text/vcard;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${artisan.name.toLowerCase().replaceAll(' ', '-')}.vcf`; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    show('Contact card downloaded');
  };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: `${artisan.name} · Mahotsav Crafts`, text: `Meet ${artisan.name}, ${artisan.craft} from ${artisan.origin}.`, url: profileUrl });
      else { await navigator.clipboard.writeText(profileUrl); show('Profile link copied to clipboard'); }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      try { await navigator.clipboard.writeText(profileUrl); show('Profile link copied to clipboard'); }
      catch { show('Copy this profile link: ' + profileUrl); }
    }
  };
  const moveViewer = (direction: number) => setViewerIndex((current) => current === null ? null : (current + direction + artisan.products.length) % artisan.products.length);
  return <div className="app-shell">
    <Header />
    <main className="profile-main">
      <Link className="back-link" href="/" data-testid="link-back-directory"><ArrowLeft size={16} /> All makers</Link>
      <section className="profile-banner">
        <div className="profile-photo">
          <img className="profile-cover" src={artisan.coverImage} alt={`${artisan.craft} cover`} data-testid={`img-profile-cover-${artisan.id}`} />
          <div className="profile-avatar-wrap"><img className="profile-avatar" src={artisan.profileImage} alt={`Portrait of ${artisan.name}`} data-testid={`img-profile-photo-${artisan.id}`} /></div>
        </div>
        <div className="profile-info">
          <div className="eyebrow">{artisan.category} · stall {artisan.stallNumber}</div>
          <h1 data-testid={`text-profile-name-${artisan.id}`}>{artisan.name}</h1>
          <div className="profile-craft">{artisan.craft}</div>
          <div className="location-line"><MapPin size={15} />{artisan.origin}</div>
          <p className="profile-blurb">Thoughtful work, made by hand. Come meet {artisan.name.split(' ')[0]} and discover the care behind every detail.</p>
          <div className="action-row">
            <a className="action-btn primary" href={waUrl} target="_blank" rel="noreferrer" data-testid="action-whatsapp"><MessageCircle size={16} /> WhatsApp</a>
            <a className="action-btn" href={`tel:${artisan.phone}`} data-testid="action-call"><Phone size={15} /> Call</a>
            <button className="action-btn" onClick={downloadVcf} data-testid="action-save-contact"><Copy size={15} /> Save contact</button>
            <button className="action-btn" onClick={share} data-testid="action-share"><Share2 size={15} /> Share</button>
          </div>
        </div>
      </section>
      <section className="story-block">
        <div className="story-label">The maker’s story</div>
        <div className="story-content"><h2>A tradition, carried by hand.</h2><p>{expanded ? artisan.story : `${artisan.story.slice(0, 172)}${artisan.story.length > 172 ? '…' : ''}`}</p>
          {artisan.story.length > 172 && <button className="text-action" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} data-testid="button-story-expand">{expanded ? 'Show less' : 'Read the full story'}</button>}
        </div>
      </section>
      <section>
        <div className="gallery-heading"><h2 className="gallery-title">Made with care</h2><span>{artisan.products.length} pieces from the workshop</span></div>
        <div className="gallery-grid">{artisan.products.map((product, index) => <button key={product.name} className="gallery-tile" onClick={() => setViewerIndex(index)} aria-label={`View ${product.name}`} data-testid={`button-product-${index}`}><img src={product.image} alt={product.name} /><span className="sr-only">{product.name}</span></button>)}</div>
      </section>
    </main>
    <Footer />
    <Toast message={message} />
    {viewerIndex !== null && <div className="viewer" role="dialog" aria-modal="true" aria-label="Product image viewer" onClick={(event) => { if (event.target === event.currentTarget) setViewerIndex(null); }} data-testid="modal-image-viewer">
      <button className="viewer-close" onClick={() => setViewerIndex(null)} aria-label="Close image viewer" data-testid="button-close-viewer"><X size={21} /></button>
      <button className="viewer-prev" onClick={() => moveViewer(-1)} aria-label="Previous image" data-testid="button-viewer-previous"><ChevronLeft /></button>
      <img src={artisan.products[viewerIndex].image} alt={artisan.products[viewerIndex].name} />
      <button className="viewer-next" onClick={() => moveViewer(1)} aria-label="Next image" data-testid="button-viewer-next"><ChevronRight /></button>
      <div className="sr-only">{artisan.products[viewerIndex].name}</div>
    </div>}
  </div>;
}

type StallForm = { name: string; id: string; phone: string; stallNumber: string };
const blankForm: StallForm = { name: '', id: '', phone: '', stallNumber: '' };
function Admin() {
  const [form, setForm] = useState<StallForm>(blankForm);
  const [saved, setSaved] = useState<StallForm>({ name: 'Harjit Kaur', id: '101', phone: '+91 98720 45136', stallNumber: 'A-12' });
  const [notice, setNotice] = useState('');
  const update = (key: keyof StallForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(form);
    setNotice('Stall card details updated');
    window.setTimeout(() => setNotice(''), 2600);
  };
  const destination = `${window.location.origin}/#/artisan/${encodeURIComponent(saved.id || '101')}`;
  return <div className="app-shell">
    <Header />
    <main className="admin-main">
      <div className="admin-heading"><div className="eyebrow">A fair, made easier</div><h1>Stall card studio</h1><p>Create a simple card that takes visitors straight to an artisan’s story.</p></div>
      <div className="admin-layout">
        <form className="form-panel" onSubmit={submit}>
          <p className="panel-kicker">Card details</p>
          <Field label="Artisan name" value={form.name} onChange={(value) => update('name', value)} placeholder="e.g. Harjit Kaur" testId="input-admin-name" />
          <Field label="Artisan ID" value={form.id} onChange={(value) => update('id', value)} placeholder="e.g. 101" testId="input-admin-id" />
          <Field label="Phone number" value={form.phone} onChange={(value) => update('phone', value)} placeholder="+91 98765 43210" testId="input-admin-phone" type="tel" />
          <Field label="Stall number" value={form.stallNumber} onChange={(value) => update('stallNumber', value)} placeholder="e.g. A-12" testId="input-admin-stall" />
          <button className="form-submit" type="submit" data-testid="button-update-card">Update card preview</button>
          {notice && <p role="status" className="admin-hint" data-testid="status-admin">{notice}</p>}
        </form>
        <section className="preview-panel" aria-label="Printable stall card preview">
          <div className="preview-top"><h2>Live card preview</h2><span className="live-tag"><Check size={12} /> ready to print</span></div>
          <div className="stall-card" data-testid="stall-card">
            <div className="stall-logo">MAHOTSAV CRAFTS</div>
            <div className="stall-kicker">Meet the maker</div>
            <div className="stall-name" data-testid="text-card-artisan">{saved.name || 'Artisan name'}</div>
            <div className="stall-craft">Handmade, with a story to tell</div>
            <div className="stall-rule" />
            <div className="qr-frame"><QRCodeSVG value={destination} size={512} level="H" marginSize={2} title={`QR code linking to artisan ${saved.id}`} data-testid="img-stall-qr" /></div>
            <div className="scan-copy">Scan to meet the maker &amp; discover their craft</div>
            <div className="stall-number">FIND US · STALL {saved.stallNumber || '—'}</div>
            <div className="stall-url">{destination}</div>
          </div>
          <div className="print-action"><button onClick={() => window.print()} data-testid="button-print-card"><Printer size={16} /> Print / save card</button></div>
          <p className="admin-hint">Designed for a 4 × 6 inch card. Choose “Save as PDF” in the print dialog to keep a digital copy.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>;
}

function Field({ label, value, onChange, placeholder, testId, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; testId: string; type?: string }) {
  return <div className="field"><label htmlFor={testId}>{label}</label><input id={testId} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required data-testid={testId} /></div>;
}

function NotFound() {
  return <div className="app-shell"><Header /><main className="profile-main"><div className="empty-state"><strong>This page has wandered off.</strong><Link href="/" className="back-link">Return to the fair <ArrowRight size={15} /></Link></div></main></div>;
}

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/artisan/:id" component={Profile} />
    <Route path="/admin" component={Admin} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return <WouterRouter hook={useHashLocation}><Router /></WouterRouter>;
}

export default App;
