import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Package, Pencil, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Thunder Burger',
    description: 'Signature beef burger with special sauce',
    price: 18.0,
    category: 'Burgers',
    available: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Mega Combo',
    description: 'Burger + Fries + Drink combo deal',
    price: 32.5,
    category: 'Combos',
    available: true,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Kids Meal',
    description: 'Mini burger with fries and juice',
    price: 12.0,
    category: 'Kids',
    available: true,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'Fries Large',
    description: 'Crispy golden fries',
    price: 4.5,
    category: 'Sides',
    available: true,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop',
  },
  {
    id: '5',
    name: 'Soft Drink Large',
    description: 'Assorted sodas',
    price: 6.0,
    category: 'Drinks',
    available: false,
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=200&h=200&fit=crop',
  },
  {
    id: '6',
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with toppings',
    price: 8.0,
    category: 'Desserts',
    available: true,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop',
  },
];

const categories = ['All', 'Burgers', 'Combos', 'Kids', 'Sides', 'Drinks', 'Desserts'];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  const toggleAvailability = (productId: string) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, available: !p.available } : p)));
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your menu items</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-40 object-cover ${!product.available ? 'grayscale opacity-50' : ''}`}
              />
              {!product.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Badge variant="destructive">Unavailable</Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {product.category}
                  </Badge>
                </div>
                <span className="text-lg font-bold text-primary">RM {product.price.toFixed(2)}</span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={product.available}
                    onClick={() => toggleAvailability(product.id)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      product.available ? 'bg-green-500' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        product.available ? 'left-5' : 'left-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {product.available ? 'Available' : 'Unavailable'}
                  </span>
                </label>

                <Button variant="ghost" size="sm" onClick={() => openEditModal(product)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products in this category</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModal}>
          <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product Name</label>
                  <Input
                    defaultValue={editingProduct?.name || ''}
                    placeholder="Enter product name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    defaultValue={editingProduct?.description || ''}
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={3}
                    placeholder="Enter description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price (RM)</label>
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.price || ''}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      defaultValue={editingProduct?.category || 'Burgers'}
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {categories
                        .filter((c) => c !== 'All')
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    type="url"
                    defaultValue={editingProduct?.image || ''}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="button" className="flex-1" onClick={closeModal}>
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
