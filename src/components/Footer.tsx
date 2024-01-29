import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className="bg-white border-t h-0.5" >
      <div className="text-center">
        <p className="text-gray-600">© {new Date().getFullYear()} Jello. All rights reserved.</p>
        <p className="text-gray-500">Made with ❤️ by Nguyen Tien Viet</p>
      </div>
    </AntFooter>
  );
};

export default Footer;
