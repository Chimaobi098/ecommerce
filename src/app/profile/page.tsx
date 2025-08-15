import { Header } from '@/components/layout/header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Bookmark, Settings } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="p-4">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src="/api/placeholder/96/96" />
            <AvatarFallback className="text-xl bg-black text-white">JD</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Jane Doe</h1>
          <p className="text-gray-600 mb-4">Fashion enthusiast</p>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">127</div>
              <div className="text-sm text-gray-600">Following</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">1.2k</div>
              <div className="text-sm text-gray-600">Followers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">89</div>
              <div className="text-sm text-gray-600">Likes</div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Liked Items</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bookmark className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Saved Items</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}