
import { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import type { Artwork } from "../types/artwork";

interface Props {
    artworks: Artwork[];
    totalRecords: number;
    loading: boolean;
    first: number;
    rowsPerPage: number;
    selectedRows: Artwork[];
    onPageChange: (e: any) => void;
    onSelectionChange: (rows: Artwork[]) => void;
    onBulkSelect: (count: number) => void;
    firstRecord: number;
    lastRecord: number;
}

export const ArtworkTable = ({
    artworks,
    totalRecords,
    loading,
    first,
    rowsPerPage,
    selectedRows,
    onPageChange,
    onSelectionChange,
    onBulkSelect,
    firstRecord,
    lastRecord,
}: Props) => {
    const overlayRef = useRef<OverlayPanel>(null);
    const [rowCount, setRowCount] = useState<number>(0);

    return (
        <>

            <OverlayPanel ref={overlayRef}>
                <div className="p-4 w-80">
                    <div className="text-base font-medium mb-2">
                        Select Multiple Rows
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                        Enter number of rows to select across all pages
                    </div>

                    <div className="flex items-center gap-3">
                        <InputNumber
                            value={rowCount}
                            onValueChange={(e) => setRowCount(e.value ?? 0)}
                            min={0}
                            max={totalRecords}
                            className="w-full"
                        />


                        <Button
                            label="Select"
                            onClick={() => {
                                if (rowCount === 0) {
                                    onBulkSelect(0);
                                    overlayRef.current?.hide();
                                    return;
                                }

                                if (rowCount > 0) {
                                    onBulkSelect(rowCount);
                                }

                                overlayRef.current?.hide();
                            }}
                        />
                    </div>
                </div>
            </OverlayPanel>


            <DataTable
                value={artworks}
                lazy
                paginator
                rows={rowsPerPage}
                first={first}
                totalRecords={totalRecords}
                onPage={onPageChange}
                loading={loading}
                stripedRows
                dataKey="id"
                selectionMode="multiple"
                selection={selectedRows}
                onSelectionChange={(e) =>
                    onSelectionChange(e.value as Artwork[])
                }
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                paginatorLeft={
                    <span className="text-sm text-gray-600">
                        Showing <strong>{firstRecord}</strong> to{" "}
                        <strong>{lastRecord}</strong> of{" "}
                        <strong>{totalRecords}</strong> entries
                    </span>
                }
                className="shadow-md rounded-lg overflow-hidden bg-white"
            >

                <Column
                    selectionMode="multiple"
                    style={{ width: "3.5rem" }}
                    headerClassName="relative"
                    header={
                        <>
                            <i
                                className="pi pi-chevron-down absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-sm z-10"
                                onClick={(e) => overlayRef.current?.toggle(e)}
                            />
                        </>
                    }
                />


                <Column
                    field="title"
                    header="TITLE"
                    bodyClassName="text-l font-semibold text-black"
                    headerClassName="text-sm font-medium text-gray-600"
                />

                <Column
                    field="place_of_origin"
                    header="PLACE OF ORIGIN"
                    bodyClassName="text-sm text-gray-700"
                    headerClassName="text-sm font-medium text-gray-600"
                />

                <Column
                    field="artist_display"
                    header="ARTIST"
                    bodyClassName="text-sm text-gray-700"
                    headerClassName="text-sm font-medium text-gray-600"
                />


                <Column
                    field="inscriptions"
                    header="INSCRIPTIONS"
                    headerClassName="text-sm font-medium text-gray-600"
                    body={(row: Artwork) =>
                        row.inscriptions ? (
                            <span className="text-sm text-gray-700">
                                {row.inscriptions}
                            </span>
                        ) : (
                            <span className="text-sm text-gray-600">N/A</span>
                        )
                    }
                />

                <Column
                    field="date_start"
                    header="START DATE"
                    bodyClassName="text-sm text-gray-700"
                    headerClassName="text-sm font-medium text-gray-600"
                />

                <Column
                    field="date_end"
                    header="END DATE"
                    bodyClassName="text-sm text-gray-700"
                    headerClassName="text-sm font-medium text-gray-600"
                />
            </DataTable>
        </>
    );
};