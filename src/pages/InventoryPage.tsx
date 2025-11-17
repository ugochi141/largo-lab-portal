import React, { useEffect, useMemo } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';

const InventoryPage: React.FC = () => {
  const items = useInventoryStore((state) => state.items);
  const categories = useInventoryStore((state) => state.categories);
  const locations = useInventoryStore((state) => state.locations);
  const filters = useInventoryStore((state) => state.filters);
  const loading = useInventoryStore((state) => state.loading);
  const error = useInventoryStore((state) => state.error);
  const updatedAt = useInventoryStore((state) => state.updatedAt);
  const hydrate = useInventoryStore((state) => state.hydrate);
  const setFilters = useInventoryStore((state) => state.setFilters);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.catalogNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.id.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.category === 'ALL' || item.category === filters.category;
      const matchesStatus = filters.status === 'ALL' || item.status === filters.status;
      const matchesLocation = filters.location === 'ALL' || item.location === filters.location;

      return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
    });
  }, [items, filters]);

  const criticalCount = useMemo(
    () => items.filter((item) => item.status === 'CRITICAL' || item.currentStock === 0).length,
    [items]
  );
  const lowStockCount = useMemo(
    () => items.filter((item) => item.status === 'WARNING').length,
    [items]
  );
  const totalValue = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (!item.unitPrice) return sum;
        return sum + item.unitPrice * item.currentStock;
      }, 0),
    [items]
  );

  const statusOptions: Array<{ label: string; value: 'ALL' | 'OK' | 'WARNING' | 'CRITICAL' }> = [
    { label: 'All Status', value: 'ALL' },
    { label: 'Stable', value: 'OK' },
    { label: 'Attention Needed', value: 'WARNING' },
    { label: 'Critical', value: 'CRITICAL' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Supply Readiness</p>
        <h1 className="text-3xl font-bold text-primary-700">Inventory Management</h1>
        <p className="text-neutral-600 mt-2">
          Real-time view of chemistry, hematology, urinalysis, and kit inventory with PAR monitoring.
        </p>
        <p className="text-sm text-neutral-400 mt-1">Updated: {new Date(updatedAt).toLocaleString()}</p>
      </div>

      {error && (
        <div className="bg-warning-50 border border-warning-200 text-warning-800 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <article className="card">
          <p className="text-sm text-neutral-500">Total Items</p>
          <p className="text-3xl font-bold text-neutral-900">{items.length}</p>
          <p className="text-xs text-neutral-500">Active SKUs in system</p>
        </article>

        <article className="card border border-danger-100 bg-danger-50">
          <p className="text-sm text-danger-600 font-semibold">Critical Items</p>
          <p className="text-3xl font-bold text-danger-700">{criticalCount}</p>
          <p className="text-xs text-danger-600">Below 30% PAR or zero stock</p>
        </article>

        <article className="card border border-warning-100 bg-warning-50">
          <p className="text-sm text-warning-700 font-semibold">Low Stock</p>
          <p className="text-3xl font-bold text-warning-800">{lowStockCount}</p>
          <p className="text-xs text-warning-700">Needs ordering this week</p>
        </article>

        <article className="card">
          <p className="text-sm text-neutral-500">Inventory Value</p>
          <p className="text-3xl font-bold text-neutral-900">
            {totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-neutral-500">Based on current stock</p>
        </article>
      </section>

      {/* Filters */}
      <section className="card mb-8" aria-label="Inventory filters">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="block text-sm font-semibold text-neutral-700">
            Search
            <input
              type="text"
              placeholder="Item name or catalog #"
              className="form-input mt-2"
              value={filters.search}
              onChange={(event) => setFilters({ search: event.target.value })}
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700">
            Category
            <select
              className="form-select mt-2"
              value={filters.category}
              onChange={(event) => setFilters({ category: event.target.value as typeof filters.category })}
            >
              <option value="ALL">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-neutral-700">
            Status
            <select
              className="form-select mt-2"
              value={filters.status}
              onChange={(event) => setFilters({ status: event.target.value as typeof filters.status })}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-neutral-700">
            Location
            <select
              className="form-select mt-2"
              value={filters.location}
              onChange={(event) => setFilters({ location: event.target.value as typeof filters.location })}
            >
              <option value="ALL">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Category Cards */}
      <section className="mb-8" aria-label="Category overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const itemsInCategory = items.filter((item) => item.category === category);
            const belowPar = itemsInCategory.filter((item) => item.currentStock <= item.parLevel * 0.5).length;

            return (
              <button
                key={category}
                className={`text-left border rounded-xl p-4 transition-all ${
                  filters.category === category ? 'bg-primary-50 border-primary-200' : 'bg-white hover:border-primary-200'
                }`}
                onClick={() =>
                  setFilters({ category: filters.category === category ? 'ALL' : (category as typeof filters.category) })
                }
              >
                <p className="text-sm text-neutral-500">Category</p>
                <p className="text-lg font-bold text-neutral-900">{category}</p>
                <p className="text-xs text-neutral-500 mt-1">{itemsInCategory.length} items tracked</p>
                <p className="text-sm font-semibold mt-2 text-danger-600">{belowPar} below PAR</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Inventory Table */}
      <section className="bg-white border border-neutral-100 rounded-xl shadow-soft overflow-hidden" aria-live="polite">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Inventory Items</h2>
            <p className="text-sm text-neutral-500">
              Showing {filteredItems.length} of {items.length} items
            </p>
          </div>
          {loading && <span className="text-sm text-neutral-400">Syncing inventory…</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Item</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Location</th>
                <th className="px-6 py-3 text-left font-semibold">Stock / PAR</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Lot / Expiration</th>
                <th className="px-6 py-3 text-left font-semibold">Vendor</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="px-6 py-3">
                    <p className="font-semibold text-neutral-900">{item.name}</p>
                    <p className="text-xs text-neutral-500">{item.catalogNumber}</p>
                  </td>
                  <td className="px-6 py-3">{item.category}</td>
                  <td className="px-6 py-3">{item.location}</td>
                  <td className="px-6 py-3">
                    <span className="font-semibold text-neutral-900">{item.currentStock}</span>
                    <span className="text-neutral-400"> / {item.parLevel} {item.unit}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'CRITICAL'
                          ? 'bg-danger-50 text-danger-700 border border-danger-200'
                          : item.status === 'WARNING'
                          ? 'bg-warning-50 text-warning-800 border border-warning-200'
                          : 'bg-success-50 text-success-700 border border-success-200'
                      }`}
                    >
                      {item.status === 'CRITICAL'
                        ? 'Critical'
                        : item.status === 'WARNING'
                        ? 'Attention Needed'
                        : 'Stable'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-neutral-600">
                    <p>Lot {item.lotNumber || '—'}</p>
                    <p className="text-xs text-neutral-500">
                      Expires {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : '—'}
                    </p>
                  </td>
                  <td className="px-6 py-3">{item.vendor}</td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-neutral-400" colSpan={7}>
                    No inventory items match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InventoryPage;
