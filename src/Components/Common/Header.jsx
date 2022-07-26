import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <Link to='/' className='bold'>
        MINING CLOUD
      </Link>
    </header>
  );
};

export default Header;
