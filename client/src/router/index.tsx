import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer/Footer";
import Loader from "@/components/common/Loader/Loader";
import ErrorPage from "@/pages/ErrorPage/index";

const Home = lazy(() => import("@/pages/Home/index"));
const About = lazy(() => import("@/pages/About/index"));
const Team = lazy(() => import("@/pages/Team/index"));
const PlayerProfile = lazy(() => import("@/pages/PlayerProfile/index"));
const Fixtures = lazy(() => import("@/pages/Fixtures/index"));
const News = lazy(() => import("@/pages/News/index"));
const NewsArticle = lazy(() => import("@/pages/NewsArticle/index"));
const Programs = lazy(() => import("@/pages/Programs/index"));
const ProgramDetail = lazy(() => import("@/pages/ProgramDetail/index"));
const Gallery = lazy(() => import("@/pages/Gallery/index"));
const Partners = lazy(() => import("@/pages/Partners/index"));
const Volunteer = lazy(() => import("@/pages/Volunteer/index"));
const Contact = lazy(() => import("@/pages/Contact/index"));
const NotFound = lazy(() => import("@/pages/NotFound/index"));

const PageSuspense: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={<Loader fullHeight />}>{children}</Suspense>;

const RootLayout: React.FC = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PageSuspense>
            <Home />
          </PageSuspense>
        ),
      },
      {
        path: "about",
        element: (
          <PageSuspense>
            <About />
          </PageSuspense>
        ),
      },
      {
        path: "team",
        element: (
          <PageSuspense>
            <Team />
          </PageSuspense>
        ),
      },
      {
        path: "team/:player_name",
        element: (
          <PageSuspense>
            <PlayerProfile />
          </PageSuspense>
        ),
      },
      {
        path: "fixtures",
        element: (
          <PageSuspense>
            <Fixtures />
          </PageSuspense>
        ),
      },
      {
        path: "news",
        element: (
          <PageSuspense>
            <News />
          </PageSuspense>
        ),
      },
      {
        path: "news/:slug",
        element: (
          <PageSuspense>
            <NewsArticle />
          </PageSuspense>
        ),
      },
      {
        path: "programs",
        element: (
          <PageSuspense>
            <Programs />
          </PageSuspense>
        ),
      },
      {
        path: "programs/:slug",
        element: (
          <PageSuspense>
            <ProgramDetail />
          </PageSuspense>
        ),
      },
      {
        path: "gallery",
        element: (
          <PageSuspense>
            <Gallery />
          </PageSuspense>
        ),
      },
      {
        path: "partners",
        element: (
          <PageSuspense>
            <Partners />
          </PageSuspense>
        ),
      },
      {
        path: "volunteer",
        element: (
          <PageSuspense>
            <Volunteer />
          </PageSuspense>
        ),
      },

      {
        path: "join",
        element: (
          <PageSuspense>
            <Volunteer />
          </PageSuspense>
        ),
      },
      {
        path: "contact",
        element: (
          <PageSuspense>
            <Contact />
          </PageSuspense>
        ),
      },
      {
        path: "404",
        element: (
          <PageSuspense>
            <NotFound />
          </PageSuspense>
        ),
      },
      {
        path: "*",
        element: (
          <PageSuspense>
            <NotFound />
          </PageSuspense>
        ),
      },
    ],
  },
]);

export default router;
