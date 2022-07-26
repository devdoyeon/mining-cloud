import Header from './Common/Header';
import SideBar from './Common/SideBar';

const Layout = ({ children }) => {
  return (
    <section className='content-container'>
      <SideBar />
      <div>
        <Header />
        {children}
      </div>
    </section>
  );
};

export default Layout;
