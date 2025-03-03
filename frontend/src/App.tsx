import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Error404 from './pages/Error404';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ui/error-boundary';

// Importar las rutas de administración
import adminRoutes from './routes/admin.routes';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Routes>
                {/* Rutas con layout común */}
                <Route path="/" element={
                  <Layout>
                    <Home />
                  </Layout>
                } />
                <Route path="/products" element={
                  <Layout>
                    <ProductList />
                  </Layout>
                } />
                <Route path="/products/:id" element={
                  <Layout>
                    <ProductDetail />
                  </Layout>
                } />
                <Route path="/cart" element={
                  <Layout>
                    <Cart />
                  </Layout>
                } />
                <Route path="/auth" element={
                  <Layout>
                    <Auth />
                  </Layout>
                } />
                <Route path="/profile" element={
                  <Layout>
                    <Profile />
                  </Layout>
                } />
                <Route path="/men" element={
                  <Layout>
                    <ProductList />
                  </Layout>
                } />
                <Route path="/women" element={
                  <Layout>
                    <ProductList />
                  </Layout>
                } />
                <Route path="/kids" element={
                  <Layout>
                    <ProductList />
                  </Layout>
                } />
                
                {/* Redirección directa de /admin a /admin/login o donde corresponda */}
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                
                {/* Rutas de administración (tienen su propio layout) */}
                {adminRoutes.children.map((route, index) => (
                  <Route key={index} path={`/admin/${route.path || ''}`} element={route.element}>
                    {route.children?.map((childRoute, childIndex) => {
                      // Ruta con índice
                      if (childRoute.index) {
                        return <Route key={`${index}-${childIndex}-index`} index element={childRoute.element} />;
                      }
                      
                      // Si la ruta tiene hijos, renderizarlos anidados
                      if (childRoute.children) {
                        return (
                          <Route key={`${index}-${childIndex}`} path={childRoute.path} element={childRoute.element}>
                            {childRoute.children.map((grandChildRoute, grandChildIndex) => {
                              if (grandChildRoute.index) {
                                return <Route key={`${index}-${childIndex}-${grandChildIndex}-index`} index element={grandChildRoute.element} />;
                              }
                              return (
                                <Route 
                                  key={`${index}-${childIndex}-${grandChildIndex}`}
                                  path={grandChildRoute.path} 
                                  element={grandChildRoute.element} 
                                />
                              );
                            })}
                          </Route>
                        );
                      }
                      
                      // Ruta normal
                      return (
                        <Route 
                          key={`${index}-${childIndex}`}
                          path={childRoute.path} 
                          element={childRoute.element} 
                        />
                      );
                    })}
                  </Route>
                ))}
                
                {/* Página de error 404 para rutas no encontradas */}
                <Route path="*" element={<Error404 />} />
              </Routes>
              <Toaster richColors closeButton />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
