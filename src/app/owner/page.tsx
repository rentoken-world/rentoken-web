"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Property } from "@/types/api";

export default function OwnerDashboard() {
  const { t } = useI18n();
  const { address, isConnected } = useAccount();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    TotalValue: "",
    location: "",
    expectedYield: "",
    category: "residential" as const,
  });

  const fetchMyProperties = useCallback(async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/properties?owner=${address}`);
      const result = await response.json();
      if (result.success) {
        console.log('fetchMyProperties', result.data.data)
        setProperties(result.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      fetchMyProperties();
    }
  }, [isConnected, address, fetchMyProperties]);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    try {
      setCreateLoading(true);
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          TotalValue: parseInt(formData.TotalValue),
          expectedYield: parseFloat(formData.expectedYield),
          owner: address,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setShowCreateForm(false);
        setFormData({
          title: "",
          description: "",
          price: "",
          TotalValue: "",
          location: "",
          expectedYield: "",
          category: "residential",
        });
        fetchMyProperties(); // Refresh the list
      } else {
        alert("Failed to create property: " + result.error);
      }
    } catch (error) {
      console.error("Failed to create property:", error);
      alert("Failed to create property");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        fetchMyProperties(); // Refresh the list
      } else {
        alert("Failed to delete property: " + result.error);
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert("Failed to delete property");
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card variant="glass" className="p-12 text-center border-primary/30 backdrop-blur-sm">
            <div className="w-24 h-24 bg-gradient-sushi rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Owner{" "}
              <span className="neon-text bg-gradient-sushi bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Please connect your wallet to access the owner dashboard and start{" "}
              <span className="text-secondary font-semibold">tokenizing your properties</span>.
            </p>
            <Button variant="sushi" size="xl" className="shadow-xl">
              🦄 Connect Wallet
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <Card variant="glass" className="p-8 mb-8 border-primary/20 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Property{" "}
                <span className="neon-text bg-gradient-sushi bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your tokenized real estate portfolio
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="sushi"
              size="lg"
              className="shadow-xl animate-float"
            >
              🏠 Create Property
            </Button>
          </div>
        </Card>

        {/* Property Creation Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card variant="glass" className="max-w-2xl w-full border-primary/30">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Create New Property</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowCreateForm(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>
                <form onSubmit={handleCreateProperty} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-3 bg-background/50 border border-primary/30 rounded-lg backdrop-blur-sm focus:border-primary focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-3 bg-background/50 border border-primary/30 rounded-lg h-24 backdrop-blur-sm focus:border-primary focus:outline-none transition-colors resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full p-3 bg-background/50 border border-primary/30 rounded-lg backdrop-blur-sm focus:border-primary focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">Monthly Rent ($)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full p-3 bg-background/50 border border-primary/30 rounded-lg backdrop-blur-sm focus:border-primary focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">Token Supply</label>
                      <input
                        type="number"
                        value={formData.TotalValue}
                        onChange={(e) => setFormData({ ...formData, TotalValue: e.target.value })}
                        className="w-full p-3 bg-background/50 border border-primary/30 rounded-lg backdrop-blur-sm focus:border-primary focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                   
                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full p-3 bg-background/50 border border-primary/30 rounded-lg backdrop-blur-sm focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="residential">🏠 Residential</option>
                        <option value="commercial">🏢 Commercial</option>
                        <option value="industrial">🏭 Industrial</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={createLoading}
                      variant="sushi"
                      className="flex-1 shadow-lg disabled:opacity-50"
                    >
                      {createLoading ? "🔄 Creating..." : "✨ Create Property"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      variant="glass"
                      className="flex-1 border-primary/30 hover:border-primary"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}

        {/* Properties List */}
        {loading ? (
          <Card variant="glass" className="p-12 text-center border-primary/20">
            <div className="w-16 h-16 bg-gradient-sushi rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-2xl">🏠</span>
            </div>
            <p className="text-xl font-semibold neon-text">Loading your properties...</p>
          </Card>
        ) : !properties || properties.length === 0 ? (
          <Card variant="glass" className="p-12 text-center border-primary/20">
            <div className="w-24 h-24 bg-gradient-sushi-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <span className="text-4xl">🏗️</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">No Properties Yet</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
              You haven&apos;t created any properties yet. Start by{" "}
              <span className="text-secondary font-semibold">tokenizing your first property</span>.
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="sushi"
              size="lg"
              className="shadow-xl"
            >
              🚀 Create Your First Property
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties && properties.map((property) => (
              <Card key={property.id} variant="sushi" className="overflow-hidden backdrop-blur-sm">
                <div className="aspect-video bg-gradient-sushi-secondary/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                  <span className="text-4xl relative z-10">🏠</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-card-foreground">{property.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center">
                    📍 {property.location}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Rent:</span>
                      <span className="font-semibold neon-text bg-gradient-sushi bg-clip-text text-transparent">
                        ${(property.tokenPrice * property.totalTokens).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Tokens:</span>
                      <span className="font-semibold">{property.totalTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-semibold text-secondary">
                        {(property.totalTokens).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Yield:</span>
                      <span className="font-semibold text-secondary">{7}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === 'active' 
                          ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                          : property.status === 'funding'
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-destructive/20 text-destructive border border-destructive/30'
                      }`}>
                        {property.status === 'active' ? '✅ Active' : 
                         property.status === 'funding' ? '💰 Funding' : 
                         '⏸️ Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    {/* <Button variant="glass" className="flex-1 border-primary/30 hover:border-primary">
                      ✏️ Edit
                    </Button> */}
                    <Button 
                      onClick={() => handleDeleteProperty(property.id)}
                      variant="glass"
                      className="border-destructive/30 hover:border-destructive text-destructive hover:text-destructive"
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
