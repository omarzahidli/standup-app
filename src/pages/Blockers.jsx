import BlockerCard from "../components/BlockerCard";
import Sidebar from "../components/Sidebar";
import { useGetStandupsQuery } from "../store/standupsApi";
import { FiLoader } from "react-icons/fi";


export default function Blockers() {
  const { data: standups, isLoading, isFetching } = useGetStandupsQuery();
  const blockers = standups?.filter((s) => s.blockers?.length > 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 my-4 mx-6">
        <h1 className="text-center text-2xl md:text-4xl font-bold mb-6">Blockers</h1>

        {isLoading || isFetching ? (
          <div className="flex justify-center items-center mt-20">
            <FiLoader className="animate-spin" size={64} />
          </div>
        ) : (!blockers || blockers?.length === 0) ? (
          <div className="flex justify-center items-center mt-20 text-gray-500 text-lg">
            No blockers found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blockers?.map((blocker) => (
              <BlockerCard key={blocker.id} blocker={blocker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
