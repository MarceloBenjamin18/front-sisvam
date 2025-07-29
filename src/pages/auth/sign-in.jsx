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
import Folder from './Folder';

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
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto"></div>
          </div>
          <Typography variant="h6" className="mt-4 text-blue-600 font-medium">
            Cargando...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-blue-50">
      {/* Panel izquierdo - Branding con animación de folder */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-white"></div>
        <div className="text-center z-10 px-8 max-w-md">
          <div className="mb-8 p-4 flex flex-col items-center">
            <div className="w-full h-48 flex items-center justify-center mb-6">
              <Folder 
                size={2} 
                color="#3B82F6" 
                className="custom-folder"
              />
            </div>
            
            <Typography variant="h3" className="mb-4 font-bold text-white">
              Gobierno Municipal
            </Typography>
            
            <Typography variant="lead" className="text-blue-100 mb-6">
              Plataforma Digital Institucional
            </Typography>
            
            <div className="h-1 w-20 bg-blue-200/50 my-6 mx-auto rounded-full"></div>
            
            <Typography variant="small" className="text-blue-100/90">
              Acceso seguro para funcionarios autorizados
            </Typography>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg rounded-xl border border-blue-100 bg-white overflow-hidden">
          <CardHeader
            floated={false}
            shadow={false}
            className="h-24 flex items-center justify-center bg-blue-500 text-white rounded-t-xl"
          >
            <div className="text-center">
              <Typography variant="h4" className="font-bold">
                Iniciar Sesión
              </Typography>
              <Typography variant="small" className="text-blue-100 mt-1">
                Ingrese sus credenciales
              </Typography>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4 p-8">
              {error && (
                <Alert color="red" className="rounded-lg border-l-4 border-red-500 bg-red-50">
                  <Typography variant="small" className="font-medium text-red-700">
                    {error}
                  </Typography>
                </Alert>
              )}

              <div>
                <Typography variant="small" className="text-blue-800 font-medium mb-1">
                  Número de Carnet
                </Typography>
                <Input
                  type="text"
                  name="ci"
                  size="lg"
                  value={formData.ci}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Ej: 12345678"
                  maxLength="20"
                  className="!border-blue-200 focus:!border-blue-500 rounded-lg"
                  containerProps={{ className: "min-w-[100px]" }}
                  labelProps={{ className: "hidden" }}
                />
              </div>

              <div>
                <Typography variant="small" className="text-blue-800 font-medium mb-1">
                  Contraseña
                </Typography>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    size="lg"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="!border-blue-200 focus:!border-blue-500 pr-10 rounded-lg"
                    containerProps={{ className: "min-w-[100px]" }}
                    labelProps={{ className: "hidden" }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-blue-400 hover:text-blue-600"
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
              </div>

              <div className="flex items-center justify-between mt-2">
                <Checkbox
                  label={
                    <Typography variant="small" className="text-blue-800 font-normal">
                      Recordar credenciales
                    </Typography>
                  }
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  color="blue"
                  ripple={false}
                  className="rounded border-blue-300 checked:border-blue-500 hover:before:opacity-0"
                  containerProps={{ className: "p-0" }}
                />

                <Typography
                  as="a"
                  href="/auth/forgot-password"
                  variant="small"
                  className="font-medium text-blue-500 hover:text-blue-700 hover:underline"
                >
                  ¿Olvidó su contraseña?
                </Typography>
              </div>
            </CardBody>

            <CardFooter className="pt-0 px-8 pb-8">
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg rounded-lg font-medium transition-all duration-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </div>
                ) : (
                  'INGRESAR AL SISTEMA'
                )}
              </Button>

              <div className="mt-6 text-center border-t border-blue-100 pt-4">
                <Typography variant="small" className="text-blue-600">
                  ¿Necesita ayuda? Contacte a{' '}
                  <Typography
                    as="a"
                    href="mailto:soporte@municipio.com"
                    variant="small"
                    className="font-bold text-blue-700 hover:underline"
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