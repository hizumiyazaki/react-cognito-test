'use client';
import { Button } from '@/app/components/ui/button';
import { removeIdToken } from '@/lib/cognitoClient';
import { useRouter } from 'next/navigation';
import React from 'react';

const Header = () => {
  const router = useRouter();
  const logout = () => {
    removeIdToken();
    router.push('/login');
  };

  return (
    <header>
      <nav className="flex gap-4 px-4 py-4 justify-end">
        <Button onClick={logout}>ログアウト</Button>
      </nav>
    </header>
  );
};

export default Header;
