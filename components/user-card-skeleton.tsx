import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-2 flex flex-col items-center flex-grow">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-4 w-48" />
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        <Skeleton className="h-3 w-20" />
      </CardFooter>
    </Card>
  )
}

