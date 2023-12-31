import React from "react";
import { RouterProvider, useNavigate, createBrowserRouter, Outlet } from "react-router-dom";

import {
  ClerkProvider,
  ClerkLoaded,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";

import { Landing } from "@/modules/Landing/Landing";
import { Workspace, loader as workspaceLoader } from "@/modules/Workspace/Workspace";
import { WorkspaceForm, loader as workspaceFormLoader } from "@/modules/Workspace/WorkspaceForm/WorkspaceForm";
import { WorkspaceFormReply, loader as workspaceFormReplyLoader } from "@/modules/Workspace/WorkspaceForm/WorkspaceFormReply";
import { AppLayout } from "@/modules/layouts/AppLayout";
import { PageLayout } from "@/modules/layouts/PageLayout";
import { MailingComposer, loader as mailingComposerLoader } from "@/modules/Workspace/WorkspaceForm/MailingComposer";
import { ErrorBoundary } from "./ErrorBoundary";

if (!process.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const clerkPubKey = process.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    errorElement: <ErrorBoundary />,
    Component: () => {
      const navigate = useNavigate();
      return (
        <ClerkProvider
          publishableKey={clerkPubKey}
          navigate={(to) => navigate(to)}
        >
          <ClerkLoaded>
            <Outlet />
          </ClerkLoaded>
        </ClerkProvider>
      )
    },
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: "/",
            Component: Landing,
            errorElement: <ErrorBoundary />,
          },
        ]
      },
      {
        path: "/sign-in/*",
        Component: () => <SignIn routing="path" path="/sign-in" />
      },
      {
        path: "/sign-up/*",
        Component: () => <SignUp routing="path" path="/sign-up" />
      },
      {
        Component: PageLayout,
        children: [
          {
            path: "workspace",
            loader: workspaceLoader,
            Component: Workspace,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "workspace/form/:formId/",
            loader: workspaceFormLoader,
            Component: WorkspaceForm
          },
          {
            path: "workspace/form/:formId/:recipientId/",
            loader: workspaceFormReplyLoader,
            Component: WorkspaceFormReply
          },
          {
            path: "workspace/form/:formId/compose",
            loader: mailingComposerLoader,
            Component: () => <MailingComposer />
          }
        ]
      },
    ]
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
