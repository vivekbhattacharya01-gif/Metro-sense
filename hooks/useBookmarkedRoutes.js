import { useState, useEffect } from 'react';

/**
 * Custom hook for managing bookmarked routes
 * Stores routes in browser's localStorage
 */
export function useBookmarkedRoutes() {
  const [routes, setRoutes] = useState([]);
  const STORAGE_KEY = 'metro_bookmarked_routes';

  // Load routes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRoutes(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading bookmarked routes:', e);
      }
    }
  }, []);

  // Save routes to localStorage whenever they change
  const saveToStorage = (newRoutes) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRoutes));
    } catch (e) {
      console.error('Error saving bookmarked routes:', e);
    }
  };

  /**
   * Add a new bookmarked route
   */
  const addRoute = (route) => {
    const newRoute = {
      id: Date.now().toString(),
      name: route.name || `${route.from} → ${route.to}`,
      from: route.from,
      fromName: route.fromName,
      to: route.to,
      toName: route.toName,
      lines: route.lines || [],
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      fare: route.fare,
      interchanges: route.interchanges || [],
      createdAt: new Date().toISOString(),
      useCount: 0
    };

    const updated = [...routes, newRoute];
    setRoutes(updated);
    saveToStorage(updated);
    return newRoute;
  };

  /**
   * Remove a bookmarked route
   */
  const removeRoute = (routeId) => {
    const updated = routes.filter(r => r.id !== routeId);
    setRoutes(updated);
    saveToStorage(updated);
  };

  /**
   * Update a bookmarked route
   */
  const updateRoute = (routeId, updates) => {
    const updated = routes.map(r => 
      r.id === routeId ? { ...r, ...updates } : r
    );
    setRoutes(updated);
    saveToStorage(updated);
  };

  /**
   * Rename a bookmarked route
   */
  const renameRoute = (routeId, newName) => {
    updateRoute(routeId, { name: newName });
  };

  /**
   * Increment usage counter when route is used
   */
  const useRoute = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      updateRoute(routeId, { 
        useCount: (route.useCount || 0) + 1,
        lastUsed: new Date().toISOString()
      });
    }
  };

  /**
   * Get routes sorted by usage frequency
   */
  const getMostUsedRoutes = (limit = 5) => {
    return routes
      .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
      .slice(0, limit);
  };

  /**
   * Get routes sorted by recent usage
   */
  const getRecentRoutes = (limit = 5) => {
    return routes
      .filter(r => r.lastUsed)
      .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))
      .slice(0, limit);
  };

  /**
   * Search bookmarked routes
   */
  const searchRoutes = (query) => {
    const q = query.toLowerCase();
    return routes.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.fromName.toLowerCase().includes(q) ||
      r.toName.toLowerCase().includes(q)
    );
  };

  /**
   * Clear all bookmarked routes
   */
  const clearAllRoutes = () => {
    setRoutes([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Check if a route is bookmarked
   */
  const isBookmarked = (fromId, toId) => {
    return routes.some(r => r.from === fromId && r.to === toId);
  };

  /**
   * Get total saved routes count
   */
  const getTotalCount = () => routes.length;

  return {
    routes,
    addRoute,
    removeRoute,
    updateRoute,
    renameRoute,
    useRoute,
    getMostUsedRoutes,
    getRecentRoutes,
    searchRoutes,
    clearAllRoutes,
    isBookmarked,
    getTotalCount
  };
}

export default useBookmarkedRoutes;
