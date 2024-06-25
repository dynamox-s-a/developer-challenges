import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable() {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
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
      <tbody className="bg-white divide-y divide-gray-200">
        {[...Array(3)].map((_, i) => (
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
  );
}