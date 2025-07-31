import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import Valores from "@/pages/dashboard/Valores";  // <-- Importa tu componente Valores aquí
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
        isDefault: true,
        hideFromMenu: true,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
        hideFromMenu: true,
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
        icon: <HomeIcon {...icon} />,
        name: "valores",
        path: "/valores",
        element: <Valores />,  // <-- Aquí el componente debe ir en mayúscula
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Mi Perfil",
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

export const getDefaultRoute = () => {
  for (const section of routes) {
    for (const page of section.pages) {
      if (page.isDefault) {
        return `/${section.layout}${page.path}`;
      }
    }
  }
  return "/auth/sign-in";
};

export const getVisibleRoutes = () => {
  return routes
    .map((section) => ({
      ...section,
      pages: section.pages.filter((page) => !page.hideFromMenu),
    }))
    .filter((section) => section.pages.length > 0);
};

export default routes;
