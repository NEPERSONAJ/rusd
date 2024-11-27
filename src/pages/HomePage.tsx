import React from 'react';
import { Hero } from '../components/home/Hero';
import { Categories } from '../components/home/Categories';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Categories />
    </>
  );
};

export default HomePage; // Убедитесь, что экспорт только один
