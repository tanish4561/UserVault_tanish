"use client"

import type { User } from "@/services/api"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface UserCardProps {
  user: User
  currentUserEmail: string
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export default function UserCard({ user, onEdit, onDelete,currentUserEmail }: UserCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-0">
        {/* <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            {user.first_name} {user.last_name}
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(user)}
              aria-label={`Edit ${user.first_name} ${user.last_name}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(user)}
              aria-label={`Delete ${user.first_name} ${user.last_name}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div> */}
        <div className="flex justify-between items-start">
  <CardTitle className="text-xl">
    {user.first_name} {user.last_name}
  </CardTitle>
  {/* Only show buttons if emails match */}
  {user.email === currentUserEmail && (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(user)}
        aria-label={`Edit ${user.first_name} ${user.last_name}`}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(user)}
        aria-label={`Delete ${user.first_name} ${user.last_name}`}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )}
</div>
      </CardHeader>
      <CardContent className="pt-4 pb-2 flex flex-col items-center flex-grow">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
          <AvatarFallback>
            {user.first_name[0]}
            {user.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        <p className="text-xs text-muted-foreground">User ID: {user.id}</p>
      </CardFooter>
    </Card>
  )
}

