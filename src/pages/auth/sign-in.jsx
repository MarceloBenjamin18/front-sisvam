// src/pages/auth/sign-in.jsx
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
} from "@material-tailwind/react";

export function SignIn() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    ci: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validaciones básicas
    if (!formData.ci || !formData.password) {
      setError('Por favor completa todos los campos');
      setIsSubmitting(false);
      return;
    }

    // Validar que el CI solo contenga números
    if (!/^\d+$/.test(formData.ci)) {
      setError('El número de carnet debe contener solo números');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirigir al dashboard después del login exitoso
        navigate('/dashboard/home');
      } else {
        setError(result.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Iniciar Sesión
          </Typography>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardBody className="flex flex-col gap-4">
            {error && (
              <Alert color="red" className="mb-4">
                {error}
              </Alert>
            )}
            
            <Input
              type="text"
              label="Número de Carnet"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Ej: 12345678"
              maxLength="20"
            />
            
            <Input
              type="password"
              label="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </CardBody>
          
          <CardFooter className="pt-0">
            <Button
              type="submit"
              variant="gradient"
              fullWidth
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
            
            <Typography variant="small" className="mt-6 flex justify-center">
              ¿No tienes una cuenta?
              <Typography
                as="a"
                href="/auth/sign-up"
                variant="small"
                color="blue"
                className="ml-1 font-bold"
              >
                Regístrate
              </Typography>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default SignIn;