import React from "react";
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
} from "@material-tailwind/react";
import {
  KeyIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export default function EmptyProfilePanels() {
  return (
    <div className="min-h-screen bg-blue-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Panel superior con degradado */}
        <div className="relative h-44 w-full overflow-hidden rounded-t-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-xl z-10">
  <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
    <Typography variant="h2" className="font-extrabold mb-1">
      Valores Municipales
    </Typography>
    <Typography variant="lead" className="opacity-90 max-w-xl">
      Sistema SISVAM 2.0 - Gestión de Valores Municipales
    </Typography>
  </div>
</div>

        {/* Panel blanco principal */}
        <Card className="relative z-20 -translate-y-12 rounded-3xl shadow-lg border border-blue-gray-200 bg-white/90 backdrop-blur-md">
          <CardBody className="p-6 md:p-8">
            {/* Sección de usuario */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 border-b border-blue-gray-100 pb-6">
              <Avatar
                src="/iconos/user.png"
                alt="Usuario"
                size="xl"
                variant="rounded"
                className="rounded-xl shadow-lg border-4 border-white"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Typography variant="h3" color="blue-gray" className="font-bold truncate">
                    Nombre de Usuario
                  </Typography>
                  <Chip
                    value="Sesión Activa"
                    color="green"
                    size="sm"
                    className="whitespace-nowrap"
                  />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                  <Typography variant="h5" className="font-medium text-blue-600 truncate">
                    Rol del Usuario
                  </Typography>
                </div>
                
                <div className="flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500" />
                  <Typography variant="small" className="text-blue-gray-600 truncate">
                    Sucursal/Organización
                  </Typography>
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <Button
                  color="blue"
                  variant="outlined"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-blue-50 transition"
                >
                  <KeyIcon className="h-4 w-4" />
                  Cambiar Contraseña
                </Button>

                <Button
                  color="red"
                  variant="outlined"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-red-50 transition"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>

            {/* Pestañas */}
            <Tabs value="perfil" className="mt-6">
              <TabsHeader className="m-0 bg-blue-gray-50 rounded-xl shadow-inner max-w-full">
                <Tab value="perfil" className="px-8 py-4 rounded-xl text-base font-semibold">
                  Valores Municipales
                </Tab>
                <Tab value="sesion" className="px-8 py-4 rounded-xl text-base font-semibold">
                  Detalles de los Valores Municipales
                </Tab>
              </TabsHeader>
              
              <TabsBody className="p-4">
                <TabPanel value="perfil">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 h-24 animate-pulse"></div>
                    ))}
                  </div>
                </TabPanel>
                
                <TabPanel value="sesion">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 h-24 animate-pulse"></div>
                    ))}
                  </div>
                </TabPanel>
              </TabsBody>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}