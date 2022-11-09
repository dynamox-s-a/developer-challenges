import { AiOutlineLoading } from 'react-icons/ai'

export const Loading = () => {
  return (
    <div className="top-0 right-0 left-0 bottom-0 w-screen flex justify-center items-center h-screen fixed z-100 bg-[#fff]">
      <AiOutlineLoading className="animate-spin text-[#00091C]" size={200} />
    </div>
  )
}
