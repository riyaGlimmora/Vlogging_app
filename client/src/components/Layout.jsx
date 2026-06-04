import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</main>
  </div>
);

export default Layout;
