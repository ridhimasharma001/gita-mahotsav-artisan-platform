import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowUpRight, ImagePlus, LogOut, MapPin, Plus, Save, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, type Control, type FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Artisan } from '../artisan_data';
import '../artisan-account.css';

export type ArtisanListingInput = Omit<Artisan, 'id'>;
export type MyShopPageProps = {
  currentListing: Artisan | null;
  isLoading: boolean;
  isSaving: boolean;
  error?: string | null;
  onSubmit: (listing: ArtisanListingInput) => void | Promise<void>;
  onSignOut: () => void | Promise<void>;
};

const emptyListing: ArtisanListingInput = {
  name: '', craft: '', category: '', origin: '', stallNumber: '', phone: '',
  story: '', coverImage: '', profileImage: '', products: [],
};

const optionalImageUrl = z.string().trim().max(2048).refine(
  (value) => !value || /^https?:\/\//i.test(value),
  'Use a complete image URL beginning with http:// or https://.',
);
const listingFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(120),
  craft: z.string().trim().min(1, 'Describe your craft.').max(120),
  category: z.string().trim().min(1, 'Enter a craft category.').max(80),
  origin: z.string().trim().min(1, 'Enter where your work is made.').max(120),
  stallNumber: z.string().trim().max(40),
  phone: z.string().trim().min(1, 'Enter a contact number.').max(40),
  story: z.string().trim().max(3000),
  coverImage: optionalImageUrl,
  profileImage: optionalImageUrl,
  products: z.array(z.object({
    name: z.string().trim().max(120),
    image: optionalImageUrl,
  })).max(12, 'You can add up to 12 pieces.'),
});

export function MyShopPage({ currentListing, isLoading, isSaving, error, onSubmit, onSignOut }: MyShopPageProps) {
  const [savedNotice, setSavedNotice] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const form = useForm<ArtisanListingInput>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: emptyListing,
  });
  const { reset } = form;
  const listing = form.watch();
  const { fields: productFields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  });

  useEffect(() => {
    if (currentListing) {
      const { id: _id, ...fields } = currentListing;
      reset(fields);
    } else if (!isLoading) {
      reset(emptyListing);
    }
  }, [currentListing, isLoading, reset]);

  const submit = form.handleSubmit(async (values) => {
    setSavedNotice(false);
    setSubmitError('');
    const normalized = {
      ...values,
      products: values.products.filter((product) => product.name.trim()),
    };
    try {
      await onSubmit(normalized);
      reset(normalized);
      setSavedNotice(true);
    } catch (caught) {
      setSubmitError(caught instanceof Error ? caught.message : 'Your shop could not be saved. Please try again.');
    }
  });

  return (
    <main className="account-page shop-page">
      <header className="account-topbar">
        <Link href="/" className="account-brand" aria-label="Mahotsav Crafts home"><span className="account-brand-mark">M</span><span>mahotsav<span className="account-brand-dot">.</span></span></Link>
        <div className="shop-top-actions"><Link href="/" className="account-back-link"><ArrowLeft size={16} /> Return to the fair</Link><button className="shop-signout" type="button" onClick={() => void onSignOut()} data-testid="button-sign-out"><LogOut size={16} /> Sign out</button></div>
      </header>

      <div className="shop-shell">
        <div className="shop-heading">
          <div>
            <span className="account-eyebrow"><span /> YOUR MAKER PAGE</span>
            <h1>{currentListing ? 'Tend to your shop.' : 'Begin with your story.'}</h1>
            <p>A little about the hands behind your work helps visitors find—and remember—you.</p>
          </div>
          <div className="shop-heading-note"><span className="shop-note-dash" /> One page, made yours</div>
        </div>

        {isLoading ? (
          <section className="shop-loading" aria-label="Loading your shop" aria-busy="true">
            <div className="shop-skeleton shop-skeleton-title" /><div className="shop-skeleton shop-skeleton-line" /><div className="shop-skeleton shop-skeleton-block" />
            <span>Opening your workspace…</span>
          </section>
        ) : (
          <div className="shop-layout">
            <Form {...form}>
            <form className="shop-form" onSubmit={submit}>
              {(error || submitError) && <div className="account-alert account-alert-error" role="alert" data-testid="status-shop-error">{error || submitError}</div>}
              <section className="shop-form-section">
                <div className="shop-section-heading"><span className="shop-step">01</span><div><h2>The maker</h2><p>Start with what visitors will call you.</p></div></div>
                <div className="shop-fields-grid">
                  <ShopField control={form.control} name="name" label="Your name" required placeholder="Name as you’d like it shown" testId="input-shop-name" />
                  <ShopField control={form.control} name="craft" label="Craft or practice" required placeholder="e.g. Phulkari embroidery" testId="input-shop-craft" />
                  <ShopField control={form.control} name="category" label="Craft category" required placeholder="e.g. Textiles" testId="input-shop-category" />
                  <ShopField control={form.control} name="origin" label="From" required placeholder="Town, region" testId="input-shop-origin" />
                  <ShopField control={form.control} name="stallNumber" label="Stall number" placeholder="If you have one" testId="input-shop-stall" />
                  <ShopField control={form.control} name="phone" label="Contact phone" required type="tel" placeholder="+91…" testId="input-shop-phone" />
                </div>
              </section>

              <section className="shop-form-section">
                <div className="shop-section-heading"><span className="shop-step">02</span><div><h2>Your story</h2><p>Share the tradition, people or place behind your work.</p></div></div>
                <FormField control={form.control} name="story" render={({ field }) => (
                  <FormItem className="account-field shop-story-field">
                    <FormLabel>Maker’s story</FormLabel>
                    <FormControl><textarea {...field} rows={5} placeholder="What do you make, and what would you like people to know about it?" data-testid="input-shop-story" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </section>

              <section className="shop-form-section">
                <div className="shop-section-heading"><span className="shop-step">03</span><div><h2>Images from your workshop</h2><p>Add image links for your cover and portrait.</p></div></div>
                <div className="shop-fields-grid">
                  <ShopField control={form.control} name="coverImage" label="Cover image URL" type="url" placeholder="https://…" testId="input-shop-cover" />
                  <ShopField control={form.control} name="profileImage" label="Portrait image URL" type="url" placeholder="https://…" testId="input-shop-profile-image" />
                </div>
                <p className="shop-image-hint"><ImagePlus size={15} /> Paste an image address. Image uploads can be added when storage is connected.</p>
              </section>

              <section className="shop-form-section shop-products-section">
                <div className="shop-section-heading shop-products-heading"><span className="shop-step">04</span><div><h2>A few pieces</h2><p>Show visitors what comes from your hands.</p></div><button type="button" className="shop-add-product" onClick={() => append({ name: '', image: '' })} disabled={productFields.length >= 12} data-testid="button-add-product"><Plus size={16} /> Add piece</button></div>
                {productFields.length === 0 ? (
                  <div className="shop-empty-products"><ImagePlus size={18} /><span>No pieces added yet. You can add them whenever you’re ready.</span></div>
                ) : (
                  <div className="shop-product-list">
                    {productFields.map((product, index) => <div className="shop-product-row" key={product.id}>
                      <span className="shop-product-index">{String(index + 1).padStart(2, '0')}</span>
                      <div className="shop-product-fields">
                        <ShopField control={form.control} name={`products.${index}.name`} label={`Piece ${index + 1} name`} placeholder="Name of this piece" testId={`input-product-name-${index}`} />
                        <ShopField control={form.control} name={`products.${index}.image`} label={`Piece ${index + 1} image URL`} type="url" placeholder="https://…" testId={`input-product-image-${index}`} />
                      </div>
                      <button type="button" className="shop-remove-product" aria-label={`Remove piece ${index + 1}`} onClick={() => remove(index)} data-testid={`button-remove-product-${index}`}><Trash2 size={17} /></button>
                    </div>)}
                  </div>
                )}
              </section>

              <div className="shop-form-bottom">
                <span className="shop-save-copy">Your details are saved to your maker listing.</span>
                <button className="account-submit shop-save-button" type="submit" disabled={isSaving} data-testid="button-save-shop">
                  {isSaving ? 'Saving your page…' : <>{currentListing ? 'Save shop changes' : 'Create my shop page'}<Save size={17} /></>}
                </button>
              </div>
              {savedNotice && <p className="account-notice" role="status" data-testid="status-shop-saved">Your shop page is up to date.</p>}
            </form>
            </Form>

            <aside className="shop-preview-column" aria-label="Shop page preview">
              <div className="shop-preview-sticky">
                <div className="shop-preview-label"><span className="account-eyebrow"><span /> A FIRST LOOK</span><span>Preview</span></div>
                <article className="shop-preview-card">
                  <div className="shop-preview-cover">
                    {listing.coverImage ? <img src={listing.coverImage} alt="" /> : <div className="shop-image-placeholder"><ImagePlus size={25} /><span>Your cover image</span></div>}
                    <span className="shop-preview-tag">{listing.craft || 'Your craft'}</span>
                  </div>
                  <div className="shop-preview-body">
                    <div className="shop-preview-person">
                      {listing.profileImage ? <img className="shop-preview-avatar" src={listing.profileImage} alt="" /> : <div className="shop-preview-avatar shop-avatar-placeholder">{listing.name ? listing.name.trim().slice(0, 1).toUpperCase() : 'M'}</div>}
                      <div><h3>{listing.name || 'Your name'}</h3><span>{listing.category || 'Craft tradition'}</span></div>
                    </div>
                    <div className="shop-preview-origin"><MapPin size={14} />{listing.origin || 'Your place of making'}{listing.stallNumber ? ` · Stall ${listing.stallNumber}` : ''}</div>
                    <p>{listing.story || 'A few words about your practice will bring visitors closer to the hands and heritage behind your work.'}</p>
                    <div className="shop-preview-rule" />
                    <div className="shop-preview-gallery">
                      {listing.products.slice(0, 3).map((product, index) => <div className="shop-preview-piece" key={`preview-${index}`}>{product.image ? <img src={product.image} alt={product.name || `Piece ${index + 1}`} /> : <ImagePlus size={17} />}<span>{product.name || 'A piece from your workshop'}</span></div>)}
                      {listing.products.length === 0 && <span className="shop-preview-no-pieces">Your pieces will find a place here.</span>}
                    </div>
                    <span className="shop-preview-link">MEET THE MAKER <ArrowUpRight size={13} /></span>
                  </div>
                </article>
                <p className="shop-preview-caption">A considered page makes it easier for people to find you, wherever the fair takes them.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
      <footer className="account-footer"><span>MAHOTSAV CRAFTS</span><span>Meet the maker. Carry the story.</span></footer>
    </main>
  );
}

function ShopField({ control, name, label, placeholder, testId, type = 'text', required = false }: { control: Control<ArtisanListingInput>; name: FieldPath<ArtisanListingInput>; label: string; placeholder: string; testId: string; type?: string; required?: boolean }) {
  return <FormField control={control} name={name} render={({ field }) => (
    <FormItem className="account-field">
      <FormLabel>{label}</FormLabel>
      <FormControl><input {...field} value={typeof field.value === 'string' ? field.value : ''} type={type} placeholder={placeholder} required={required} data-testid={testId} /></FormControl>
      <FormMessage />
    </FormItem>
  )} />;
}

export default MyShopPage;
