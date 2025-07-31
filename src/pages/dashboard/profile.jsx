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
  <div className="flex items-center gap-3 bg-white rounded-xl shadow p-3 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33%-0.75rem)] hover:shadow-md transition-shadow cursor-default">
    <div className={`rounded-full p-2 ${bg} flex-shrink-0`}>{icon}</div>
    <div className="text-sm">
      <div className="font-semibold text-gray-700">{label}</div>
      <div className="text-gray-500 text-xs">{value}</div>
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
      <div className="flex items-center justify-center min-h-screen bg-blue-gray-50">
        <Spinner className="h-12 w-12" />
        <Typography variant="h6" className="ml-4 text-blue-600">
          Cargando información del usuario...
        </Typography>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-gray-50 px-4 text-center">
        <ExclamationTriangleIcon className="h-16 w-16 mb-4 text-red-400" />
        <Typography variant="h4" className="mb-2 text-blue-gray-700">
          No hay información de usuario
        </Typography>
        <Typography variant="small" className="text-blue-gray-500 mb-4 max-w-xs">
          Por favor, inicie sesión nuevamente
        </Typography>
        <Button onClick={() => (window.location.href = "/auth/sign-in")} color="blue">
          Ir al Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Panel superior con degradado y blur */}
         <div className="relative h-44 w-full overflow-hidden rounded-t-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-xl z-10">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
            <Typography variant="h2" className="font-extrabold mb-1">
              Perfil de Usuario
            </Typography>
            <Typography variant="lead" className="opacity-90 max-w-xl">
              Sistema SISVAM 2.0 - Información de la Cuenta
            </Typography>
          </div>
        </div>

        {/* Panel blanco superpuesto */}
        <Card className="relative z-20 -translate-y-12 rounded-3xl shadow-lg border border-blue-gray-200 bg-white/90 backdrop-blur-md">
          <CardBody className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 border-b border-blue-gray-100 pb-6">
              <Avatar
                src="/iconos/user.png"
                alt={`${user.nombres} ${user.apellidos}`}
                size="xl"
                variant="rounded"
                className="rounded-xl shadow-lg border-4 border-white"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Typography variant="h3" color="blue-gray" className="font-bold truncate">
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
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500" />
                  <Typography variant="small" className="text-blue-gray-600 truncate">
                    {user.sucursal || "No especificada"}
                  </Typography>
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <Tooltip content="Cambiar tu contraseña">
                  <Button
                    onClick={() => setOpenModal(true)}
                    color="blue"
                    variant="outlined"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-blue-50 transition"
                  >
                    <KeyIcon className="h-4 w-4" />
                    Cambiar Contraseña
                  </Button>
                </Tooltip>

                <Tooltip content="Cerrar sesión en todos los dispositivos">
                  <Button
                    onClick={logout}
                    color="red"
                    variant="outlined"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-red-50 transition"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </Tooltip>
              </div>
            </div>

            <Tabs value={activeTab} className="mt-6">
             <TabsHeader className="m-0 bg-blue-gray-50 rounded-xl shadow-inner max-w-full">
  <Tab
    value="perfil"
    onClick={() => setActiveTab("perfil")}
    className="flex items-center gap-3 px-8 py-4 rounded-xl cursor-pointer hover:bg-blue-100 transition text-base font-semibold"
  >
    <span className="whitespace-nowrap">Información Personal</span>
  </Tab>
  <Tab
    value="sesion"
    onClick={() => setActiveTab("sesion")}
    className="flex items-center gap-3 px-8 py-4 rounded-xl cursor-pointer hover:bg-blue-100 transition text-base font-semibold"
  >
    <span className="whitespace-nowrap">Sesión</span>
  </Tab>
</TabsHeader>
              <TabsBody className="p-4">
                <TabPanel value="perfil">
                  <div className="flex flex-wrap gap-4">
                    {[
                      { icon: <IdentificationIcon className="h-4 w-4 text-white" />, label: "ID", value: `#${user.id}`, bg: "bg-blue-600" },
                      { icon: <IdentificationIcon className="h-4 w-4 text-white" />, label: "Carnet", value: user.ci, bg: "bg-green-600" },
                      { icon: <EnvelopeIcon className="h-4 w-4 text-white" />, label: "Correo", value: protectData(user.email), bg: "bg-purple-600" },
                      { icon: <UserIcon className="h-4 w-4 text-white" />, label: "Rol", value: user.rol, bg: "bg-indigo-600" },
                      { icon: <BuildingOfficeIcon className="h-4 w-4 text-white" />, label: "Sucursal", value: user.sucursal, bg: "bg-teal-600" },
                      { icon: <CalendarIcon className="h-4 w-4 text-white" />, label: "Último Acceso", value: formatDate(user.ultimo_acceso), bg: "bg-amber-600" },
                      { icon: <PhoneIcon className="h-4 w-4 text-white" />, label: "Teléfono", value: user.telefono ? protectData(user.telefono, 2) : "No proporcionado", bg: "bg-cyan-600" },
                      { icon: <KeyIcon className="h-4 w-4 text-white" />, label: "Cambio Contraseña", value: user.requiere_cambio_password ? "Sí" : "No", bg: "bg-yellow-700" },
                      { icon: <ClockIcon className="h-4 w-4 text-white" />, label: "Contraseña Vencida", value: user.password_vencida ? "Sí" : "No", bg: "bg-red-600" },
                    ].map((item, index) => (
                      <InfoCard key={index} {...item} />
                    ))}
                  </div>
                </TabPanel>

                <TabPanel value="sesion">
                  <div className="flex flex-wrap gap-4">
                    {loginResponse ? (
                      <>
                        <InfoCard
                          icon={<CheckCircleIcon className="h-4 w-4 text-white" />}
                          label="Estado de Login"
                          value={loginResponse.message}
                          bg="bg-green-600"
                        />
                        <InfoCard
                          icon={<ShieldCheckIcon className="h-4 w-4 text-white" />}
                          label="Autenticado"
                          value={loginResponse.success ? "✅ Sí" : "❌ No"}
                          bg="bg-green-800"
                        />
                        <InfoCard
                          icon={<ClockIcon className="h-4 w-4 text-white" />}
                          label="Hora Login"
                          value={formatDate(loginResponse.timestamp)}
                          bg="bg-indigo-500"
                        />
                        <InfoCard
                          icon={<CalendarIcon className="h-4 w-4 text-white" />}
                          label="Duración Sesión"
                          value="8 horas"
                          bg="bg-yellow-600"
                        />
                        <InfoCard
                          icon={<CpuChipIcon className="h-4 w-4 text-white" />}
                          label="Dispositivo"
                          value={navigator.userAgent.split(") ")[0].split(" (")[1] || "Desconocido"}
                          bg="bg-gray-700"
                        />
                      </>
                    ) : (
                      <div className="text-center w-full py-12">
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
          />
          <Input
            label="Confirmar Contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={() => setOpenModal(false)} className="mr-2">
            Cancelar
          </Button>
          <Button color="blue" onClick={handlePasswordChange}>
            Guardar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Profile;
