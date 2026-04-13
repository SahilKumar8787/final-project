const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("ls_token") || null;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  // Auth
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/auth/me"),

  // Services
  getServices: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/services${q ? "?" + q : ""}`);
  },
  getService: (id) => request(`/services/${id}`),
  createService: (body) => request("/services", { method: "POST", body: JSON.stringify(body) }),
  updateService: (id, body) => request(`/services/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteService: (id) => request(`/services/${id}`, { method: "DELETE" }),

  // Bookings
  createBooking: (body) => request("/bookings", { method: "POST", body: JSON.stringify(body) }),
  getMyBookings: () => request("/bookings/my"),
  getAllBookings: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/bookings${q ? "?" + q : ""}`);
  },
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  deleteBooking: (id) => request(`/bookings/${id}`, { method: "DELETE" }),

  // Users
  getStats: () => request("/users/stats"),
  getAllUsers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/users${q ? "?" + q : ""}`);
  },
  toggleUserStatus: (id) => request(`/users/${id}/status`, { method: "PUT" }),

  // Contacts
  createContact: (body) => request("/contacts", { method: "POST", body: JSON.stringify(body) }),
  getContacts: () => request("/contacts"),
  deleteContact: (id) => request(`/contacts/${id}`, { method: "DELETE" }),
  updateProfile: (body) => request("/users/profile", { method: "PUT", body: JSON.stringify(body) }),
};

// Alias for social login
api.socialLogin = (body) => request("/auth/social", { method: "POST", body: JSON.stringify(body) });
