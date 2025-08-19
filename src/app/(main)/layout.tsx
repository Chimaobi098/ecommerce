// app/(main)/layout.tsx
import type { Metadata } from 'next'
import { BottomNav } from '@/components/layout/bottomNav'

export const metadata: Metadata = {
  title: 'Seidou',
  description: 'Discover and shop the latest fashion trends',
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-50 mx-auto w-full max-w-md">
      <main className="min-h-screen pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}