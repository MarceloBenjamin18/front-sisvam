import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
  Alert,
  Checkbox
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export function SignIn() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({ ci: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.ci || !formData.password) {
      setError('Por favor complete todos los campos');
      setIsSubmitting(false);
      return;
    }

    if (!/^\d+$/.test(formData.ci)) {
      setError('El número de carnet debe contener solo números');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login({ ...formData, rememberMe });
      if (result.success) {
        navigate('/dashboard/home');
      } else {
        setError(result.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-red-600 mx-auto"></div>
          </div>
          <Typography variant="h6" className="mt-4 text-blue-800 font-medium">
            Cargando...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-gray-50">
      {/* Panel izquierdo - Branding Municipal */}
      <div className="hidden lg:flex items-center justify-center bg-white relative overflow-hidden border-r border-gray-200">
        <div className="text-center z-10 px-8 max-w-md">
          <div className="mb-8 p-4">
            <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full shadow-sm border-2 border-blue-800 flex items-center justify-center">
              <svg className="w-20 h-20 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            
            <Typography variant="h3" className="mb-4 font-bold text-blue-800">
              Gobierno Autónomo Municipal
            </Typography>
            
            <Typography variant="lead" className="text-gray-700 mb-6">
              Sistema de Valores Municipales
            </Typography>
            
            <div className="h-1 bg-blue-800 my-6"></div>
            
            <Typography variant="small" className="text-gray-600">
              Plataforma de acceso autorizado
            </Typography>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-sm rounded-none border border-gray-200 bg-white">
          <CardHeader
            className="h-20 flex items-center justify-center bg-blue-800 shadow-none rounded-none"
          >
            <Typography variant="h4" color="white" className="font-medium">
              INGRESO AL SISTEMA
            </Typography>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4 p-8">
              {error && (
                <Alert color="red" className="mb-2 rounded-none border-l-4 border-red-600 bg-red-50">
                  <Typography variant="small" className="font-medium">
                    {error}
                  </Typography>
                </Alert>
              )}

              <div>
                <Input
                  type="text"
                  label="Número de Carnet"
                  name="ci"
                  size="lg"
                  value={formData.ci}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Ej: 12345678"
                  maxLength="20"
                  className="!border-gray-300 focus:!border-blue-800 rounded-none"
                  containerProps={{ className: "min-w-[100px]" }}
                  labelProps={{ className: "text-gray-700" }}
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Contraseña"
                  name="password"
                  size="lg"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="!border-gray-300 focus:!border-blue-800 pr-10 rounded-none"
                  containerProps={{ className: "min-w-[100px]" }}
                  labelProps={{ className: "text-gray-700" }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-blue-800"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="-mt-2 flex items-center justify-between">
                <Checkbox
                  label="Recordar credenciales"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  color="blue"
                  ripple={false}
                  className="hover:before:opacity-0 rounded-none border-gray-300"
                  containerProps={{ className: "p-0" }}
                />

                <Typography
                  as="a"
                  href="/auth/forgot-password"
                  variant="small"
                  className="font-medium text-blue-800 hover:underline"
                >
                  Recuperar contraseña
                </Typography>
              </div>
            </CardBody>

            <CardFooter className="pt-0 px-8 pb-8">
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isSubmitting}
                className="bg-blue-800 hover:bg-blue-900 shadow-none hover:shadow-none rounded-none font-medium"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  'INGRESAR'
                )}
              </Button>

              <div className="mt-6 text-center border-t border-gray-200 pt-4">
                <Typography variant="small" className="text-gray-600">
                  ¿Problemas técnicos? Contacte a: 
                  <Typography
                    as="a"
                    href="mailto:soporte@municipio.com"
                    variant="small"
                    className="ml-1 font-bold text-blue-800 hover:underline"
                  >
                    soporte@municipio.com
                  </Typography>
                </Typography>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default SignIn;