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

const menProducts = [
  // 3 Men Sneakers
  {
    name: 'Verona Street Pro Skater',
    slug: 'verona-street-pro-skater',
    category: 'Sneakers',
    gender: 'Men',
    price: 235,
    discount_price: 275,
    rating: 4.8,
    reviews_count: 55,
    badge: 'Street Style',
    featured: 0,
    trending: 1,
    description: 'Padded tongue and collar skate silhouette in heavy tumbled white leather with gum cupsole.',
    material: 'Tumbled cowhide, Padded collar, Heavy-duty vulcanized gum sole',
    origin: 'Crafted in Portugal',
    color_name: 'Bone & Gum',
    color_hex: '#e8dec8',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85']
  },
  {
    name: 'Cortina Trail Runner in Olive',
    slug: 'cortina-trail-runner-olive',
    category: 'Sneakers',
    gender: 'Men',
    price: 250,
    discount_price: null,
    rating: 4.9,
    reviews_count: 42,
    badge: 'All-Weather',
    featured: 1,
    trending: 1,
    description: 'Deep lugged Vibram sole with ripstop nylon quarters and suede mudguards for rainy commutes.',
    material: 'Ripstop nylon, Suede overlays, Cleated Vibram sole',
    origin: 'Crafted in Portugal',
    color_name: 'Olive Drab',
    color_hex: '#4b5320',
    stock: 14,
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85']
  },
  {
    name: 'San Siro Perforated Low Top',
    slug: 'san-siro-perforated-low-top',
    category: 'Sneakers',
    gender: 'Men',
    price: 240,
    discount_price: 280,
    rating: 4.7,
    reviews_count: 63,
    badge: 'Daily Classic',
    featured: 0,
    trending: 0,
    description: 'Precision punch holes along the vamp with contrast suede heel tab and padded leather insole.',
    material: 'Italian Nappa, Perforated vamp, Margom rubber sole',
    origin: 'Handmade in Marche, Italy',
    color_name: 'All White',
    color_hex: '#f5f5f5',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85']
  },

  // 4 Men Loafers
  {
    name: 'Florence Suede Penny Loafer in Snuff',
    slug: 'florence-suede-penny-loafer-snuff',
    category: 'Loafers',
    gender: 'Men',
    price: 285,
    discount_price: 320,
    rating: 4.9,
    reviews_count: 51,
    badge: 'Bestseller',
    featured: 1,
    trending: 1,
    description: 'Snuff brown reverse calf suede with unlined construction that stretches naturally to foot width.',
    material: 'Reverse calf suede, Single leather sole, Goodyear flex welt',
    origin: 'Handmade in Florence, Italy',
    color_name: 'Snuff Suede',
    color_hex: '#6e4726',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1000&q=85']
  },
  {
    name: 'Torino Venetian Loafer in Black Calf',
    slug: 'torino-venetian-loafer-black-calf',
    category: 'Loafers',
    gender: 'Men',
    price: 295,
    discount_price: null,
    rating: 4.8,
    reviews_count: 39,
    badge: 'Minimalist',
    featured: 0,
    trending: 0,
    description: 'Clean unornamented slipper loafer with high instep line and beveled leather waist.',
    material: 'Full-Grain Box Calf, Glove leather lining, Channeled sole',
    origin: 'Handmade in Milan, Italy',
    color_name: 'Pitch Black',
    color_hex: '#111111',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85']
  },
  {
    name: 'Capri Horsebit Loafer in Suede',
    slug: 'capri-horsebit-loafer-suede',
    category: 'Loafers',
    gender: 'Men',
    price: 320,
    discount_price: 360,
    rating: 4.9,
    reviews_count: 47,
    badge: 'Masterwork',
    featured: 1,
    trending: 1,
    description: 'Solid brass equestrian snaffle across tobacco brown suede with rubber-island leather sole.',
    material: 'Tuscan kid suede, Cast brass horsebit, Rubber island sole',
    origin: 'Handmade in Florence, Italy',
    color_name: 'Tobacco Suede',
    color_hex: '#5c3818',
    stock: 14,
    images: ['https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85']
  },
  {
    name: 'Milano Kiltie Tassel Loafer',
    slug: 'milano-kiltie-tassel-loafer',
    category: 'Loafers',
    gender: 'Men',
    price: 310,
    discount_price: null,
    rating: 4.8,
    reviews_count: 36,
    badge: 'Heritage',
    featured: 0,
    trending: 1,
    description: 'Traditional fringe kiltie tongue overlay topped with twin braided leather tassels.',
    material: 'Museum calf leather, Kiltie fringe, Goodyear welt',
    origin: 'Handmade in Naples, Italy',
    color_name: 'Deep Mahogany',
    color_hex: '#3b121b',
    stock: 11,
    images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=85']
  },

  // 5 Men Casual
  {
    name: 'Positano Braided Jute Slip-On',
    slug: 'positano-braided-jute-slip-on',
    category: 'Casual',
    gender: 'Men',
    price: 170,
    discount_price: 195,
    rating: 4.7,
    reviews_count: 59,
    badge: 'Summer Drop',
    featured: 0,
    trending: 1,
    description: 'Lightweight slip-on with natural jute midsole rope wrap and washed linen upper.',
    material: 'Washed linen canvas, Jute rope midsole, Vulcanized gum sole',
    origin: 'Crafted in Spain',
    color_name: 'Natural Flax',
    color_hex: '#dfd7c2',
    stock: 22,
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1000&q=85']
  },
  {
    name: 'Como Penny Driving Shoe in Cognac',
    slug: 'como-penny-driving-shoe-cognac',
    category: 'Casual',
    gender: 'Men',
    price: 240,
    discount_price: null,
    rating: 4.9,
    reviews_count: 67,
    badge: 'Bestseller',
    featured: 1,
    trending: 0,
    description: 'Supple nappa leather driving moccasin with penny slot and rubber pebble grip sole.',
    material: 'Italian Nappa leather, Hand-sewn apron, Gommino rubber sole',
    origin: 'Handmade in Tuscany, Italy',
    color_name: 'Warm Cognac',
    color_hex: '#8a4b18',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85']
  },
  {
    name: 'Amalfi Crossover Leather Slide',
    slug: 'amalfi-crossover-leather-slide',
    category: 'Casual',
    gender: 'Men',
    price: 195,
    discount_price: 230,
    rating: 4.8,
    reviews_count: 43,
    badge: 'Resort Edit',
    featured: 0,
    trending: 1,
    description: 'Thick hand-dyed saddle leather cross straps with anatomical arch support.',
    material: 'Cuoio bridle leather, Molded suede footbed, Rubber outsole',
    origin: 'Handmade in Florence, Italy',
    color_name: 'Burnished Tan',
    color_hex: '#8c532b',
    stock: 16,
    images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85']
  },
  {
    name: 'San Remo Washed Denim Slip-On',
    slug: 'san-remo-washed-denim-slip-on',
    category: 'Casual',
    gender: 'Men',
    price: 165,
    discount_price: null,
    rating: 4.7,
    reviews_count: 52,
    badge: 'Weekend Edit',
    featured: 0,
    trending: 0,
    description: 'Italian selvedge denim woven into relaxed slip-on shoes with padded collar.',
    material: 'Washed selvedge denim, Padded leather collar, Natural rubber sole',
    origin: 'Crafted in Portugal',
    color_name: 'Indigo Wash',
    color_hex: '#2b3a55',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85']
  },
  {
    name: 'Capri Suede Mule Slide',
    slug: 'capri-suede-mule-slide',
    category: 'Casual',
    gender: 'Men',
    price: 215,
    discount_price: 250,
    rating: 4.8,
    reviews_count: 48,
    badge: 'Lounge Luxury',
    featured: 1,
    trending: 1,
    description: 'Backless slipper in plush olive suede with cork footbed for seamless home and terrace lounging.',
    material: 'Italian kid suede, Ergonomic cork footbed, EVA sole',
    origin: 'Handmade in Marche, Italy',
    color_name: 'Olive Sage',
    color_hex: '#556b2f',
    stock: 14,
    images: ['https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1000&q=85', 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1000&q=85']
  }
];

async function addMenBalance() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    let added = 0;
    for (const p of menProducts) {
      const [existing] = await connection.query('SELECT id FROM products WHERE slug = ?', [p.slug]);
      if (existing.length === 0) {
        const [res] = await connection.query(
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
        const productId = res.insertId;
        added++;

        for (let idx = 0; idx < p.images.length; idx++) {
          await connection.query(
            'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
            [productId, p.images[idx], idx === 0 ? 1 : 0]
          );
        }

        const sizes = ['7', '8', '9', '10', '11', '12'];
        for (const s of sizes) {
          await connection.query(
            'INSERT INTO product_sizes (product_id, size, stock) VALUES (?, ?, ?)',
            [productId, s, 15]
          );
        }
      }
    }
    console.log(`✓ Added ${added} new Men products to bring all categories above 15!`);
  } finally {
    await connection.end();
  }
}

addMenBalance();
