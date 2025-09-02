import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { 
  Users, 
  User, 
  MapPin, 
  Wallet, 
  CreditCard, 
  Heart, 
  HeadphonesIcon,
  ChevronRight,
  Settings
} from 'lucide-react'
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createClient();
  const menuItems = [
    {
      icon: Users,
      label: "Refer a friend",
      href: "/profile/refer"
    },
    {
      icon: User,
      label: "My Details",
      href: "/profile/details"
    },
    {
      icon: MapPin,
      label: "Address book",
      href: "/profile/address"
    },
    {
      icon: Wallet,
      label: "Auction Wallet",
      href: "/profile/auction-wallet"
    },
    {
      icon: CreditCard,
      label: "Cash Wallet",
      href: "/profile/cash-wallet"
    },
    {
      icon: Heart,
      label: "Wishlist",
      href: "/profile/wishlist"
    },
    {
      icon: HeadphonesIcon,
      label: "Customer support",
      href: "/profile/support"
    }
  ]

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    // console.error("Error fetching user:", error?.message);
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-gray-900">My Account</h1>
          <Settings className="h-6 w-6 text-gray-600" />
        </div>
      </div>
     
      <div className="p-4">
        {/* Greeting */}
        <div className="mb-8 grid justify-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Hi,</h2>
          <p className="text-gray-500">User</p>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <Card key={index} className="transition-shadow cursor-pointer border-0 shadow-none">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <item.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}