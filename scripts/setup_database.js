import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const DB_NAME = process.env.DB_NAME || 'velora_shoes';

// 24 Products Catalog matching frontend utils/data.js
const productsCatalog = [
  {
    id: 1,
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
    id: 2,
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
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    id: 3,
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
    id: 4,
    name: 'Siena Suede Chelsea Boot',
    slug: 'siena-suede-chelsea-boot',
    category: 'Boots',
    gender: 'Women',
    price: 390,
    discount_price: 440,
    rating: 5.0,
    reviews_count: 76,
    badge: 'Limited Run',
    featured: 1,
    trending: 1,
    description: 'A contemporary ankle silhouette crafted with velvety water-repellent suede and twin elastic gussets for instant comfort.',
    material: 'Hydrophobic Italian Reverse Suede, Natural crepe rubber outsole, Glove-leather lining',
    origin: 'Handmade in Civitanova Marche, Italy',
    color_name: 'Warm Taupe',
    color_hex: '#a38f78',
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    id: 5,
    name: 'Monaco Minimalist Court Sneaker',
    slug: 'monaco-minimalist-court-sneaker',
    category: 'Sneakers',
    gender: 'Unisex',
    price: 240,
    discount_price: 280,
    rating: 4.9,
    reviews_count: 310,
    badge: 'Iconic',
    featured: 1,
    trending: 1,
    description: 'Stripped of superfluous ornament. Monolithic clean lines, buttery soft calfskin, and gold foil serial code stamp.',
    material: 'Full-Grain Buttero Leather, Margom vulcanized rubber cupsole, Organic cotton laces',
    origin: 'Crafted in Montegranaro, Italy',
    color_name: 'Pure Alabaster',
    color_hex: '#f5f5f0',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12']
  },
  {
    id: 6,
    name: 'Florence Sculpted Slingback Pump',
    slug: 'florence-sculpted-slingback-pump',
    category: 'Formal',
    gender: 'Women',
    price: 360,
    discount_price: null,
    rating: 4.8,
    reviews_count: 64,
    badge: 'New Release',
    featured: 1,
    trending: 0,
    description: 'An architectural kitten heel featuring an elongated pointed toe, asymmetric strap, and cushioned memory-gel footbed.',
    material: 'Lustrous Silk-Satin & Nappa piping, Leather sole with rubber traction tip',
    origin: 'Handmade in Venice, Italy',
    color_name: 'Satin Noir',
    color_hex: '#111111',
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    id: 7,
    name: 'Torino Rugged Combat Boot',
    slug: 'torino-rugged-combat-boot',
    category: 'Boots',
    gender: 'Men',
    price: 420,
    discount_price: 470,
    rating: 4.9,
    reviews_count: 88,
    badge: 'Heritage',
    featured: 1,
    trending: 1,
    description: 'Heavyweight pull-up leather that develops a breathtaking vintage patina with every mile. Fitted with rugged lug treads.',
    material: 'Waxed Vegetable-Tanned Cowhide, Commando Lug Vibram Sole, Gunmetal speed eyelets',
    origin: 'Crafted in Veneto, Italy',
    color_name: 'Saddle Brown',
    color_hex: '#6d4327',
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    id: 8,
    name: 'Venice Woven Leather Mule',
    slug: 'venice-woven-leather-mule',
    category: 'Casual',
    gender: 'Women',
    price: 250,
    discount_price: null,
    rating: 4.7,
    reviews_count: 52,
    badge: 'Artisanal',
    featured: 0,
    trending: 1,
    description: 'Intricately hand-braided intrecciato leather uppers set atop an ergonomic footbed that molds gracefully to your arch.',
    material: 'Hand-woven Lambskin, Calf-suede footbed lining, Flexible leather sole',
    origin: 'Made in Florence, Italy',
    color_name: 'Honey Ochre',
    color_hex: '#c89d55',
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['5', '6', '7', '8', '9', '10']
  },
  {
    id: 9,
    name: 'Amalfi Heritage Bit Loafer',
    slug: 'amalfi-heritage-bit-loafer',
    category: 'Loafers',
    gender: 'Men',
    price: 310,
    discount_price: 360,
    rating: 4.9,
    reviews_count: 115,
    badge: 'Bestseller',
    featured: 1,
    trending: 0,
    description: 'Finished with custom-cast antiqued brass horsebit hardware. An immortal Riviera silhouette built with Blake-stitched flexibility.',
    material: 'Full-Grain French Calfskin, Solid Brass Horsebit, Hand-painted channeled leather sole',
    origin: 'Handmade in Naples, Italy',
    color_name: 'Espresso Bean',
    color_hex: '#3b2219',
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    id: 10,
    name: 'Veloce High-Top Studio Sneaker',
    slug: 'veloce-high-top-studio-sneaker',
    category: 'Sneakers',
    gender: 'Men',
    price: 275,
    discount_price: 310,
    rating: 4.8,
    reviews_count: 164,
    badge: 'Staff Pick',
    featured: 0,
    trending: 1,
    description: 'Padded collar with geometric quilting, distressed suede accents, and dual zipper closure for an effortlessly modern street silhouette.',
    material: 'Full-grain tumbled nappa, Italian suede panels, Recycled rubber cupsole',
    origin: 'Crafted in Porto, Portugal',
    color_name: 'Slate Stone',
    color_hex: '#4a5568',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    id: 11,
    name: 'Cortina Alpine Trekker Boot',
    slug: 'cortina-alpine-trekker-boot',
    category: 'Boots',
    gender: 'Unisex',
    price: 450,
    discount_price: null,
    rating: 5.0,
    reviews_count: 42,
    badge: 'Weatherproof',
    featured: 1,
    trending: 0,
    description: 'Built to conquer alpine storms while commanding city avenues. Norwegian-welted construction with thermal shearling lining.',
    material: 'Waxed Bavarian Roughout leather, Genuine Merino Shearling, Vibram Arctic Grip Outsole',
    origin: 'Handcrafted in South Tyrol, Italy',
    color_name: 'Forest Bark',
    color_hex: '#3d3025',
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1542840410-3092f99611a3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12']
  },
  {
    id: 12,
    name: 'Palermo Cashmere Suede Loafer',
    slug: 'palermo-cashmere-suede-loafer',
    category: 'Loafers',
    gender: 'Women',
    price: 270,
    discount_price: 320,
    rating: 4.9,
    reviews_count: 83,
    badge: 'Popular',
    featured: 0,
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
  }
];

async function setup() {
  console.log(`Connecting to MySQL server at ${dbConfig.host} as ${dbConfig.user}...`);
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Successfully connected to MySQL server.');

    // 1. Create Database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✓ Database '${DB_NAME}' created or verified.`);

    await connection.query(`USE \`${DB_NAME}\`;`);

    // 2. Create Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(180) UNIQUE NOT NULL,
        phone VARCHAR(30) NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Table `users` created.');

    // 3. Create Products Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(180) NOT NULL,
        slug VARCHAR(180) UNIQUE NOT NULL,
        category VARCHAR(60) NOT NULL,
        gender VARCHAR(30) DEFAULT 'Unisex',
        price DECIMAL(10,2) NOT NULL,
        discount_price DECIMAL(10,2) NULL,
        rating DECIMAL(2,1) DEFAULT 4.9,
        reviews_count INT DEFAULT 0,
        badge VARCHAR(60) NULL,
        featured BOOLEAN DEFAULT TRUE,
        trending BOOLEAN DEFAULT FALSE,
        description TEXT NULL,
        material TEXT NULL,
        origin VARCHAR(120) DEFAULT 'Handmade in Florence, Italy',
        color_name VARCHAR(80) NULL,
        color_hex VARCHAR(20) NULL,
        stock INT DEFAULT 20,
        brand VARCHAR(80) DEFAULT 'Velora',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Table `products` created.');

    // 4. Create Product Images Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url TEXT NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Table `product_images` created.');

    // 5. Create Product Sizes Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_sizes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        size VARCHAR(10) NOT NULL,
        stock INT DEFAULT 10,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Table `product_sizes` created.');

    // 6. Create Wishlist Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_wishlist (user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Table `wishlist` created.');

    // 7. Create Cart Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT DEFAULT 1,
        size VARCHAR(10) DEFAULT '9',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_cart_item (user_id, product_id, size),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Table `cart` created.');

    // 8. Create Orders Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_code VARCHAR(50) UNIQUE,
        user_id INT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Processing',
        payment_method VARCHAR(50) DEFAULT 'Card',
        shipping_address JSON NOT NULL,
        customer_name VARCHAR(120) NULL,
        customer_email VARCHAR(180) NULL,
        customer_phone VARCHAR(30) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Table `orders` created.');

    // 9. Create Order Items Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        size VARCHAR(10) DEFAULT '9',
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Table `order_items` created.');

    // 10. Create Newsletter Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS newsletter (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(180) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Table `newsletter` created.');

    // 11. Create Reviews Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NULL,
        author_name VARCHAR(100) NOT NULL,
        location VARCHAR(100) NULL,
        rating INT NOT NULL DEFAULT 5,
        title VARCHAR(255) NULL,
        comment TEXT NOT NULL,
        verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✓ Table `reviews` created.');

    // 12. Seed Admin and Demo User if not present
    const [existingAdmin] = await connection.query('SELECT id FROM users WHERE email = ?', ['admin@velora.studio']);
    if (existingAdmin.length === 0) {
      const adminPass = await bcrypt.hash('admin123', 10);
      await connection.query(
        'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
        ['Atelier Director', 'admin@velora.studio', '+39 055 218 902', adminPass, 'admin']
      );
      console.log('✓ Default Admin created (email: admin@velora.studio, password: admin123).');
    }

    const [existingDemo] = await connection.query('SELECT id FROM users WHERE email = ?', ['alexander@velora.studio']);
    if (existingDemo.length === 0) {
      const demoPass = await bcrypt.hash('password123', 10);
      await connection.query(
        'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
        ['Alexander Sterling', 'alexander@velora.studio', '+1 212 555 0188', demoPass, 'user']
      );
      console.log('✓ Default VIP Demo User created (email: alexander@velora.studio, password: password123).');
    }

    // 13. Seed Products, Images, and Sizes
    console.log('Seeding products catalog...');
    for (const p of productsCatalog) {
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

        // Insert Images
        for (let idx = 0; idx < p.images.length; idx++) {
          await connection.query(
            'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
            [productId, p.images[idx], idx === 0 ? 1 : 0]
          );
        }

        // Insert Sizes
        for (const size of p.sizes) {
          await connection.query(
            'INSERT INTO product_sizes (product_id, size, stock) VALUES (?, ?, ?)',
            [productId, size, 10]
          );
        }
      }
    }
    console.log('✓ Products, galleries, and size ranges populated.');

    console.log('=============================================');
    console.log('🎉 ALL TABLES & SEED DATA SUCCESSFULLY CREATED!');
    console.log('=============================================');
  } catch (err) {
    console.error('❌ Error setting up database:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

setup();
