# API Connection Guide - React to Backend

**Date:** November 19, 2025  
**Status:** ✅ CONNECTED

---

## 🎉 What Was Done

The React app is now **connected to the backend API** with real data!

### Changes Made:

1. **Created API Service** (`src/services/api.ts`)
   - Centralized API calls
   - TypeScript interfaces for type safety
   - Error handling built-in

2. **Created Custom Hook** (`src/hooks/useInventory.ts`)
   - Easy data fetching: `useInventory('CHEMISTRY')`
   - Loading and error states
   - Auto-refetch capability

3. **Updated Components**
   - ✅ ChemistryPage - Shows real data from inventory.json
   - ✅ HomePage - Real-time inventory stats

4. **Configured CORS** - Backend now allows:
   - http://localhost:5173 (Vite dev)
   - https://ugochi141.github.io (Production)

5. **Environment Variables**
   - `.env.development` - Points to localhost:3000
   - `.env.production` - Ready for production URL

---

## 🚀 How to Use

### Start Backend Server:

```bash
# Option 1: Use the start script
./start-backend.sh

# Option 2: Manual start
cd server
node index.js
```

**Backend will run on:** http://localhost:3000

### Start React App:

```bash
# In another terminal
npm run dev
```

**Frontend will run on:** http://localhost:5173

### View Real Data:

Navigate to:
- http://localhost:5173/inventory/chemistry

You'll see **44 real items** from `data/inventory.json`!

---

## 📊 Real Data Available

### Backend API Endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/inventory` | GET | Get all inventory data (44 items) |
| `/api/inventory/orders/send` | POST | Send email orders |
| `/api/health` | GET | Health check |

### Real Data Includes:

✅ **44 laboratory supplies**  
✅ **Real catalog numbers** (07414463190, etc.)  
✅ **Actual prices** ($586.49, $328.69, etc.)  
✅ **Real vendors** (Roche, Sysmex, Stago, Abbott, BD)  
✅ **Current stock levels**  
✅ **Expiration dates**  
✅ **Storage temperatures**  
✅ **Critical alerts** (OUT OF STOCK, EXPIRING, etc.)

---

## 🔌 API Service Usage

### Import and Use:

```typescript
import { useInventory } from '../hooks/useInventory';

function MyComponent() {
  // Get all inventory
  const { items, loading, error } = useInventory();
  
  // Or get by category
  const { items } = useInventory('CHEMISTRY');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{items.map(item => ...)}</div>;
}
```

### Direct API Calls:

```typescript
import { apiService } from '../services/api';

// Get all inventory
const data = await apiService.getInventory();

// Get specific category
const chemItems = await apiService.getInventoryByCategory('CHEMISTRY');

// Send order email
await apiService.sendInventoryOrder(['CH001', 'CH002']);
```

---

## 📁 Files Updated

### New Files:
- `src/services/api.ts` - API service layer
- `src/hooks/useInventory.ts` - Custom React hook
- `.env.development` - Dev environment config
- `.env.production` - Prod environment config
- `start-backend.sh` - Backend startup script
- `API_CONNECTION_GUIDE.md` - This file

### Modified Files:
- `src/pages/inventory/ChemistryPage.tsx` - Uses real data
- `src/pages/HomePage.tsx` - Real-time inventory stats
- `server/index.js` - Updated CORS for Vite

---

## 🎯 Data Flow

```
React Component
    ↓
useInventory('CHEMISTRY')
    ↓
API Service (fetch)
    ↓
http://localhost:3000/api/inventory
    ↓
Backend Express Server
    ↓
data/inventory.json (REAL DATA - 44 items)
    ↓
Returns JSON
    ↓
React Component renders REAL data
```

---

## 🧪 Testing

### 1. Test Backend:

```bash
# Start backend
./start-backend.sh

# In another terminal, test API
curl http://localhost:3000/api/inventory
```

You should see JSON with 44 supplies.

### 2. Test Frontend:

```bash
npm run dev
```

Navigate to: http://localhost:5173/inventory/chemistry

You should see:
- Real chemistry items with catalog numbers
- Actual prices (e.g., $586.49)
- Real vendor names (Roche Diagnostics)
- Expiration dates
- Storage temperatures

### 3. Test Error Handling:

Stop the backend server, then visit the chemistry page.  
You should see a helpful error message:
> "Error loading data: Failed to fetch. Make sure backend is running on port 3000"

---

## 🔄 Update More Pages

To connect other pages to real data, follow this pattern:

### Example: HematologyPage.tsx

```typescript
import { useInventory } from '../../hooks/useInventory';

const HematologyPage = () => {
  const { items, loading, error } = useInventory('HEMATOLOGY');
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {items.map(item => (
        <InventoryCard key={item.id} item={item} />
      ))}
    </div>
  );
};
```

---

## 🚨 Important Notes

### Development:
- Backend must be running for data to load
- If backend is down, pages show error messages
- CORS is configured for localhost:5173

### Production Deployment:
1. Deploy backend to Railway/Render/Heroku
2. Update `.env.production` with backend URL
3. Backend will need PostgreSQL database (currently using JSON file)
4. Update CORS to allow GitHub Pages domain

---

## 📊 Current vs Real Data Comparison

### BEFORE (Dummy Data):
```typescript
const items = [
  {
    id: 'CHEM-001',
    name: 'Chemistry Reagent Pack',
    currentStock: 45,
    status: 'warning'
  }
]
```

### AFTER (Real Data from API):
```json
{
  "id": "CH001",
  "name": "ALT (Alanine Aminotransferase) Reagent Pack",
  "catalogNumber": "07414463190",
  "vendor": "Roche Diagnostics",
  "currentStock": 25,
  "parLevel": 8,
  "unitPrice": 586.49,
  "status": "🔴 EXPIRING - URGENT",
  "expirationDate": "2025-10-31",
  "location": "Refrigerator #1",
  "storageTemp": "2-8°C",
  "analyzer": "Roche Cobas c303/c503"
}
```

---

## ✅ Pages Connected (So Far)

- ✅ **ChemistryPage** - Shows 44 real chemistry items
- ✅ **HomePage** - Real-time inventory stats

### To Connect:
- ⏳ HematologyPage
- ⏳ UrinalysisPage
- ⏳ CoagulationPage
- ⏳ KitsPage
- ⏳ OrderManagementPage
- ⏳ Staff pages
- ⏳ Schedule pages

Use the same pattern as ChemistryPage!

---

## 🎓 Next Steps

### Phase 1 (Now): ✅ COMPLETE
- ✅ API service created
- ✅ Custom hook implemented
- ✅ ChemistryPage connected
- ✅ HomePage connected
- ✅ CORS configured

### Phase 2 (Next):
- [ ] Connect remaining inventory pages
- [ ] Add loading skeletons
- [ ] Implement search/filter with API
- [ ] Add order functionality

### Phase 3 (Later):
- [ ] Replace JSON file with PostgreSQL
- [ ] Add authentication
- [ ] Deploy backend to cloud
- [ ] Real-time updates with WebSockets

---

## 🔧 Troubleshooting

### "Failed to fetch" Error:
**Solution:** Make sure backend is running:
```bash
./start-backend.sh
```

### Port 3000 already in use:
**Solution:** Kill existing process:
```bash
lsof -ti:3000 | xargs kill -9
```

### CORS errors:
**Check:** server/index.js has your frontend URL in allowedOrigins

### Data not loading:
1. Check backend console for errors
2. Verify `data/inventory.json` exists
3. Test API directly: `curl http://localhost:3000/api/inventory`

---

## 📞 Support

**Backend Server Issues:**
- Check `server/logs/` for error logs
- Verify Node.js version (v18+)
- Check `data/inventory.json` exists

**Frontend Issues:**
- Check browser console for errors
- Verify `.env.development` has correct API_URL
- Test API endpoint in browser

---

**Status:** ✅ **API CONNECTION COMPLETE**  
**Real Data:** ✅ **44 items from inventory.json**  
**Pages Connected:** 2 of 27 (ChemistryPage, HomePage)  
**Ready For:** Connecting remaining pages  

🎉 Your React app now uses REAL laboratory data! 🎉
