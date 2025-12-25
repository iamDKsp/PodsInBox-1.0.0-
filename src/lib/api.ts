const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string) => {
    localStorage.setItem('auth_token', token);
};

export const removeAuthToken = () => {
    localStorage.removeItem('auth_token');
};

const getHeaders = (includeAuth = true) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro');
    }

    return data;
};

// Auth API
export const authApi = {
    register: async (name: string, email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ name, email, password }),
        });
        return handleResponse(response);
    },

    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },

    getProfile: async () => {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    updateProfile: async (data: { name?: string; email?: string }) => {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
};

// Products API
export const productsApi = {
    getAll: async (params?: { search?: string; category?: string; sort?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.category) queryParams.append('category', params.category);
        if (params?.sort) queryParams.append('sort', params.sort);

        const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
            headers: getHeaders(false),
        });
        return handleResponse(response);
    },

    getById: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            headers: getHeaders(false),
        });
        return handleResponse(response);
    },

    create: async (product: Record<string, unknown> | FormData) => {
        const isFormData = product instanceof FormData;
        const headers = getHeaders();
        if (isFormData) {
            delete headers['Content-Type'];
        }

        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: headers,
            body: isFormData ? product : JSON.stringify(product),
        });
        return handleResponse(response);
    },

    update: async (id: string, product: Record<string, unknown> | FormData) => {
        const isFormData = product instanceof FormData;
        const headers = getHeaders();
        if (isFormData) {
            delete headers['Content-Type'];
        }

        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: headers,
            body: isFormData ? product : JSON.stringify(product),
        });
        return handleResponse(response);
    },

    delete: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};

// Orders API
export const ordersApi = {
    create: async (orderData: {
        items: Array<{ id: string; name: string; quantity: number }>;
        customerName: string;
        customerEmail: string;
        address?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify(orderData),
        });
        return handleResponse(response);
    },

    getMyOrders: async () => {
        const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getAll: async (status?: string) => {
        const queryParams = status ? `?status=${status}` : '';
        const response = await fetch(`${API_BASE_URL}/orders${queryParams}`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    updateStatus: async (id: string, status: string) => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    },
};

// Admin API
export const adminApi = {
    getDashboard: async (dateFilter?: 'day' | 'week' | 'month' | 'year') => {
        const queryParams = dateFilter ? `?dateFilter=${dateFilter}` : '';
        const response = await fetch(`${API_BASE_URL}/admin/dashboard${queryParams}`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getCustomers: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/customers`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getCustomerOrders: async (customerId: string) => {
        const response = await fetch(`${API_BASE_URL}/admin/customers/${customerId}/orders`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    deleteOrder: async (orderId: string) => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};
