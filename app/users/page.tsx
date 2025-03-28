"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { userService, type User, type ApiError } from "@/services/api"
import UserCard from "@/components/user-card"
import UserCardSkeleton from "@/components/user-card-skeleton"
import PaginationBar from "@/components/pagination-bar"
import ErrorFallback from "@/components/error-fallback"
import EditUserDialog from "@/components/edit-user-dialog"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

// Interface for tracking optimistic updates
interface OptimisticDelete {
  userId: number
  userData: User
}

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()

  // State management
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state management
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [email, setEmail] = useState("");

  // Optimistic update tracking
  const [optimisticDeletes, setOptimisticDeletes] = useState<OptimisticDelete[]>([])

  // Check for authentication and fetch initial data
  useEffect(() => {
const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);


    if (!cookies.auth_token) {
      router.push("/login");
    }
    else {
      // Redirect if email not found (optional)
      if (cookies.user_email) {
        setEmail(cookies.user_email);
    }
  }


    fetchUsers(1)
  }, [router])

  // Handle search filtering
  useEffect(() => {
    if (users.length > 0 && searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  // Fetch users from API
  const fetchUsers = async (page: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await userService.getUsers(page)
      setUsers(response.data)
      setFilteredUsers(response.data)
      setTotalPages(response.total_pages)
      setCurrentPage(page)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || "Failed to fetch users. Please try again.")

      // Handle unauthorized error
      if (apiError.status === 401) {
        router.push("/login")
      }
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setSearchQuery("") // Clear search when changing pages
      fetchUsers(page)
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    document.cookie = "auth_token=; path=/; max-age=0"
    router.push("/login")
  }

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  // Handle update user
  const handleUpdateUser = async (updatedUser: User): Promise<void> => {
    // Create a copy of the current users for rollback if needed
    const previousUsers = [...users]
    const previousFilteredUsers = [...filteredUsers]

    try {
      // Optimistic UI update
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
      setFilteredUsers(filteredUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)))

      // Make API call
      await userService.updateUser(updatedUser.id, updatedUser)

      // Close modal and show success toast
      setEditingUser(null)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch (error) {
      // Revert to previous state on error
      setUsers(previousUsers)
      setFilteredUsers(previousFilteredUsers)

      // Propagate error to the form component
      throw new Error("Failed to update user. Please try again.")
    }
  }

  // Handle delete user click
  const handleDeleteClick = (user: User) => {
    setDeletingUser(user)
  }

  // Handle delete user confirmation
  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deletingUser) return

    // Store user data for potential rollback
    const userToDelete = deletingUser
    const userIndex = users.findIndex((u) => u.id === userToDelete.id)

    try {
      // Optimistic UI update - remove from lists
      setUsers(users.filter((user) => user.id !== userToDelete.id))
      setFilteredUsers(filteredUsers.filter((user) => user.id !== userToDelete.id))

      // Track this delete operation
      setOptimisticDeletes((prev) => [...prev, { userId: userToDelete.id, userData: userToDelete }])

      // Close the dialog
      setDeletingUser(null)

      // Make API call
      await userService.deleteUser(userToDelete.id)

      // Remove from optimistic deletes tracking
      setOptimisticDeletes((prev) => prev.filter((item) => item.userId !== userToDelete.id))

      // Show success toast
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      // Restore the deleted user on error
      if (userIndex !== -1) {
        const newUsers = [...users]
        newUsers.splice(userIndex, 0, userToDelete)
        setUsers(newUsers)

        // Also restore in filtered list if it should be there
        if (
          !searchQuery ||
          userToDelete.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          userToDelete.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          userToDelete.email.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          const newFilteredUsers = [...filteredUsers]
          newFilteredUsers.splice(userIndex, 0, userToDelete)
          setFilteredUsers(newFilteredUsers)
        }
      }

      // Remove from optimistic deletes tracking
      setOptimisticDeletes((prev) => prev.filter((item) => item.userId !== userToDelete.id))

      // Propagate error to the dialog component
      throw new Error("Failed to delete user. Please try again.")
    }
  }

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeletingUser(null)
  }

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => <UserCardSkeleton key={`skeleton-${index}`} />)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">User Dashboard</h1>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {initialLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{renderSkeletons()}</div>
      ) : error ? (
        <ErrorFallback message={error} onRetry={() => fetchUsers(currentPage)} />
      ) : (
        <>
          {filteredUsers.length === 0 && !loading ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No users found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery ? "Try adjusting your search query" : "There are no users to display"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? renderSkeletons()
                // : filteredUsers.map((user) => (
                //     <UserCard key={user.id} user={user} onEdit={handleEditUser} onDelete={handleDeleteClick} />
                //   ))}
                : filteredUsers.map((user) => (
                  <UserCard 
                  key={user.id} 
                  user={user} 
                  currentUserEmail={email} // Pass the logged-in user's email
                  onEdit={handleEditUser} 
                  onDelete={handleDeleteClick} 
                />
                  ))}
            </div>
          )}

          {!searchQuery && (
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          )}
        </>
      )}

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog user={editingUser} onClose={() => setEditingUser(null)} onUpdate={handleUpdateUser} />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingUser && (
        <DeleteConfirmationDialog
          userName={`${deletingUser.first_name} ${deletingUser.last_name}`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          open={!!deletingUser}
        />
      )}
    </div>
  )
}

