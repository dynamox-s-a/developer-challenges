import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable() {
  return (
    <div className="flex w-full rounded-md">

      <table className="min-w-full divide-y divide-gray-300 rounded-md">
        <thead className="bg-gray-100 rounded-lg">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Skeleton className="h-4 w-32" />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Skeleton className="h-4 w-32" />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Skeleton className="h-4 w-32" />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Skeleton className="h-4 w-32" />
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-100 divide-y divide-gray-300">
          {[...Array(9)].map((_, i) => (
            <tr key={i}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-4 w-40" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-4 w-40" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-4 w-40" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-4 w-40" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}