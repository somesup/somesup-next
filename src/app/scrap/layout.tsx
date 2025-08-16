import { ReactNode, Suspense } from 'react';

type LayoutProps = { children: ReactNode };
const Layout = ({ children }: LayoutProps) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};
export default Layout;
