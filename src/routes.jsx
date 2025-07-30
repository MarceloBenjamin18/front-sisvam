import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  // Movemos auth como primera sección y configuramos sign-in como ruta principal
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
        isDefault: true, // Marcamos esta como la ruta por defecto
        hideFromMenu: true, // Ocultar del menú
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
        hideFromMenu: true, // Ocultar del menú
      },
    ],
  },
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
];

// Función helper para obtener la ruta por defecto
export const getDefaultRoute = () => {
  for (const section of routes) {
    for (const page of section.pages) {
      if (page.isDefault) {
        return `/${section.layout}${page.path}`;
      }
    }
  }
  // Fallback al sign-in si no se encuentra una ruta por defecto
  return "/auth/sign-in";
};

// Función helper para obtener solo las rutas visibles en el menú
export const getVisibleRoutes = () => {
  return routes.map(section => ({
    ...section,
    pages: section.pages.filter(page => !page.hideFromMenu)
  })).filter(section => section.pages.length > 0);
};

export default routes;