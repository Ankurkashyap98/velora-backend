import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import { protect, adminOnly } from './middleware/auth.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : '*';

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins === '*' || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin ${origin} not allowed`));
  },
  credentials: true
}));

app.use(express.json());

const sign = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Health checks
app.get('/', (_, res) => res.status(200).send('API running'));
app.get('/api/health', (_, res) => res.json({ status: 'Velora API online' }));
app.post('/api/auth/signup', async (req,res) => { try { const {name,email,phone,password}=req.body; if(!name||!email||!password) return res.status(400).json({message:'Name, email and password are required'}); const hash=await bcrypt.hash(password,12); const [result]=await pool.query('INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)',[name,email,phone,hash]); const user={id:result.insertId,name,email,phone,role:'user'}; res.status(201).json({user,token:sign(user)}); } catch(e){res.status(400).json({message:e.code==='ER_DUP_ENTRY'?'Email already registered':e.message});} });
app.post('/api/auth/login', async (req,res) => { try { const [rows]=await pool.query('SELECT * FROM users WHERE email=?',[req.body.email]); const user=rows[0]; if(!user||!(await bcrypt.compare(req.body.password,user.password))) return res.status(401).json({message:'Invalid credentials'}); delete user.password; res.json({user,token:sign(user)}); } catch(e){res.status(500).json({message:e.message});} });
app.get('/api/products', async (req,res)=>{ try { let sql='SELECT p.*, (SELECT image_url FROM product_images WHERE product_id=p.id ORDER BY is_primary DESC, id ASC LIMIT 1) image FROM products p WHERE 1=1'; const params=[]; if(req.query.category){sql+=' AND category=?';params.push(req.query.category)} if(req.query.gender){sql+=' AND gender=?';params.push(req.query.gender)} sql+=' ORDER BY created_at DESC'; const [rows]=await pool.query(sql,params);res.json(rows)}catch(e){res.status(500).json({message:e.message})} });
app.get('/api/products/:id', async (req,res)=>{try{const [[product]]=await pool.query('SELECT * FROM products WHERE id=?',[req.params.id]);if(!product) return res.status(404).json({message:'Product not found'});const [images]=await pool.query('SELECT image_url FROM product_images WHERE product_id=?',[req.params.id]);const imgList=images.map(i=>i.image_url);res.json({...product,images:imgList,image:imgList[0]||null})}catch(e){res.status(500).json({message:e.message})}});
app.get('/api/auth/profile', protect, async (req,res)=>{try{const [[user]]=await pool.query('SELECT id,name,email,phone,role,created_at FROM users WHERE id=?',[req.user.id]);res.json(user)}catch(e){res.status(404).json({message:'Profile not found'})}});
app.get('/api/cart', protect, async (req,res)=>{try{const [rows]=await pool.query('SELECT c.*,p.name,p.price,(SELECT image_url FROM product_images WHERE product_id=p.id LIMIT 1) image FROM cart c JOIN products p ON p.id=c.product_id WHERE c.user_id=?',[req.user.id]);res.json(rows)}catch(e){res.status(500).json({message:e.message})}});
app.post('/api/cart', protect, async (req,res)=>{try{await pool.query('INSERT INTO cart (user_id,product_id,quantity,size) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE quantity=quantity+VALUES(quantity)',[req.user.id,req.body.product_id,req.body.quantity||1,req.body.size]);res.status(201).json({message:'Added to cart'})}catch(e){res.status(400).json({message:e.message})}});
app.delete('/api/cart/:id', protect, async (req,res)=>{await pool.query('DELETE FROM cart WHERE id=? AND user_id=?',[req.params.id,req.user.id]);res.json({message:'Removed from cart'})});
app.get('/api/wishlist', protect, async (req,res)=>{const [rows]=await pool.query('SELECT w.id,p.* FROM wishlist w JOIN products p ON p.id=w.product_id WHERE w.user_id=?',[req.user.id]);res.json(rows)});
app.post('/api/wishlist', protect, async (req,res)=>{await pool.query('INSERT IGNORE INTO wishlist (user_id,product_id) VALUES (?,?)',[req.user.id,req.body.product_id]);res.status(201).json({message:'Saved to wishlist'})});
app.delete('/api/wishlist/:id', protect, async (req,res)=>{await pool.query('DELETE FROM wishlist WHERE id=? AND user_id=?',[req.params.id,req.user.id]);res.json({message:'Removed from wishlist'})});
app.get('/api/orders', protect, async (req,res)=>{const [rows]=await pool.query('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC',[req.user.id]);res.json(rows)});
app.post('/api/orders', protect, async (req,res)=>{try{const {total_amount,payment_method,shipping_address,customer_name,customer_email,customer_phone,items=[]}=req.body;const order_code=`VEL-${Math.floor(100000+Math.random()*900000)}`;let validUserId=req.user?.id||null;if(validUserId){const [[exists]]=await pool.query('SELECT id FROM users WHERE id=?',[validUserId]);if(!exists) validUserId=null;}if(!validUserId&&(customer_email||req.user?.email)){const [[byEmail]]=await pool.query('SELECT id FROM users WHERE email=?',[customer_email||req.user?.email]);if(byEmail) validUserId=byEmail.id;}if(!validUserId) validUserId=2;const connection=await pool.getConnection();await connection.beginTransaction();const [result]=await connection.query('INSERT INTO orders (user_id,order_code,total_amount,payment_method,shipping_address,customer_name,customer_email,customer_phone) VALUES (?,?,?,?,?,?,?,?)',[validUserId,order_code,total_amount,payment_method,JSON.stringify(shipping_address),customer_name||'',customer_email||req.user?.email||'',customer_phone||'']);for(const item of items){let pid=Number(item.product_id)||1;const [[pExists]]=await connection.query('SELECT id FROM products WHERE id=?',[pid]);if(!pExists) pid=1;await connection.query('INSERT INTO order_items (order_id,product_id,quantity,price,size) VALUES (?,?,?,?,?)',[result.insertId,pid,item.quantity||1,item.price||0,item.size||'9']);}await connection.commit();connection.release();res.status(201).json({id:result.insertId,order_code,status:'Pending'})}catch(e){console.error('Order creation error:',e);res.status(400).json({message:e.message})}});
app.get('/api/orders/:id', protect, async (req,res)=>{const [[order]]=await pool.query('SELECT * FROM orders WHERE id=? AND user_id=?',[req.params.id,req.user.id]);const [items]=await pool.query('SELECT oi.*,p.name FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE order_id=?',[req.params.id]);res.json({...order,items})});
app.get('/api/admin/stats', protect, adminOnly, async (_,res)=>{try{const [[users]]=await pool.query('SELECT COUNT(*) total FROM users');const [[products]]=await pool.query('SELECT COUNT(*) total FROM products');const [[orders]]=await pool.query('SELECT COUNT(*) total FROM orders');const [[revenue]]=await pool.query("SELECT COALESCE(SUM(total_amount),0) total FROM orders WHERE status <> 'Cancelled'");res.json({users:users.total,products:products.total,orders:orders.total,revenue:Number(revenue.total)})}catch(e){res.status(500).json({message:e.message})}});
app.get('/api/admin/users', protect, adminOnly, async (_,res)=>{try{const [rows]=await pool.query('SELECT id,name,email,phone,role,created_at FROM users ORDER BY created_at DESC');res.json(rows)}catch(e){res.status(500).json({message:e.message})}});
app.get('/api/admin/orders', protect, adminOnly, async (_,res)=>{try{const [rows]=await pool.query("SELECT o.*, COALESCE(NULLIF(o.customer_name,''), u.name, 'Velora Client') customer, COALESCE(NULLIF(o.customer_email,''), u.email, 'client@velora.studio') email FROM orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC");res.json(rows)}catch(e){res.status(500).json({message:e.message})}});
app.put('/api/admin/orders/:id/status', protect, adminOnly, async (req,res)=>{try{await pool.query('UPDATE orders SET status=? WHERE id=?',[req.body.status,req.params.id]);res.json({message:'Order status updated'})}catch(e){res.status(400).json({message:e.message})}});
app.post('/api/admin/products', protect, adminOnly, async (req,res)=>{try{const {name,slug,description,price,discount_price,category,gender,stock,featured,image_url,badge}=req.body;const [result]=await pool.query('INSERT INTO products (name,slug,description,price,discount_price,category,gender,stock,featured,badge) VALUES (?,?,?,?,?,?,?,?,?,?)',[name,slug||name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),description||'',price,discount_price||null,category||'Sneakers',gender||'Unisex',stock||0,featured?1:0,badge||'New Release']);if(image_url) await pool.query('INSERT INTO product_images (product_id,image_url,is_primary) VALUES (?,?,1)',[result.insertId,image_url]);res.status(201).json({id:result.insertId,message:'Product created'})}catch(e){res.status(400).json({message:e.message})}});
app.put('/api/admin/products/:id', protect, adminOnly, async (req,res)=>{try{const {name,description,price,discount_price,category,gender,stock,featured,badge,image_url}=req.body;await pool.query('UPDATE products SET name=?,description=?,price=?,discount_price=?,category=?,gender=?,stock=?,featured=?,badge=COALESCE(?,badge) WHERE id=?',[name,description,price,discount_price||null,category,gender,stock,featured?1:0,badge||null,req.params.id]);if(image_url){await pool.query('DELETE FROM product_images WHERE product_id=?',[req.params.id]);await pool.query('INSERT INTO product_images (product_id,image_url,is_primary) VALUES (?,?,1)',[req.params.id,image_url]);}res.json({message:'Product updated'})}catch(e){res.status(400).json({message:e.message})}});
app.delete('/api/admin/products/:id', protect, adminOnly, async (req,res)=>{try{await pool.query('DELETE FROM products WHERE id=?',[req.params.id]);res.json({message:'Product deleted'})}catch(e){res.status(400).json({message:e.message})}});
app.post('/api/newsletter',async(req,res)=>{try{await pool.query('INSERT IGNORE INTO newsletter (email) VALUES (?)',[req.body.email]);res.status(201).json({message:'Welcome to the Velora world'})}catch(e){res.status(400).json({message:e.message})}});
app.use((_,res)=>res.status(404).json({message:'Route not found'}));
app.listen(process.env.PORT||5000,()=>console.log(`Velora API running on ${process.env.PORT||5000}`));
