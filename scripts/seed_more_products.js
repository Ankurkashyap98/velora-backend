import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'velora_shoes'
};

const fullProductsCatalog = [
  // SNEAKERS
  {
    name: 'Velora Urban Genesis Runner',
    slug: 'velora-urban-genesis-runner',
    category: 'Sneakers',
    gender: 'Unisex',
    price: 210,
    discount_price: 250,
    rating: 4.8,
    reviews_count: 220,
    badge: 'Trending Drop',
    featured: 1,
    trending: 1,
    description: 'Engineered for fluid city motion. Sculptural aerodynamic silhouette combined with high-rebound CloudFoam cushioning.',
    material: 'Engineered breathable knit, Italian nappa overlays, Bio-EVA midsole',
    origin: 'Designed in Milan, Hand-assembled in Portugal',
    color_name: 'Crimson Scarlet',
    color_hex: '#c0392b',
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Monaco Minimalist Court Sneaker',
    slug: 'monaco-minimalist-court-sneaker',
    category: 'Sneakers',
    gender: 'Men',
    price: 245,
    discount_price: null,
    rating: 4.9,
    reviews_count: 175,
    badge: 'Signature Essential',
    featured: 1,
    trending: 1,
    description: 'An architectural study in white leather minimalism. Tonal Margom rubber cupsole, gold foil serial stamp, and glove calf lining.',
    material: 'Full-Grain Italian Calfskin, Calfskin inner lining, Italian Margom rubber sole',
    origin: 'Handmade in Civitanova Marche, Italy',
    color_name: 'Optic White',
    color_hex: '#f5f5f5',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Velora Apex Aero Runner',
    slug: 'velora-apex-aero-runner',
    category: 'Sneakers',
    gender: 'Unisex',
    price: 240,
    discount_price: 280,
    rating: 4.9,
    reviews_count: 88,
    badge: 'New Release',
    featured: 1,
    trending: 1,
    description: 'Dynamic performance silhouette featuring high-tensile technical mesh and molded heel stabilizers for metropolitan commuting.',
    material: 'Technical Jacquard Mesh, Brushed Suede Overlays, Dual-density EVA outsole',
    origin: 'Crafted in Portugal',
    color_name: 'Hyper Electric',
    color_hex: '#1e3799',
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Aura Minimalist Cloud Runner',
    slug: 'aura-minimalist-cloud-runner',
    category: 'Sneakers',
    gender: 'Women',
    price: 225,
    discount_price: null,
    rating: 4.8,
    reviews_count: 138,
    badge: 'Bestseller',
    featured: 1,
    trending: 1,
    description: 'Understated luxury meets athletic poise. Lightweight layered textures in tone-on-tone neutrals for effortless styling.',
    material: 'Organic linen weave, Italian nubuck trim, Ergonomic cork footbed',
    origin: 'Crafted in Portugal',
    color_name: 'Chalk & Sand',
    color_hex: '#e6ded3',
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    name: 'Novara Retro Court Sneaker',
    slug: 'novara-retro-court-sneaker',
    category: 'Sneakers',
    gender: 'Unisex',
    price: 230,
    discount_price: 260,
    rating: 4.9,
    reviews_count: 180,
    badge: 'Bestseller',
    featured: 1,
    trending: 1,
    description: '70s court nostalgia modernized with premium perforated Italian leather and contrast deep-emerald heel tabs.',
    material: 'Tumbled nappa leather, Perforated vamp, OrthoLite eco-hybrid sockliner',
    origin: 'Crafted in Porto, Portugal',
    color_name: 'Forest Cream',
    color_hex: '#2d4a3e',
    stock: 26,
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Venice Platform Street Sneaker',
    slug: 'venice-platform-street-sneaker',
    category: 'Sneakers',
    gender: 'Women',
    price: 275,
    discount_price: 310,
    rating: 4.8,
    reviews_count: 94,
    badge: 'Trending Drop',
    featured: 1,
    trending: 1,
    description: 'Elevated 40mm platform sole crafted in featherlight blown rubber, paired with smooth Italian nappa leather.',
    material: 'Nappa leather, Lightweight blown rubber platform, Memory insole',
    origin: 'Handmade in Marche, Italy',
    color_name: 'Pearl Chalk',
    color_hex: '#ece9e2',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    name: 'Torino High-Top Performance Trainer',
    slug: 'torino-high-top-performance-trainer',
    category: 'Sneakers',
    gender: 'Men',
    price: 290,
    discount_price: null,
    rating: 4.9,
    reviews_count: 65,
    badge: 'Masterwork',
    featured: 0,
    trending: 1,
    description: 'Architectural high-top collar with padded ankle chambers and tonal suede overlays inspired by Milanese brutalism.',
    material: 'Heavyweight grain leather, Padded suede collar, High-traction cupsole',
    origin: 'Crafted in Civitanova Marche, Italy',
    color_name: 'Pitch Black & Gold',
    color_hex: '#141414',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Lazio Chunky Trail Sneaker',
    slug: 'lazio-chunky-trail-sneaker',
    category: 'Sneakers',
    gender: 'Unisex',
    price: 250,
    discount_price: 290,
    rating: 4.7,
    reviews_count: 112,
    badge: 'All-Weather',
    featured: 0,
    trending: 1,
    description: 'Rugged tooth-lug outsole with ripstop nylon underlays and reflective cord lacing for rain or shine exploring.',
    material: 'Water-resistant ripstop nylon, Suede mudguards, Lugged Vibram rubber sole',
    origin: 'Crafted in Portugal',
    color_name: 'Khaki & Ochre',
    color_hex: '#8a7d5b',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12']
  },

  // LOAFERS
  {
    name: 'Milano Leather Penny Loafer',
    slug: 'milano-leather-penny-loafer',
    category: 'Loafers',
    gender: 'Men',
    price: 285,
    discount_price: 340,
    rating: 4.9,
    reviews_count: 142,
    badge: 'Bestseller',
    featured: 1,
    trending: 1,
    description: 'Sculpted from hand-burnished Tuscan calfskin, the Milano Penny Loafer balances effortless sprezzatura with all-day architectural support.',
    material: '100% Full-Grain Italian Calfskin, Hand-stitched welt, Vibram rubber inset sole',
    origin: 'Handmade in Florence, Italy',
    color_name: 'Obsidian Black',
    color_hex: '#1a1a1a',
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Palermo Cashmere Suede Loafer',
    slug: 'palermo-cashmere-suede-loafer',
    category: 'Loafers',
    gender: 'Women',
    price: 270,
    discount_price: 320,
    rating: 4.9,
    reviews_count: 83,
    badge: 'Popular',
    featured: 1,
    trending: 1,
    description: 'Unstructured featherlight loafer made with butter-soft unlined suede that wraps around your foot like a tailored glove.',
    material: 'Silky Italian Baby Calf Suede, Flexible deconstructed leather sole with rubber island',
    origin: 'Handmade in Tuscany, Italy',
    color_name: 'Sage Moss',
    color_hex: '#708238',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    name: 'Bellagio Tassel Loafer',
    slug: 'bellagio-tassel-loafer',
    category: 'Loafers',
    gender: 'Men',
    price: 295,
    discount_price: null,
    rating: 4.8,
    reviews_count: 62,
    badge: 'Artisanal',
    featured: 0,
    trending: 0,
    description: 'Double-tassel ornament hand-knotted on a raised apron toe. The ideal sartorial choice with linen trousers or tailored denim.',
    material: 'Museum Calf Leather, Goodyear-flex welt, Hand-stained sole edges',
    origin: 'Handmade in Naples, Italy',
    color_name: 'Chestnut Burnish',
    color_hex: '#603813',
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Capri Woven Nappa Horsebit Loafer',
    slug: 'capri-woven-nappa-horsebit-loafer',
    category: 'Loafers',
    gender: 'Men',
    price: 330,
    discount_price: 375,
    rating: 4.9,
    reviews_count: 51,
    badge: 'Masterwork',
    featured: 1,
    trending: 0,
    description: 'Intricately hand-woven nappa leather apron adorned with a brushed brass equestrian snaffle bit.',
    material: 'Hand-Intrecciato Nappa Calfskin, Antique brass hardware, Channel-stitched leather sole',
    origin: 'Handmade in Florence, Italy',
    color_name: 'Tobacco Brown',
    color_hex: '#4a2c11',
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Cortina Belgian Bow Loafer',
    slug: 'cortina-belgian-bow-loafer',
    category: 'Loafers',
    gender: 'Women',
    price: 310,
    discount_price: null,
    rating: 5.0,
    reviews_count: 42,
    badge: 'Limited Run',
    featured: 1,
    trending: 1,
    description: 'Iconic low-vamp Belgian silhouette detailed with a delicate raw leather bow and piping.',
    material: 'Velvety Lamb Suede, Hand-turned leather piping, Padded arch cushion',
    origin: 'Handmade in Tuscany, Italy',
    color_name: 'Warm Taupe',
    color_hex: '#9e9282',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    name: 'Ravenna Lug-Sole Platform Loafer',
    slug: 'ravenna-lug-sole-platform-loafer',
    category: 'Loafers',
    gender: 'Women',
    price: 295,
    discount_price: 340,
    rating: 4.8,
    reviews_count: 77,
    badge: 'Trending Drop',
    featured: 0,
    trending: 1,
    description: 'Modern statement loafer pairing glossy spazzolato leather with a lightweight commando lug platform.',
    material: 'Polished Spazzolato Calfskin, Chunky Extralight commando sole, Padded tongue',
    origin: 'Crafted in Civitanova Marche, Italy',
    color_name: 'Gloss Burgundy',
    color_hex: '#3d0c15',
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },

  // BOOTS
  {
    name: 'Siena Suede Chelsea Boot',
    slug: 'siena-suede-chelsea-boot',
    category: 'Boots',
    gender: 'Men',
    price: 390,
    discount_price: 450,
    rating: 4.9,
    reviews_count: 110,
    badge: 'Iconic',
    featured: 1,
    trending: 1,
    description: 'Sleek wholecut chelsea silhouette in weather-treated Italian reverse suede. Twin heavy-gauge elastic gussets and Grosgrain pull tabs.',
    material: 'Hydrophobic Italian Reverse Suede, Blake-stitched leather sole, Stacked cuban heel',
    origin: 'Handmade in Montegranaro, Italy',
    color_name: 'Smoked Espresso',
    color_hex: '#3e2723',
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Ravenna Ankle Harness Boot',
    slug: 'ravenna-ankle-harness-boot',
    category: 'Boots',
    gender: 'Women',
    price: 430,
    discount_price: null,
    rating: 5.0,
    reviews_count: 47,
    badge: 'Limited Run',
    featured: 1,
    trending: 1,
    description: 'A striking silhouette with equestrian-inspired harness ring hardware, cuban block heel, and medial side zip for sleek dressing.',
    material: 'Semi-gloss Italian Calf Leather, Brushed nickel hardware, Stacked leather cuban heel',
    origin: 'Handmade in Civitanova Marche, Italy',
    color_name: 'Jet Onyx',
    color_hex: '#181818',
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    name: 'Stelvio Combat Zip Boot',
    slug: 'stelvio-combat-zip-boot',
    category: 'Boots',
    gender: 'Men',
    price: 440,
    discount_price: 490,
    rating: 4.9,
    reviews_count: 93,
    badge: 'Staff Pick',
    featured: 1,
    trending: 1,
    description: 'Brutal elegance. Features an exposed industrial front zipper, storm welt seal, and custom deep-cleat lug sole for maximum grip.',
    material: 'Full-Grain Horween Leather, YKK Excella zipper, Vibram Montagna block lug sole',
    origin: 'Crafted in Montegranaro, Italy',
    color_name: 'Matte Charcoal',
    color_hex: '#2d3748',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Dolomite Heavy Lug Boot',
    slug: 'dolomite-heavy-lug-boot',
    category: 'Boots',
    gender: 'Unisex',
    price: 410,
    discount_price: 460,
    rating: 4.9,
    reviews_count: 112,
    badge: 'All-Weather',
    featured: 0,
    trending: 1,
    description: 'Storm-welted winter boot built with heavy waxed cowhide and reinforced heel cup for cold conditions and rugged paths.',
    material: 'Waterproof Waxed Suede, Shearling insole option, Deep-tread Vibram Lug sole',
    origin: 'Handmade in South Tyrol, Italy',
    color_name: 'Espresso Wax',
    color_hex: '#38251a',
    stock: 17,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Verona Stacked Heel Chelsea Boot',
    slug: 'verona-stacked-heel-chelsea-boot',
    category: 'Boots',
    gender: 'Women',
    price: 380,
    discount_price: 420,
    rating: 4.9,
    reviews_count: 67,
    badge: 'Bestseller',
    featured: 1,
    trending: 1,
    description: 'Almond-toe feminine Chelsea boot with a sculpted 60mm stacked wooden block heel and elastic side panels.',
    material: 'Full-Grain Tuscan Calfskin, Hand-finished wood stacked heel, Leather and rubber sole',
    origin: 'Handmade in Florence, Italy',
    color_name: 'Caramel Glaze',
    color_hex: '#a36222',
    stock: 13,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    name: 'Napoli Classic Desert Chukka',
    slug: 'napoli-classic-desert-chukka',
    category: 'Boots',
    gender: 'Men',
    price: 310,
    discount_price: null,
    rating: 4.8,
    reviews_count: 53,
    badge: 'Casual',
    featured: 0,
    trending: 0,
    description: 'Two-eyelet desert chukka boot built on a natural plantation crepe sole with unlined suede upper.',
    material: 'Italian Velour Suede, Natural plantation crepe sole, Rawhide laces',
    origin: 'Handmade in Naples, Italy',
    color_name: 'Desert Sand',
    color_hex: '#c2b280',
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },

  // FORMAL
  {
    name: 'Roma Classic Oxford Captoe',
    slug: 'roma-classic-oxford-captoe',
    category: 'Formal',
    gender: 'Men',
    price: 320,
    discount_price: null,
    rating: 4.9,
    reviews_count: 98,
    badge: 'Masterwork',
    featured: 1,
    trending: 0,
    description: 'The pinnacle of black-tie refinement. Goodyear-welted construction with a beveled waist and mirror-gloss toe polish.',
    material: 'Box Calf Leather, Oak-bark tanned leather sole, Hand-carved fiddleback waist',
    origin: 'Crafted in Tuscany, Italy',
    color_name: 'Deep Cognac',
    color_hex: '#5c3317',
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Verona Wingtip Brogue',
    slug: 'verona-wingtip-brogue',
    category: 'Formal',
    gender: 'Men',
    price: 345,
    discount_price: 395,
    rating: 4.9,
    reviews_count: 67,
    badge: 'Heritage',
    featured: 1,
    trending: 0,
    description: 'Precision perforations hand-punched along the wingtip contours. Triple-dyed patina with hand-burnished edge detail.',
    material: 'Full-Grain Horween Chromexcel, Goodyear welted double leather sole, Brass toe taps',
    origin: 'Handmade in Florence, Italy',
    color_name: 'Burgundy Cordovan',
    color_hex: '#4a1525',
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Sorento Silk Velvet Loafer',
    slug: 'sorento-silk-velvet-loafer',
    category: 'Formal',
    gender: 'Men',
    price: 380,
    discount_price: 420,
    rating: 4.9,
    reviews_count: 39,
    badge: 'Black Tie',
    featured: 1,
    trending: 0,
    description: 'Sumptuous deep-pile Italian silk velvet with grosgrain collar trim and hand-quilted satin footbed lining.',
    material: 'Tuscan Silk Velvet, Quilted crimson satin lining, Blake-stitched gloss leather sole',
    origin: 'Crafted in Florence, Italy',
    color_name: 'Royal Midnight',
    color_hex: '#0f172a',
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1616406432452-07bc5938759d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Milano Double Monk Strap',
    slug: 'milano-double-monk-strap',
    category: 'Formal',
    gender: 'Men',
    price: 360,
    discount_price: 410,
    rating: 4.9,
    reviews_count: 81,
    badge: 'Bestseller',
    featured: 1,
    trending: 1,
    description: 'Chiseled toe profile secured with twin antiqued palladium buckles. Hand-waxed finish that repels moisture gracefully.',
    material: 'French Box Calf, Palladium plated hardware, Goodyear-welted leather outsole',
    origin: 'Handmade in Milan, Italy',
    color_name: 'Antiqued Oak',
    color_hex: '#52341b',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Florence Sculpted Slingback Pump',
    slug: 'florence-sculpted-slingback-pump',
    category: 'Formal',
    gender: 'Women',
    price: 350,
    discount_price: null,
    rating: 4.9,
    reviews_count: 73,
    badge: 'Black Tie',
    featured: 1,
    trending: 1,
    description: 'A sharp pointed toe paired with a sculpted 75mm architectural stiletto and adjustable gold-buckle heel sling.',
    material: 'Mirror Patent Leather, Memory foam ball cushion, Lacquered leather sole',
    origin: 'Handmade in Florence, Italy',
    color_name: 'Midnight Noir',
    color_hex: '#111111',
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },

  // CASUAL
  {
    name: 'Capri Canvas Deck Shoe',
    slug: 'capri-canvas-deck-shoe',
    category: 'Casual',
    gender: 'Unisex',
    price: 185,
    discount_price: 215,
    rating: 4.7,
    reviews_count: 89,
    badge: 'Summer Edit',
    featured: 0,
    trending: 1,
    description: 'Heavyweight washed duck canvas with vegetable-tanned leather lacing and siped non-marking rubber outsoles for coastal escapes.',
    material: '16oz Washed Cotton Canvas, Rawhide leather laces, Razor-siped marine rubber sole',
    origin: 'Crafted in Alicante, Spain',
    color_name: 'Nautical Ecru',
    color_hex: '#ece6d8',
    stock: 31,
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Como Driving Moccasin',
    slug: 'como-driving-moccasin',
    category: 'Casual',
    gender: 'Men',
    price: 235,
    discount_price: 270,
    rating: 4.8,
    reviews_count: 104,
    badge: 'Travel Essential',
    featured: 0,
    trending: 0,
    description: 'Designed for the open coastal road. Signature rubber pebble studded sole extending through the heel counter for grip and flex.',
    material: 'Velvety Nubuck Leather, Reinforced hand-sewn moc toe, Rubber-stud driving sole',
    origin: 'Handmade in Tuscany, Italy',
    color_name: 'Midnight Navy',
    color_hex: '#1b2a4a',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Luna Sculptural Strappy Sandal',
    slug: 'luna-sculptural-strappy-sandal',
    category: 'Casual',
    gender: 'Women',
    price: 260,
    discount_price: null,
    rating: 4.8,
    reviews_count: 71,
    badge: 'New Release',
    featured: 0,
    trending: 1,
    description: 'Slender crisscrossing ankle straps meeting a handcrafted wood-look cylinder heel. Designed for sunset dinners and gallery openings.',
    material: 'Specchio Metallic Leather, Micro-cushioned insole, Natural leather sole',
    origin: 'Handmade in Milan, Italy',
    color_name: 'Gold Dust',
    color_hex: '#d4af37',
    stock: 13,
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    name: 'Serena Sculpted Kitten Mule',
    slug: 'serena-sculpted-kitten-mule',
    category: 'Casual',
    gender: 'Women',
    price: 280,
    discount_price: 320,
    rating: 4.9,
    reviews_count: 58,
    badge: 'Trending Drop',
    featured: 1,
    trending: 1,
    description: 'A square-toe silhouette with an hourglass 45mm heel. Sculpted in butter-soft lambskin with hidden inner elastic cushioning.',
    material: 'Plonge Lambskin, Arch-cushioned insole, Hand-finished leather sole',
    origin: 'Handmade in Venice, Italy',
    color_name: 'Ivory Pearl',
    color_hex: '#f0ece2',
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    name: 'Portofino Braided Jute Espadrille',
    slug: 'portofino-braided-jute-espadrille',
    category: 'Casual',
    gender: 'Unisex',
    price: 165,
    discount_price: 195,
    rating: 4.8,
    reviews_count: 64,
    badge: 'Summer Edit',
    featured: 0,
    trending: 1,
    description: 'Traditional Spanish jute rope sole hand-stitched to buttery nappa leather upper with reinforced toe protection.',
    material: 'Natural braided jute rope, Nappa leather, Vulcanized natural rubber base',
    origin: 'Crafted in Costa Brava, Spain',
    color_name: 'Natural Straw & White',
    color_hex: '#d8c292',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12']
  },
  {
    name: 'Tuscan Raw Edge Leather Slide',
    slug: 'tuscan-raw-edge-leather-slide',
    category: 'Casual',
    gender: 'Women',
    price: 195,
    discount_price: null,
    rating: 4.9,
    reviews_count: 48,
    badge: 'Handcrafted',
    featured: 0,
    trending: 0,
    description: 'An architectural wide-strap slip-on made of vegetable-tanned bridle leather that molds to your arch over time.',
    material: 'Vegetable-tanned Cuoio leather, Anatomical molded footbed, Non-slip rubber heel tap',
    origin: 'Handmade in Florence, Italy',
    color_name: 'Burnished Tan',
    color_hex: '#965a38',
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  }
];

async function seed() {
  const connection = await mysql.createConnection(dbConfig);
  console.log(`Connected to MySQL database: ${dbConfig.database}`);

  try {
    let addedCount = 0;
    let updatedCount = 0;

    for (const p of fullProductsCatalog) {
      const [existing] = await connection.query('SELECT id FROM products WHERE slug = ?', [p.slug]);
      let productId = existing[0]?.id;

      if (!productId) {
        const [insertRes] = await connection.query(
          `INSERT INTO products (name, slug, category, gender, price, discount_price, rating, reviews_count, badge, featured, trending, description, material, origin, color_name, color_hex, stock)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.name,
            p.slug,
            p.category,
            p.gender,
            p.price,
            p.discount_price,
            p.rating,
            p.reviews_count,
            p.badge,
            p.featured,
            p.trending,
            p.description,
            p.material,
            p.origin,
            p.color_name,
            p.color_hex,
            p.stock
          ]
        );
        productId = insertRes.insertId;
        addedCount++;

        // Insert gallery images
        for (let idx = 0; idx < p.images.length; idx++) {
          await connection.query(
            'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
            [productId, p.images[idx], idx === 0 ? 1 : 0]
          );
        }

        // Insert sizes
        for (const size of p.sizes) {
          await connection.query(
            'INSERT INTO product_sizes (product_id, size, stock) VALUES (?, ?, ?)',
            [productId, size, 12]
          );
        }
      } else {
        // Update images if missing
        const [imgRows] = await connection.query('SELECT id FROM product_images WHERE product_id = ?', [productId]);
        if (imgRows.length === 0) {
          for (let idx = 0; idx < p.images.length; idx++) {
            await connection.query(
              'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
              [productId, p.images[idx], idx === 0 ? 1 : 0]
            );
          }
        }
        updatedCount++;
      }
    }

    const [[countRow]] = await connection.query('SELECT COUNT(*) as total FROM products');
    const [[imgCountRow]] = await connection.query('SELECT COUNT(*) as total FROM product_images');

    console.log(`✓ Products seeded successfully!`);
    console.log(`  Added new: ${addedCount}`);
    console.log(`  Already existing: ${updatedCount}`);
    console.log(`  Total Products in DB: ${countRow.total}`);
    console.log(`  Total Product Images in DB: ${imgCountRow.total}`);
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await connection.end();
  }
}

seed();
