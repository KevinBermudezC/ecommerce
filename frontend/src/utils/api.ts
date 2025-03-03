import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
	timeout: 10000, // 10 segundos de timeout
});

// Interceptor para añadir el token de autenticación desde localStorage si existe
api.interceptors.request.use(
	(config) => {
		console.log('🔄 Enviando petición a:', config.url);
		// Verificar si existe un token en localStorage
		const token = localStorage.getItem('authToken');
		if (token) {
			// Añadir el token al header Authorization
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		console.error('❌ Error en la petición:', error);
		return Promise.reject(error);
	}
);

// Interceptor para manejar errores de autenticación y otros errores comunes
api.interceptors.response.use(
	(response) => {
		console.log('✅ Respuesta recibida de:', response.config.url);
		return response;
	},
	(error) => {
		console.error('❌ Error en la respuesta:', {
			url: error.config?.url,
			status: error.response?.status,
			data: error.response?.data,
			message: error.message
		});

		// Si el error es 401 (Unauthorized) y no estamos en la página de login
		if (error.response?.status === 401 && !window.location.href.includes('login')) {
			console.error('Sesión expirada o usuario no autenticado');
			localStorage.removeItem('authToken');
			window.location.href = '/admin/login';
		}

		// Si es un error de red o el servidor no responde
		if (!error.response) {
			console.error('Error de red o servidor no disponible');
			error.message = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.';
		}

		return Promise.reject(error);
	}
);

export default api;