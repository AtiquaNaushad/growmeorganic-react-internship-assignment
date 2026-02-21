

import { useEffect, useState } from "react";
import { ArtworkTable } from "./components/ArtworkTable";
import type { Artwork } from "./types/artwork";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);

  const rowsPerPage = 12;


  const loadData = async (pageNumber: number) => {
    setLoading(true);

    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks?page=${pageNumber}`
    );

    const data = await response.json();

    setArtworks(data.data);
    setTotalRecords(data.pagination.total);

    setLoading(false);
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const handleSelectionChange = (rows: Artwork[]) => {
    const updated = new Set(selectedIds);
    const currentPageIds = artworks.map((a) => a.id);

    currentPageIds.forEach((id) => updated.delete(id));
    rows.forEach((row) => updated.add(row.id));

    setSelectedIds(updated);
  };

  const selectedRows = artworks.filter((art) =>
    selectedIds.has(art.id)
  );


  const onPageChange = (e: any) => {
    setFirst(e.first);
    setPage(e.page + 1);
  };

 
  const handleBulkSelect = async (count: number) => {
    if (count === 0) {
      setSelectedIds(new Set());
      return;
    }

    let collected = 0;
    let pageToFetch = 1;
    const newIds = new Set<number>();

    while (collected < count) {
      const res = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${pageToFetch}`
      );

      const data = await res.json();

      for (const item of data.data) {
        if (collected < count) {
          newIds.add(item.id);
          collected++;
        }
      }

      pageToFetch++;
    }

    setSelectedIds(newIds);
  };

  const firstRecord = (page - 1) * rowsPerPage + 1;
  const lastRecord = Math.min(page * rowsPerPage, totalRecords);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <Header/>
      <div className="mb-4 text-sm font-medium">
        Selected:{" "}
        <span className="text-blue-700 font-bold">
          {selectedIds.size} {" "}
        </span>
        rows
      </div>

      <ArtworkTable
        artworks={artworks}
        totalRecords={totalRecords}
        loading={loading}
        first={first}
        rowsPerPage={rowsPerPage}
        selectedRows={selectedRows}
        onPageChange={onPageChange}
        onSelectionChange={handleSelectionChange}
        onBulkSelect={handleBulkSelect}
        firstRecord={firstRecord}
        lastRecord={lastRecord}
      />

      <div className="flex-grow" />
      <Footer />
    </div>
  );
}

export default App;