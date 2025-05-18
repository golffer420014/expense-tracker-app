'use client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
// import { LogOut, User } from 'lucide-react'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/lib/context/auth-context'
// import { useRouter } from 'next/navigation'

export function ProfileToggle() {
    // const router = useRouter()
    const { user, isAuthenticated, logout } = useAuth()

    const handleSignOut = async () => {
        logout()
    }

    return (
        isAuthenticated &&
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        {/* <AvatarImage src={user?.avatar_url} alt={user?.name || 'User'} /> */}
                        <AvatarFallback>
                            {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {/* {user?.email} */}
                            email@email.com
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>โปรไฟล์</span>
                </DropdownMenuItem> */}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>ออกจากระบบ</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
