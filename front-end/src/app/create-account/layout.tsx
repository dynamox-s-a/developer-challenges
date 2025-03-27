'use client'
import { Layout } from './styles';

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
      return (
        <Layout>
            {children}
        </Layout>
    )
  }