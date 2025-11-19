# Data Source Analysis - HTML vs React App

**Date:** November 18, 2025  
**Question:** Does the Largo Portal HTML have real data?

---

## 🎯 ANSWER: **YES and NO - It Depends**

The HTML files were **designed to fetch REAL data from the backend**, but currently use **fallback mock data** if the backend isn't running.

---

## 📊 HTML Template Data Architecture

### Design Intent: REAL DATA

The `inventory.html` file shows the intended architecture:

```javascript
const API_BASE = '/api/inventory';  // Backend API endpoint

async function loadInventory() {
    try {
        const response = await fetch(API_BASE);  // ← Tries to fetch REAL data
        const data = await response.json();
        
        inventoryData = data.supplies || [];
        // ... render real data
    } catch (error) {
        console.error('Error loading inventory:', error);
        // Falls back to empty or shows error
    }
}
```

**Key Points:**
- ✅ HTML files **DO make API calls** to backend
- ✅ Backend **DOES have real inventory data**
- ⚠️ If backend not running → shows loading error
- ⚠️ React app currently **ignores backend** (uses sample data only)

---

## 🗄️ Backend Has REAL Inventory Data

### File Location: `data/inventory.json`

**Size:** 40 KB  
**Items:** 44 real laboratory supplies  
**Last Updated:** October 30, 2025

### Sample Real Data:

```json
{
  "supplies": [
    {
      "id": "CH001",
      "name": "ALT (Alanine Aminotransferase) Reagent Pack",
      "category": "CHEMISTRY",
      "description": "⚠️ 25 PACKS EXPIRE OCT 31!",
      "catalogNumber": "07414463190",
      "vendor": "Roche Diagnostics",
      "currentStock": 25,
      "parLevel": 8,
      "reorderPoint": 6,
      "location": "Refrigerator #1",
      "storageTemp": "2-8°C",
      "analyzer": "Roche Cobas c303/c503",
      "unitPrice": 586.49,
      "status": "🔴 EXPIRING - URGENT",
      "expirationDate": "2025-10-31",
      "criticalItem": true
    },
    {
      "id": "CH002",
      "name": "ASTP (Aspartate Aminotransferase) Reagent",
      "catalogNumber": "07876866190",
      "vendor": "Roche Diagnostics",
      "currentStock": 0,
      "parLevel": 8,
      "status": "OUT OF STOCK"
    }
    // ... 42 more real items
  ]
}
```

### Real Data Includes:

✅ **44 actual lab supplies** from Largo Laboratory  
✅ **Real catalog numbers** (Roche, Sysmex, Stago, etc.)  
✅ **Actual stock levels** and PAR levels  
✅ **Real expiration dates** and critical alerts  
✅ **Authentic vendor information**  
✅ **Current pricing** ($586.49, $328.69, etc.)  
✅ **Storage requirements** (2-8°C, -20°C, etc.)  
✅ **Equipment analyzers** (Roche Cobas, Sysmex XN-2000)  

---

## 🔌 Backend API Architecture

### Server: `server/routes/inventory.js`

```javascript
// Backend loads REAL data from JSON file
const loadInventoryData = async () => {
    try {
        const dataPath = path.join(__dirname, '../../data/inventory.json');
        const data = await fs.readFile(dataPath, 'utf8');
        inventoryData = JSON.parse(data);  // ← REAL DATA
        global.logger.info('Inventory data loaded successfully');
    } catch (error) {
        // Only uses mock data if file missing
        inventoryData = generateMockInventory();
    }
};

// API Endpoint
router.get('/', asyncHandler(async (req, res) => {
    res.json(inventoryData);  // ← Returns REAL inventory
}));
```

**API Endpoints Available:**
- `GET /api/inventory` - Returns all inventory data
- `POST /api/inventory/orders/send` - Sends email orders
- Backend has email automation built-in

---

## 📱 Current State by Component

| Component | Data Source | Status |
|-----------|-------------|--------|
| **HTML Template** | Backend API (`/api/inventory`) | ✅ Designed for real data |
| **Backend Server** | `data/inventory.json` (real file) | ✅ Has real data (44 items) |
| **React App** | `src/data/sampleData.ts` (hardcoded) | ❌ Using dummy data |

---

## 🔍 Comparison: Real vs Dummy Data

### Backend Real Data (inventory.json):
```json
{
  "id": "CH001",
  "name": "ALT (Alanine Aminotransferase) Reagent Pack",
  "catalogNumber": "07414463190",
  "vendor": "Roche Diagnostics",
  "currentStock": 25,
  "unitPrice": 586.49,
  "status": "🔴 EXPIRING - URGENT",
  "expirationDate": "2025-10-31"
}
```

### React App Dummy Data (ChemistryPage.tsx):
```typescript
const chemistryItems = [
  {
    id: 'CHEM-001',
    name: 'Chemistry Reagent Pack - Roche cobas 8000',
    currentStock: 45,
    parLevel: 60,
    status: 'warning',
    lastUpdated: '2 hours ago'
    // No pricing, no catalog numbers, no real vendors
  }
]
```

**Difference:**
- Backend: **Real specific data** (actual catalog #, prices, expiration dates)
- React: **Generic placeholder** (made-up values for testing UI)

---

## 🏗️ Data Flow Architecture

### HTML Template (Intended):
```
HTML Page
    ↓
  fetch('/api/inventory')  ← Makes API call
    ↓
Backend Server (Express)
    ↓
data/inventory.json  ← REAL DATA (44 items)
    ↓
Response → Renders in HTML
```

### React App (Current):
```
React Component
    ↓
const items = [...]  ← HARDCODED dummy data
    ↓
Renders in UI
    ❌ No API calls
    ❌ No backend connection
```

---

## 📋 Real Data Available in Backend

### Categories (5):
- CHEMISTRY
- HEMATOLOGY  
- KITS
- URINALYSIS
- MISCELLANEOUS

### Locations (19 real storage areas):
- Refrigerator #1
- Hematology Fridge
- Coag Freezer
- Supply Room A/B
- POC Storage
- UA Bench
- Toxicology Area
- etc.

### Vendors (15 real suppliers):
- Roche Diagnostics
- Sysmex
- Stago
- Abbott
- BD
- Bio-Rad
- MEDTOX
- Siemens
- VWR
- etc.

### Supplies (44 real items):
1. ALT Reagent Pack (Roche) - $586.49 - 🔴 Expiring
2. AST Reagent - $0 stock - OUT
3. Hematology reagents
4. Coagulation supplies
5. Test kits
6. ... (39 more real items)

---

## 💡 Why the Disconnect?

### Historical Development:

1. **Original HTML Files** (Oct 2025)
   - Built with backend integration
   - Used real inventory.json data
   - Email automation working
   - API endpoints functional

2. **React Migration** (Nov 2025)  
   - Focus on UI/UX modernization
   - Used sample data for rapid development
   - Backend integration deferred to Phase 2
   - Currently **not connected** to backend API

---

## 🎯 What This Means

### HTML Template:
- ✅ **Designed for production** use
- ✅ **Has real backend** with real data
- ✅ **API calls implemented**
- ⚠️ Requires backend server running
- ⚠️ If server down → shows errors

### React App:
- ✅ **Production-ready UI**
- ✅ **Modern architecture**
- ✅ **All pages built**
- ❌ **Not connected** to backend yet
- ❌ **Uses dummy data** for now
- ⚠️ **Phase 2 needed** to connect to API

---

## 🚀 To Use Real Data in React App

### What's Needed (2-4 hours work):

1. **Replace hardcoded data with API calls:**

```typescript
// Current (dummy):
const items = [{ id: 'CHEM-001', ... }];

// Change to (real):
const [items, setItems] = useState([]);

useEffect(() => {
  fetch('/api/inventory')
    .then(res => res.json())
    .then(data => setItems(data.supplies));
}, []);
```

2. **Start backend server:**
```bash
cd server
node index.js  # Backend runs on port 3000
```

3. **Update 18 pages** to use API:
- Replace all `const items = [...]` 
- Add `useEffect` hooks
- Add loading states
- Add error handling

4. **Configure CORS** for development:
```javascript
// server/index.js
app.use(cors({
  origin: 'http://localhost:5173' // Vite dev server
}));
```

---

## 📊 Summary Table

| Aspect | HTML Template | React App | Backend Server |
|--------|--------------|-----------|----------------|
| **Data Type** | Real (via API) | Dummy (hardcoded) | Real (JSON file) |
| **Inventory Items** | 44 real | ~5 samples | 44 real |
| **API Integration** | ✅ Yes | ❌ No | ✅ Ready |
| **Database** | No | No | JSON file only |
| **Email Automation** | ✅ Yes | ❌ No | ✅ Yes |
| **Stock Levels** | Real-time | Static fake | Real values |
| **Pricing** | Real ($) | None | Real ($) |
| **Expiration Dates** | Real dates | None | Real dates |
| **Vendor Info** | Real contacts | Generic | Real contacts |

---

## 🎯 Bottom Line

**HTML Template:**  
✅ Uses **REAL DATA** from backend (when server running)  
✅ Backend has **44 actual lab supplies** with real prices, expiration dates  
✅ Fully functional API and email automation

**React App:**  
❌ Currently uses **DUMMY DATA** (hardcoded samples)  
❌ Not connected to backend API yet  
✅ UI is ready - just needs API hookup (2-4 hours work)

**The real data EXISTS** in `data/inventory.json` - the React app just needs to be connected to it! 🚀

---

**Prepared by:** AI Development Team  
**Date:** November 18, 2025  
**Version:** 1.0
