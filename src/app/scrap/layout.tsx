import { ReactNode, Suspense } from 'react';

type LayoutProps = { children: ReactNode };
const Layout = ({ children }: LayoutProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
export default Layout;
