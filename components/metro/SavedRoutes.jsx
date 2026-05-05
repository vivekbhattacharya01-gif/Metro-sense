'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bookmark, Trash2, Edit2, Clock, MapPin, IndianRupee, Zap, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useBookmarkedRoutes } from '@/hooks/useBookmarkedRoutes.js';
import { useLanguage } from '@/lib/language-context';

export default function SavedRoutes() {
  const { t } = useLanguage();
  const bookmarkApi = useBookmarkedRoutes();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'frequent', 'name'

  const handleDelete = (routeId) => {
    if (confirm('Delete this saved route?')) {
      bookmarkApi.removeRoute(routeId);
    }
  };

  const handleStartEdit = (route) => {
    setEditingId(route.id);
    setEditName(route.name);
  };

  const handleSaveEdit = (routeId) => {
    if (editName.trim()) {
      bookmarkApi.renameRoute(routeId, editName);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleQuickAccess = (route) => {
    bookmarkApi.useRoute(route.id);
  };

  // Get sorted routes
  let displayRoutes = bookmarkApi.routes;

  // Filter by search
  if (searchQuery.trim()) {
    displayRoutes = bookmarkApi.searchRoutes(searchQuery);
  } else {
    // Sort by selected option
    if (sortBy === 'frequent') {
      displayRoutes = [...displayRoutes].sort((a, b) => (b.useCount || 0) - (a.useCount || 0));
    } else if (sortBy === 'recent') {
      displayRoutes = [...displayRoutes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'name') {
      displayRoutes = [...displayRoutes].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Bookmark className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Saved Routes</h1>
              <p className="text-indigo-100 text-sm">Your bookmarked commutes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {bookmarkApi.getTotalCount() > 0 ? (
        <>
          {/* Search and Sort */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Manage Routes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {!searchQuery && (
                <div className="flex gap-2">
                  <Button 
                    variant={sortBy === 'recent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('recent')}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Recent
                  </Button>
                  <Button 
                    variant={sortBy === 'frequent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('frequent')}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Frequent
                  </Button>
                  <Button 
                    variant={sortBy === 'name' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('name')}
                  >
                    A-Z
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Routes List */}
          {displayRoutes.length > 0 ? (
            <div className="space-y-3">
              {displayRoutes.map((route, idx) => (
                <Card 
                  key={route.id}
                  className="hover:shadow-md transition overflow-hidden"
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="space-y-3">
                      {/* Header Row */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          {editingId === route.id ? (
                            <div className="flex gap-2">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                autoFocus
                                className="flex-1"
                              />
                              <Button 
                                size="sm" 
                                onClick={() => handleSaveEdit(route.id)}
                              >
                                Save
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                              {route.name}
                            </h3>
                          )}
                        </div>
                        {route.useCount > 0 && (
                          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            Used {route.useCount}x
                          </Badge>
                        )}
                      </div>

                      {!editingId && (
                        <>
                          {/* Route Details */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="h-4 w-4" />
                              <span>{route.fromName}</span>
                              <span className="text-gray-400">→</span>
                              <span>{route.toName}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              {route.estimatedTime && (
                                <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  <Clock className="h-3 w-3 text-blue-500" />
                                  <span>{route.estimatedTime} min</span>
                                </div>
                              )}
                              {route.distance && (
                                <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  <MapPin className="h-3 w-3 text-green-500" />
                                  <span>{route.distance} km</span>
                                </div>
                              )}
                              {route.fare && (
                                <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  <IndianRupee className="h-3 w-3 text-orange-500" />
                                  <span>₹{route.fare}</span>
                                </div>
                              )}
                            </div>

                            {route.lines && route.lines.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {route.lines.map((lineId, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    Line {lineId}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {route.interchanges && route.interchanges.length > 0 && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {route.interchanges.length} interchange{route.interchanges.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleQuickAccess(route)}
                              className="flex-1"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              Go to Route
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStartEdit(route)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDelete(route.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-8 pb-8 text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? 'No routes found matching your search' : 'No saved routes yet'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Info Box */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-semibold mb-1">Save & Quick Access</p>
                  <p>Bookmark your favorite routes for quick access. Your saved routes are stored locally in your browser.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Bookmark className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                No Saved Routes Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Start by finding a route and save it for quick access
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
