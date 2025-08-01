import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Chip,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Tooltip,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
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
  PhoneIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

const formatDate = (dateString) => {
  if (!dateString) return "No disponible";
  try {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  } catch {
    return dateString;
  }
};

const protectData = (data, visibleChars = 3) => {
  if (!data) return "No disponible";
  if (data.length <= visibleChars * 2) return data;
  return `${data.substring(0, visibleChars)}${"*".repeat(
    data.length - visibleChars * 2
  )}${data.slice(-visibleChars)}`;
};

const InfoCard = ({ icon, label, value, bg }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${bg} flex-shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-medium text-gray-800">{label}</h3>
      <p className="text-xs text-gray-500">{value}</p>
    </div>
  </div>
);

export function Profile() {
  const {
    user,
    loginResponse,
    loading,
    logout,
    requiresPasswordChange,
    passwordExpired,
    debugAuth,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("perfil");
  const [openModal, setOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    console.log("Nueva contraseña:", newPassword);
    setOpenModal(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      try {
        if (debugAuth && typeof debugAuth === "function") {
          debugAuth();
        }
      } catch (error) {
        console.error("Debug error:", error);
      }
    }
  }, [debugAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <ExclamationTriangleIcon className="h-16 w-16 mb-4 text-red-400" />
        <Typography variant="h4" className="mb-2 text-gray-700">
          No hay información de usuario
        </Typography>
        <Typography variant="small" className="text-gray-500 mb-4 max-w-xs">
          Por favor, inicie sesión nuevamente
        </Typography>
        <Button 
          onClick={() => (window.location.href = "/auth/sign-in")} 
          color="blue"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ir al Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Panel superior con degradado */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-48 w-full shadow-md">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white mb-2">Perfil de Usuario</h1>
          <p className="text-blue-100">Sistema SISVAM 2.0 - Información de la Cuenta</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 -mt-12 mb-12">
        <Card className="rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <CardBody className="p-0">
            {/* Encabezado del perfil */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 border-b border-gray-200 bg-white">
              <Avatar
                src="/iconos/user.png"
                alt={`${user.nombres} ${user.apellidos}`}
                size="xl"
                variant="rounded"
                className="rounded-xl shadow-lg border-4 border-white"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Typography variant="h3" color="gray" className="font-bold truncate">
                    {user.nombres} {user.apellidos}
                  </Typography>
                  {loginResponse?.success && (
                    <Chip
                      icon={<CheckCircleIcon className="h-4 w-4" />}
                      value="Sesión Activa"
                      color="green"
                      size="sm"
                      className="whitespace-nowrap"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                  <Typography variant="h5" className="font-medium text-blue-600 truncate">
                    {user.rol}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                  <Typography variant="small" className="text-gray-600 truncate">
                    {user.sucursal || "No especificada"}
                  </Typography>
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <Tooltip content="Cambiar tu contraseña">
                  <Button
                    onClick={() => setOpenModal(true)}
                    color="blue"
                    variant="filled"
                    size="sm"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <KeyIcon className="h-4 w-4" />
                    Cambiar Contraseña
                  </Button>
                </Tooltip>

                <Tooltip content="Cerrar sesión en todos los dispositivos">
                  <Button
                    onClick={logout}
                    color="red"
                    variant="filled"
                    size="sm"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </Tooltip>
              </div>
            </div>

            {/* Pestañas */}
            <div className="bg-white p-6">
              <Tabs value={activeTab}>
                <TabsHeader className="bg-gray-100 rounded-lg p-1 max-w-full">
                  <Tab
                    value="perfil"
                    onClick={() => setActiveTab("perfil")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'perfil' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    Información Personal
                  </Tab>
                  <Tab
                    value="sesion"
                    onClick={() => setActiveTab("sesion")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'sesion' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    Sesión
                  </Tab>
                </TabsHeader>
                <TabsBody className="mt-4">
                  <TabPanel value="perfil">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { icon: <IdentificationIcon className="h-5 w-5 text-white" />, label: "ID", value: `#${user.id}`, bg: "bg-blue-600" },
                        { icon: <IdentificationIcon className="h-5 w-5 text-white" />, label: "Carnet", value: user.ci, bg: "bg-green-600" },
                        { icon: <EnvelopeIcon className="h-5 w-5 text-white" />, label: "Correo", value: protectData(user.email), bg: "bg-purple-600" },
                        { icon: <UserIcon className="h-5 w-5 text-white" />, label: "Rol", value: user.rol, bg: "bg-indigo-600" },
                        { icon: <BuildingOfficeIcon className="h-5 w-5 text-white" />, label: "Sucursal", value: user.sucursal, bg: "bg-teal-600" },
                        { icon: <CalendarIcon className="h-5 w-5 text-white" />, label: "Último Acceso", value: formatDate(user.ultimo_acceso), bg: "bg-amber-600" },
                        { icon: <PhoneIcon className="h-5 w-5 text-white" />, label: "Teléfono", value: user.telefono ? protectData(user.telefono, 2) : "No proporcionado", bg: "bg-cyan-600" },
                        { icon: <KeyIcon className="h-5 w-5 text-white" />, label: "Cambio Contraseña", value: user.requiere_cambio_password ? "Sí" : "No", bg: "bg-yellow-700" },
                        { icon: <ClockIcon className="h-5 w-5 text-white" />, label: "Contraseña Vencida", value: user.password_vencida ? "Sí" : "No", bg: "bg-red-600" },
                      ].map((item, index) => (
                        <InfoCard key={index} {...item} />
                      ))}
                    </div>
                  </TabPanel>

                  <TabPanel value="sesion">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {loginResponse ? (
                        <>
                          <InfoCard
                            icon={<CheckCircleIcon className="h-5 w-5 text-white" />}
                            label="Estado de Login"
                            value={loginResponse.message}
                            bg="bg-green-600"
                          />
                          <InfoCard
                            icon={<ShieldCheckIcon className="h-5 w-5 text-white" />}
                            label="Autenticado"
                            value={loginResponse.success ? "✅ Sí" : "❌ No"}
                            bg="bg-green-800"
                          />
                          <InfoCard
                            icon={<ClockIcon className="h-5 w-5 text-white" />}
                            label="Hora Login"
                            value={formatDate(loginResponse.timestamp)}
                            bg="bg-indigo-500"
                          />
                          <InfoCard
                            icon={<CalendarIcon className="h-5 w-5 text-white" />}
                            label="Duración Sesión"
                            value="8 horas"
                            bg="bg-yellow-600"
                          />
                          <InfoCard
                            icon={<CpuChipIcon className="h-5 w-5 text-white" />}
                            label="Dispositivo"
                            value={navigator.userAgent.split(") ")[0].split(" (")[1] || "Desconocido"}
                            bg="bg-gray-700"
                          />
                        </>
                      ) : (
                        <div className="text-center w-full py-12 col-span-3">
                          <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <Typography variant="h6" className="text-gray-600">
                            No hay información de sesión disponible
                          </Typography>
                        </div>
                      )}
                    </div>
                  </TabPanel>
                </TabsBody>
              </Tabs>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal para cambiar contraseña */}
      <Dialog open={openModal} handler={() => setOpenModal(false)}>
        <DialogHeader>Cambiar Contraseña</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Input
            label="Nueva Contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Input
            label="Confirmar Contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </DialogBody>
        <DialogFooter>
          <Button 
            variant="text" 
            color="gray" 
            onClick={() => setOpenModal(false)} 
            className="mr-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button 
            color="blue" 
            onClick={handlePasswordChange}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Guardar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Profile;