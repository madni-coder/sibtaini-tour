# Quick Reference: Database Operations

## 🗄️ Database Schema

### Tours Table
```typescript
{
  id: number              // Auto-increment primary key
  name: string           // Package name
  startDate: Date        // Tour start date
  endDate: Date          // Tour end date
  price: Decimal         // Price in INR
  from?: string          // Starting location
  to?: string            // Destination
  description?: string   // Package description
  images: string[]       // Array of image URLs
  createdAt: Date        // Auto-generated
  updatedAt: Date        // Auto-updated
}
```

### Gallery Table
```typescript
{
  id: number            // Auto-increment primary key
  imageUrl: string      // URL to image
  createdAt: Date       // Auto-generated
}
```

---

## 📝 Common Queries

### Tours

```javascript
import prisma from '@/lib/prisma'

// Get all tours
const tours = await prisma.tour.findMany({
  orderBy: { createdAt: 'desc' }
})

// Get single tour
const tour = await prisma.tour.findUnique({
  where: { id: 1 }
})

// Create tour
const newTour = await prisma.tour.create({
  data: {
    name: 'Premium Hajj 2026',
    startDate: new Date('2026-06-15'),
    endDate: new Date('2026-06-30'),
    price: 725000,
    from: 'Raipur',
    to: 'Mumbai',
    description: 'Luxury package with 5-star hotels',
    images: ['/cardPics/image1.jpg']
  }
})

// Update tour
const updated = await prisma.tour.update({
  where: { id: 1 },
  data: { 
    price: 750000,
    updatedAt: new Date()
  }
})

// Delete tour
await prisma.tour.delete({
  where: { id: 1 }
})

// Search tours
const searchResults = await prisma.tour.findMany({
  where: {
    OR: [
      { name: { contains: 'Hajj', mode: 'insensitive' } },
      { description: { contains: 'Hajj', mode: 'insensitive' } }
    ]
  }
})

// Filter by price range
const affordableTours = await prisma.tour.findMany({
  where: {
    price: {
      gte: 50000,  // Greater than or equal
      lte: 100000  // Less than or equal
    }
  }
})

// Get tours by date range
const upcomingTours = await prisma.tour.findMany({
  where: {
    startDate: {
      gte: new Date()
    }
  },
  orderBy: { startDate: 'asc' }
})
```

### Gallery

```javascript
// Get all images
const images = await prisma.gallery.findMany({
  orderBy: { createdAt: 'desc' }
})

// Add image
const newImage = await prisma.gallery.create({
  data: {
    imageUrl: '/public/image123.jpg'
  }
})

// Delete image
await prisma.gallery.delete({
  where: { id: 1 }
})

// Get latest N images
const latestImages = await prisma.gallery.findMany({
  take: 10,
  orderBy: { createdAt: 'desc' }
})
```

---

## 🔧 Advanced Queries

### Pagination
```javascript
const page = 1
const pageSize = 10

const tours = await prisma.tour.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
})

const totalCount = await prisma.tour.count()
const totalPages = Math.ceil(totalCount / pageSize)
```

### Count & Aggregate
```javascript
// Count tours
const tourCount = await prisma.tour.count()

// Average price
const avgPrice = await prisma.tour.aggregate({
  _avg: { price: true }
})

// Min/Max price
const priceRange = await prisma.tour.aggregate({
  _min: { price: true },
  _max: { price: true }
})
```

### Transactions
```javascript
// Multiple operations in a transaction
const result = await prisma.$transaction([
  prisma.tour.create({ data: { /*...*/ } }),
  prisma.gallery.create({ data: { /*...*/ } })
])

// Or using callback style
const [tour, gallery] = await prisma.$transaction(async (tx) => {
  const tour = await tx.tour.create({ data: { /*...*/ } })
  const gallery = await tx.gallery.create({ data: { /*...*/ } })
  return [tour, gallery]
})
```

---

## 🚀 Performance Tips

### 1. Select Only What You Need
```javascript
// Bad: fetches all fields
const tours = await prisma.tour.findMany()

// Good: select specific fields
const tours = await prisma.tour.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    startDate: true
  }
})
```

### 2. Use Connection Pooling
Already configured in your `.env`:
```
DATABASE_URL=...?pgbouncer=true&connection_limit=1
```

### 3. Use Indexes (if querying frequently)
```sql
-- Add in Supabase SQL Editor if needed
CREATE INDEX idx_tours_startdate ON tours("startDate");
CREATE INDEX idx_tours_price ON tours(price);
```

---

## 🔒 Security Best Practices

### Server-Side Only
```javascript
// ✅ GOOD: In API routes (server-side)
import prisma from '@/lib/prisma'
const tours = await prisma.tour.findMany()

// ❌ BAD: Don't use in client components
'use client'
import prisma from '@/lib/prisma' // This won't work!
```

### Use Supabase for Client-Side
```javascript
'use client'
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('tours')
  .select('*')
```

### Sanitize Input
```javascript
// Always validate and sanitize user input
const createTour = async (formData) => {
  const name = formData.get('name')?.toString().trim()
  
  if (!name || name.length < 3) {
    throw new Error('Name must be at least 3 characters')
  }
  
  return prisma.tour.create({
    data: { name, /* ... */ }
  })
}
```

---

## 🐛 Error Handling

```javascript
try {
  const tour = await prisma.tour.create({
    data: { /* ... */ }
  })
  return { success: true, tour }
} catch (error) {
  console.error('Database error:', error)
  
  if (error.code === 'P2002') {
    return { error: 'Tour already exists' }
  }
  
  if (error.code === 'P2003') {
    return { error: 'Foreign key constraint failed' }
  }
  
  return { error: 'Failed to create tour' }
}
```

---

## 📊 Useful Prisma Studio

Open visual database editor:
```bash
npx prisma studio
```

Browse to: http://localhost:5555

---

## 🔄 Schema Changes Workflow

1. Edit `prisma/schema.prisma`
2. Generate SQL: `npx prisma migrate dev --name description`
3. Or push directly: `npx prisma db push`
4. Generate client: `npx prisma generate`

---

## 📞 Support

- Prisma Docs: https://www.prisma.io/docs
- Supabase Docs: https://supabase.com/docs
- Your Schema: `/Volumes/Softwares/st/prisma/schema.prisma`
