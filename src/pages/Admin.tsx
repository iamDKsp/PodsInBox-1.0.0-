import { useState, useEffect } from "react";
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    AlertTriangle,
    Plus,
    Edit,
    Trash2,
    Loader2,
    TrendingUp,
    Clock,
    Calendar,
    Phone,
    MapPin,
    Eye,
    CheckCircle,
    Truck,
    XCircle,
    RefreshCw
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { adminApi, productsApi, ordersApi } from "@/lib/api";
import { toast } from "sonner";

interface OrdersByStatus {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
}

interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    ordersByStatus: OrdersByStatus;
}

interface Product {
    id: string;
    name: string;
    flavor: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    category: string;
    stock: number;
    isNew: boolean;
    isBestSeller: boolean;
    isFeatured: boolean;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    address?: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    status: string;
    createdAt: string;
}

interface Customer {
    id: string;
    name: string;
    phone: string;
    address: string;
    orderCount: number;
    totalSpent: number;
    createdAt: string;
    updatedAt: string;
}

type DateFilterType = "day" | "week" | "month" | "year";
type TabType = "dashboard" | "products" | "orders" | "customers";

const Admin = () => {
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");
    const [dateFilter, setDateFilter] = useState<DateFilterType>("month");
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
    const [customerSearch, setCustomerSearch] = useState("");

    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState({
        name: "",
        flavor: "",
        description: "",
        price: "",
        originalPrice: "",
        image: "",
        category: "",
        stock: "",
        isNew: false,
        isBestSeller: false,
        isFeatured: false,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        loadDashboard(dateFilter);
    }, [dateFilter]);

    useEffect(() => {
        if (activeTab === "products") {
            loadProducts();
        } else if (activeTab === "orders") {
            loadOrders();
        } else if (activeTab === "customers") {
            loadCustomers();
        }
    }, [activeTab]);

    const loadDashboard = async (filter: DateFilterType) => {
        try {
            setIsLoading(true);
            const data = await adminApi.getDashboard(filter);
            setStats(data.stats);
            setLowStockProducts(data.lowStockProducts);
            setRecentOrders(data.recentOrders);
        } catch (error) {
            console.error("Error loading dashboard:", error);
            toast.error("Erro ao carregar dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            const data = await productsApi.getAll({});
            setProducts(data.products);
            setCategories(data.categories);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    const loadOrders = async () => {
        try {
            const data = await ordersApi.getAll();
            setOrders(data.orders);
        } catch (error) {
            console.error("Error loading orders:", error);
        }
    };

    const loadCustomers = async () => {
        try {
            const data = await adminApi.getCustomers();
            setCustomers(data.customers);
        } catch (error) {
            console.error("Error loading customers:", error);
            toast.error("Erro ao carregar clientes");
        }
    };

    const loadCustomerOrders = async (customer: Customer) => {
        try {
            const data = await adminApi.getCustomerOrders(customer.id);
            setSelectedCustomer(customer);
            setCustomerOrders(data.orders);
        } catch (error) {
            console.error("Error loading customer orders:", error);
            toast.error("Erro ao carregar pedidos do cliente");
        }
    };

    const handleDateFilterChange = (filter: DateFilterType) => {
        setDateFilter(filter);
    };

    const handleSaveProduct = async () => {
        try {
            const formatPrice = (value: string) => value.replace(',', '.');

            const formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('flavor', productForm.flavor);
            formData.append('description', productForm.description);
            formData.append('price', formatPrice(productForm.price));
            if (productForm.originalPrice) formData.append('originalPrice', formatPrice(productForm.originalPrice));
            if (selectedFile) {
                formData.append('image', selectedFile);
            } else if (productForm.image) {
                formData.append('image', productForm.image);
            }
            formData.append('category', productForm.category);
            formData.append('stock', productForm.stock);
            formData.append('isNew', String(productForm.isNew));
            formData.append('isBestSeller', String(productForm.isBestSeller));
            formData.append('isFeatured', String(productForm.isFeatured));

            if (editingProduct) {
                await productsApi.update(editingProduct.id, formData);
                toast.success("Produto atualizado!");
            } else {
                await productsApi.create(formData);
                toast.success("Produto criado!");
            }

            setIsProductDialogOpen(false);
            setEditingProduct(null);
            resetProductForm();
            loadProducts();
        } catch (error) {
            toast.error("Erro ao salvar produto");
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            flavor: product.flavor,
            description: product.description || "",
            price: product.price.toString(),
            originalPrice: product.originalPrice?.toString() || "",
            image: product.image,
            category: product.category,
            stock: product.stock.toString(),
            isNew: product.isNew,
            isBestSeller: product.isBestSeller,
            isFeatured: product.isFeatured || false,
        });
        setIsProductDialogOpen(true);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return;

        try {
            await productsApi.delete(id);
            toast.success("Produto excluído!");
            loadProducts();
        } catch (error) {
            toast.error("Erro ao excluir produto");
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        try {
            await ordersApi.updateStatus(orderId, status);
            toast.success("Status atualizado!");
            loadOrders();
            loadDashboard(dateFilter);
        } catch (error) {
            toast.error("Erro ao atualizar status");
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("Tem certeza que deseja remover este pedido do histórico?")) return;

        try {
            await adminApi.deleteOrder(orderId);
            toast.success("Pedido removido do histórico!");
            // Refresh customer orders if dialog is open
            if (selectedCustomer) {
                loadCustomerOrders(selectedCustomer);
            }
            loadOrders();
            loadDashboard(dateFilter);
        } catch (error) {
            toast.error("Erro ao remover pedido");
        }
    };

    const resetProductForm = () => {
        setProductForm({
            name: "",
            flavor: "",
            description: "",
            price: "",
            originalPrice: "",
            image: "",
            category: "",
            stock: "",
            isNew: false,
            isBestSeller: false,
            isFeatured: false,
        });
        setSelectedFile(null);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-500/20 text-yellow-500",
            confirmed: "bg-orange-500/20 text-orange-500",
            processing: "bg-blue-500/20 text-blue-500",
            shipped: "bg-purple-500/20 text-purple-500",
            delivered: "bg-green-500/20 text-green-500",
            cancelled: "bg-red-500/20 text-red-500",
        };
        const labels: Record<string, string> = {
            pending: "Pendente",
            confirmed: "Confirmado",
            processing: "Processando",
            shipped: "Enviado",
            delivered: "Entregue",
            cancelled: "Cancelado",
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const getFilterLabel = (filter: DateFilterType) => {
        const labels: Record<DateFilterType, string> = {
            day: "Hoje",
            week: "Esta Semana",
            month: "Este Mês",
            year: "Este Ano"
        };
        return labels[filter];
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.phone.includes(customerSearch)
    );

    if (isLoading && activeTab === "dashboard") {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center pt-32">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-28 pb-16">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                            <span className="text-gradient">Painel</span> Administrativo
                        </h1>
                        <p className="text-muted-foreground">
                            Gerencie produtos, pedidos e clientes
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 border-b border-border pb-4 overflow-x-auto">
                        <Button
                            variant={activeTab === "dashboard" ? "default" : "ghost"}
                            onClick={() => setActiveTab("dashboard")}
                        >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Dashboard
                        </Button>
                        <Button
                            variant={activeTab === "products" ? "default" : "ghost"}
                            onClick={() => setActiveTab("products")}
                        >
                            <Package className="w-4 h-4 mr-2" />
                            Produtos
                        </Button>
                        <Button
                            variant={activeTab === "orders" ? "default" : "ghost"}
                            onClick={() => setActiveTab("orders")}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Pedidos
                        </Button>
                        <Button
                            variant={activeTab === "customers" ? "default" : "ghost"}
                            onClick={() => setActiveTab("customers")}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Clientes
                        </Button>
                    </div>

                    {/* Dashboard Tab */}
                    {activeTab === "dashboard" && stats && (
                        <div className="space-y-8">
                            {/* Date Filter Buttons */}
                            <div className="flex flex-wrap items-center gap-2 p-4 glass rounded-xl">
                                <div className="flex items-center gap-2 mr-4">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-medium text-muted-foreground">Filtrar por:</span>
                                </div>
                                <div className="flex gap-2">
                                    {(["day", "week", "month", "year"] as DateFilterType[]).map((filter) => (
                                        <Button
                                            key={filter}
                                            variant={dateFilter === filter ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleDateFilterChange(filter)}
                                            className={dateFilter === filter ? "bg-primary" : ""}
                                        >
                                            {filter === "day" && "Dia"}
                                            {filter === "week" && "Semana"}
                                            {filter === "month" && "Mês"}
                                            {filter === "year" && "Ano"}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => loadDashboard(dateFilter)}
                                    className="ml-auto"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Period Label */}
                            <p className="text-sm text-muted-foreground">
                                Exibindo dados de: <span className="text-primary font-medium">{getFilterLabel(dateFilter)}</span>
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="glass rounded-xl p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-primary/20">
                                            <DollarSign className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Receita (Entregues)</p>
                                            <p className="text-2xl font-bold text-gradient">
                                                R$ {stats.totalRevenue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-accent/20">
                                            <ShoppingCart className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Pedidos</p>
                                            <p className="text-2xl font-bold">{stats.totalOrders}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-secondary/20">
                                            <Package className="w-6 h-6 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Produtos</p>
                                            <p className="text-2xl font-bold">{stats.totalProducts}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-green-500/20">
                                            <Users className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Clientes</p>
                                            <p className="text-2xl font-bold">{stats.totalUsers}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status Breakdown */}
                            <div className="glass rounded-xl p-6">
                                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-primary" />
                                    Pedidos por Status
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
                                        <Clock className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-yellow-500">{stats.ordersByStatus?.pending || 0}</p>
                                        <p className="text-xs text-muted-foreground">Pendentes</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 text-center">
                                        <CheckCircle className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-orange-500">{stats.ordersByStatus?.confirmed || 0}</p>
                                        <p className="text-xs text-muted-foreground">Confirmados</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
                                        <RefreshCw className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-blue-500">{stats.ordersByStatus?.processing || 0}</p>
                                        <p className="text-xs text-muted-foreground">Processando</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                                        <Truck className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-purple-500">{stats.ordersByStatus?.shipped || 0}</p>
                                        <p className="text-xs text-muted-foreground">Enviados</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-green-500">{stats.ordersByStatus?.delivered || 0}</p>
                                        <p className="text-xs text-muted-foreground">Entregues</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                                        <XCircle className="w-5 h-5 text-red-500 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-red-500">{stats.ordersByStatus?.cancelled || 0}</p>
                                        <p className="text-xs text-muted-foreground">Cancelados</p>
                                    </div>
                                </div>
                            </div>

                            {/* Low Stock Alert */}
                            {lowStockProducts.length > 0 && (
                                <div className="glass rounded-xl p-6 border border-yellow-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                        <h2 className="font-display font-bold text-lg">Estoque Baixo</h2>
                                    </div>
                                    <div className="space-y-2">
                                        {lowStockProducts.map(product => (
                                            <div key={product.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                                <span>{product.name}</span>
                                                <span className="font-bold text-yellow-500">{product.stock} unidades</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Orders */}
                            <div className="glass rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <h2 className="font-display font-bold text-lg">Pedidos Recentes</h2>
                                </div>
                                {recentOrders.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">Nenhum pedido no período</p>
                                ) : (
                                    <div className="space-y-3">
                                        {recentOrders.map(order => (
                                            <div key={order.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{order.customerName}</p>
                                                    <p className="text-sm text-muted-foreground">{order.id}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">R$ {order.total.toFixed(2)}</p>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === "products" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="font-display font-bold text-xl">
                                    {products.length} Produtos
                                </h2>
                                <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
                                    setIsProductDialogOpen(open);
                                    if (!open) {
                                        setEditingProduct(null);
                                        resetProductForm();
                                    }
                                }}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Novo Produto
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>
                                                {editingProduct ? "Editar Produto" : "Novo Produto"}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 pt-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Nome *</Label>
                                                    <Input
                                                        value={productForm.name}
                                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Sabor *</Label>
                                                    <Input
                                                        value={productForm.flavor}
                                                        onChange={(e) => setProductForm({ ...productForm, flavor: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Descrição</Label>
                                                <Input
                                                    value={productForm.description}
                                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Preço *</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={productForm.price}
                                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Preço Original</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={productForm.originalPrice}
                                                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Categoria *</Label>
                                                    <Select
                                                        value={productForm.category}
                                                        onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map(cat => (
                                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Estoque *</Label>
                                                    <Input
                                                        type="number"
                                                        value={productForm.stock}
                                                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Imagem do Produto</Label>
                                                <div className="flex flex-col gap-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setSelectedFile(e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Ou use uma URL (opcional se enviar arquivo):
                                                    </p>
                                                    <Input
                                                        value={productForm.image}
                                                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                                        placeholder="URL da imagem..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={productForm.isNew}
                                                        onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm">Novo</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={productForm.isBestSeller}
                                                        onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm">Mais Vendido</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={productForm.isFeatured}
                                                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm font-bold text-yellow-500">Destaque (Ouro)</span>
                                                </label>
                                            </div>
                                            <Button onClick={handleSaveProduct} className="w-full">
                                                {editingProduct ? "Salvar Alterações" : "Criar Produto"}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid gap-4">
                                {products.map(product => (
                                    <div key={product.id} className="glass rounded-xl p-4 flex items-center gap-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold">{product.name}</h3>
                                            <p className="text-sm text-muted-foreground">{product.flavor}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-primary font-bold">R$ {product.price.toFixed(2)}</span>
                                                <span className="text-muted-foreground">• {product.stock} em estoque</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === "orders" && (
                        <div className="space-y-6">
                            <h2 className="font-display font-bold text-xl">
                                {orders.length} Pedidos
                            </h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-16 glass rounded-xl">
                                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                    <p className="text-muted-foreground">Nenhum pedido ainda</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="glass rounded-xl p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-bold text-lg">{order.customerName}</p>
                                                    <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-xl text-gradient">
                                                        R$ {order.total.toFixed(2)}
                                                    </p>
                                                    <div className="mt-2">
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-border pt-4 mb-4">
                                                <p className="text-sm font-medium mb-2">Itens:</p>
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                                                        <span>{item.quantity}x {item.name}</span>
                                                        <span>R$ {(item.quantity * item.price).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-2">
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                                                >
                                                    <SelectTrigger className="w-48">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pendente</SelectItem>
                                                        <SelectItem value="confirmed">Confirmado</SelectItem>
                                                        <SelectItem value="processing">Processando</SelectItem>
                                                        <SelectItem value="shipped">Enviado</SelectItem>
                                                        <SelectItem value="delivered">Entregue</SelectItem>
                                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Customers Tab */}
                    {activeTab === "customers" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <h2 className="font-display font-bold text-xl">
                                    {customers.length} Clientes
                                </h2>
                                <Input
                                    placeholder="Buscar por nome ou telefone..."
                                    value={customerSearch}
                                    onChange={(e) => setCustomerSearch(e.target.value)}
                                    className="max-w-xs"
                                />
                            </div>

                            {filteredCustomers.length === 0 ? (
                                <div className="text-center py-16 glass rounded-xl">
                                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                    <p className="text-muted-foreground">
                                        {customerSearch ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado ainda"}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Clientes são criados automaticamente ao realizarem pedidos
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredCustomers.map(customer => (
                                        <div key={customer.id} className="glass rounded-xl p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-bold text-lg">{customer.name}</h3>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                        <Phone className="w-3 h-3" />
                                                        {customer.phone}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => loadCustomerOrders(customer)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            {customer.address && (
                                                <div className="flex items-start gap-1 text-sm text-muted-foreground mb-3">
                                                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                                    <span className="line-clamp-2">{customer.address.split('\n')[0]}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center pt-3 border-t border-border">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Pedidos</p>
                                                    <p className="font-bold">{customer.orderCount}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">Total Gasto</p>
                                                    <p className="font-bold text-primary">R$ {customer.totalSpent.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Customer Orders Dialog */}
                            <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Pedidos de {selectedCustomer?.name}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="glass rounded-lg p-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Telefone:</span>
                                                    <span className="ml-2 font-medium">{selectedCustomer?.phone}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Total de Pedidos:</span>
                                                    <span className="ml-2 font-medium">{selectedCustomer?.orderCount}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Total Gasto:</span>
                                                    <span className="ml-2 font-medium text-primary">R$ {selectedCustomer?.totalSpent.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Cliente desde:</span>
                                                    <span className="ml-2 font-medium">
                                                        {selectedCustomer && new Date(selectedCustomer.createdAt).toLocaleDateString("pt-BR")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <h4 className="font-bold">Histórico de Pedidos</h4>

                                        {customerOrders.length === 0 ? (
                                            <p className="text-muted-foreground text-center py-8">Nenhum pedido encontrado</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {customerOrders.map(order => (
                                                    <div key={order.id} className="bg-muted/50 rounded-lg p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">{order.id}</p>
                                                                <p className="text-sm">
                                                                    {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <div className="text-right flex items-start gap-2">
                                                                <div>
                                                                    <p className="font-bold">R$ {order.total.toFixed(2)}</p>
                                                                    {getStatusBadge(order.status)}
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDeleteOrder(order.id)}
                                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                    title="Remover pedido"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {order.items.map((item, idx) => (
                                                                <span key={idx}>
                                                                    {item.quantity}x {item.name}
                                                                    {idx < order.items.length - 1 ? ", " : ""}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;
