import React, { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Chip,
  Button,
  Alert,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Tooltip,
  Spinner
} from "@material-tailwind/react";
import { 
  ClockIcon, 
  KeyIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserIcon,
  EnvelopeIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

const UserDataField = ({ icon, label, value, color = 'blue', className = '' }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg border border-${color}-100 ${className}`}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <Typography variant="small" className={`font-bold text-${color}-800 uppercase`}>
        {label}
      </Typography>
    </div>
    <Typography variant="paragraph" className="text-blue-gray-800 break-words">
      {value || 'No disponible'}
    </Typography>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return 'No disponible';
  try {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  } catch {
    return dateString;
  }
};

const protectData = (data, visibleChars = 3) => {
  if (!data) return 'No disponible';
  if (data.length <= visibleChars * 2) return data;
  return `${data.substring(0, visibleChars)}${'*'.repeat(data.length - visibleChars * 2)}${data.slice(-visibleChars)}`;
};

export function Profile() {
  const { 
    user, 
    loginResponse, 
    loading, 
    logout,
    requiresPasswordChange,
    passwordExpired,
    debugAuth
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState("perfil");

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      try {
        if (debugAuth && typeof debugAuth === 'function') {
          debugAuth();
        }
      } catch (error) {
        console.error('Debug error:', error);
      }
    }
  }, [debugAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-gray-50">
        <div className="text-center">
          <Spinner className="h-12 w-12 mx-auto" />
          <Typography variant="h6" className="mt-4 text-blue-600">
            Cargando información del usuario...
          </Typography>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-gray-50">
        <ExclamationTriangleIcon className="h-16 w-16 mb-4 text-red-400" />
        <Typography variant="h4" className="mb-2 text-blue-gray-700">
          No hay información de usuario
        </Typography>
        <Typography variant="small" className="text-blue-gray-500 mb-4">
          Por favor, inicie sesión nuevamente
        </Typography>
        <Button onClick={() => window.location.href = '/auth/sign-in'} color="blue">
          Ir al Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative mb-8 h-40 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-xl">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Typography variant="h2" className="font-bold mb-2">
                Perfil de Usuario
              </Typography>
              <Typography variant="lead" className="opacity-90">
                Sistema SISVAM 2.0 - Información de la Cuenta
              </Typography>
            </div>
          </div>
        </div>


        <Card className="shadow-xl border border-blue-gray-100">
          <CardBody className="p-0">
            <div className="p-8 border-b border-blue-gray-100">
              <div className="flex items-center gap-6 flex-wrap">
                <Avatar
                  src="/iconos/user.png"
                  alt={`${user.nombres} ${user.apellidos}`}
                  size="xl"
                  variant="rounded"
                  className="rounded-xl shadow-lg border-4 border-white"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <Typography variant="h3" color="blue-gray" className="font-bold">
                      {user.nombres} {user.apellidos}
                    </Typography>
                    {loginResponse?.success && (
                      <Chip
                        icon={<CheckCircleIcon className="h-4 w-4" />}
                        value="Sesión Activa"
                        color="green"
                        size="sm"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="h-5 w-5 text-blue-500" />
                    <Typography variant="h5" className="font-medium text-blue-600">
                      {user.rol}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500" />
                    <Typography variant="small" className="text-blue-gray-600">
                      {user.sucursal || 'No especificada'}
                    </Typography>
                  </div>
                </div>
                <Tooltip content="Cerrar sesión en todos los dispositivos">
                  <Button
                    onClick={logout}
                    color="red"
                    variant="outlined"
                    size="sm"
                    className="flex items-center gap-2 ml-auto"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </Tooltip>
              </div>
            </div>

            <Tabs value={activeTab} className="w-full">
              <TabsHeader className="m-4 bg-blue-gray-50">
                <Tab value="perfil" onClick={() => setActiveTab("perfil")} className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Información Personal
                </Tab>
                <Tab value="sesion" onClick={() => setActiveTab("sesion")} className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Sesión
                </Tab>
              </TabsHeader>

              <TabsBody>
                <TabPanel value="perfil" className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <UserDataField
                      icon={<IdentificationIcon className="h-5 w-5 text-blue-600" />}
                      label="ID de Usuario"
                      value={`#${user.id}`}
                      color="blue"
                    />

                    <UserDataField
                      icon={<IdentificationIcon className="h-5 w-5 text-green-600" />}
                      label="Número de Carnet"
                      value={user.ci}
                      color="green"
                    />

                    <UserDataField
                      icon={<EnvelopeIcon className="h-5 w-5 text-purple-600" />}
                      label="Correo Electrónico"
                      value={protectData(user.email)}
                      color="purple"
                      className="md:col-span-2"
                    />

                    <UserDataField
                      icon={<UserIcon className="h-5 w-5 text-indigo-600" />}
                      label="Rol del Usuario"
                      value={user.rol}
                      color="indigo"
                    />

                    <UserDataField
                      icon={<BuildingOfficeIcon className="h-5 w-5 text-teal-600" />}
                      label="Sucursal"
                      value={user.sucursal}
                      color="teal"
                    />

                    <UserDataField
                      icon={<CalendarIcon className="h-5 w-5 text-amber-600" />}
                      label="Último Acceso"
                      value={formatDate(user.ultimo_acceso)}
                      color="amber"
                    />

                    <UserDataField
                      icon={<PhoneIcon className="h-5 w-5 text-cyan-600" />}
                      label="Teléfono"
                      value={user.telefono ? protectData(user.telefono, 2) : 'No proporcionado'}
                      color="cyan"
                    />

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <div className="flex items-center gap-2 mb-3">
                        <KeyIcon className="h-5 w-5 text-amber-600" />
                        <Typography variant="small" className="font-bold text-amber-800 uppercase">
                          Requiere Cambio de Contraseña
                        </Typography>
                      </div>
                      <Chip
                        value={user.requiere_cambio_password ? "Sí" : "No"}
                        color={user.requiere_cambio_password ? "amber" : "green"}
                        size="lg"
                        className="w-fit"
                      />
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <div className="flex items-center gap-2 mb-3">
                        <ClockIcon className="h-5 w-5 text-red-600" />
                        <Typography variant="small" className="font-bold text-red-800 uppercase">
                          Contraseña Vencida
                        </Typography>
                      </div>
                      <Chip
                        value={user.password_vencida ? "Sí" : "No"}
                        color={user.password_vencida ? "red" : "green"}
                        size="lg"
                        className="w-fit"
                      />
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value="sesion" className="p-6">
                  {loginResponse ? (
                    <div className="space-y-6">
                      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <Typography variant="h5" className="font-bold text-green-800 mb-4">
                          Estado de la Sesión
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Typography variant="small" className="font-semibold text-green-700 uppercase mb-1">
                              Estado del Login
                            </Typography>
                            <Chip
                              value={loginResponse.message}
                              color="green"
                              size="sm"
                              className="w-fit"
                            />
                          </div>
                          <div>
                            <Typography variant="small" className="font-semibold text-green-700 uppercase mb-1">
                              Autenticado
                            </Typography>
                            <Typography variant="h6">
                              {loginResponse.success ? "✅ Sí" : "❌ No"}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                          Datos Técnicos
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Typography variant="small" className="font-semibold text-gray-700 uppercase mb-1">
                              Hora de Login
                            </Typography>
                            <Typography variant="small" className="text-blue-gray-700">
                              {formatDate(loginResponse.timestamp)}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" className="font-semibold text-gray-700 uppercase mb-1">
                              Duración de Sesión
                            </Typography>
                            <Typography variant="small" className="text-blue-gray-700">
                              8 horas
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" className="font-semibold text-gray-700 uppercase mb-1">
                              Dispositivo
                            </Typography>
                            <Typography variant="small" className="text-blue-gray-700">
                              {navigator.userAgent.split(') ')[0].split(' (')[1] || 'Desconocido'}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <Typography variant="h6" className="text-gray-600">
                        No hay información de sesión disponible
                      </Typography>
                    </div>
                  )}
                </TabPanel>
              </TabsBody>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Profile;