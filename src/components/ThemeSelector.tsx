import React, { Suspense } from "react";
import { useAppSelector } from "../app/hooks";

const LightTheme = React.lazy(() => import("./Themes/LightTheme"));
const DarkTheme = React.lazy(() => import("./Themes/DarkTheme"));

export default function ThemeSelector({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDarkTheme = useAppSelector((state) => state.auth.isDarkTheme);
  return (
    <Suspense fallback={<></>}>
      {isDarkTheme ? (
        <DarkTheme>{children}</DarkTheme>
      ) : (
        <LightTheme>{children}</LightTheme>
      )}
    </Suspense>
  );
}