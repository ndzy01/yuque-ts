import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Link = ({ name, url }) => {
  const navigate = useNavigate();

  return (
    <Button type="link" onClick={() => navigate(url)}>
      {name}
    </Button>
  );
};

export default Link;
