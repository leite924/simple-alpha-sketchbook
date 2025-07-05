
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RecifePrefeituraHomologation from '@/components/admin/payment/invoice/RecifePrefeituraHomologation';

const NFSeHomologation = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <RecifePrefeituraHomologation />
      </div>
    </MainLayout>
  );
};

export default NFSeHomologation;
