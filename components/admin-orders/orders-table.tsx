'use client';

import { Order } from '@/lib/types';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle } from 'lucide-react';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Configure clean theme
const myTheme = themeQuartz.withParams({
  accentColor: '#3b82f6',
  backgroundColor: '#ffffff',
  foregroundColor: '#1f2937',
  borderColor: '#e5e7eb',
  headerBackgroundColor: '#f9fafb',
  headerTextColor: '#111827',
  rowBorder: true,
  columnBorder: true,
  headerColumnResizeHandleColor: '#d1d5db',
  borderRadius: 8,
  spacing: 12,
  headerFontSize: 14,
  headerFontWeight: 600,
  fontSize: 14,
  cellHorizontalPadding: 16,
  wrapperBorder: true,
  wrapperBorderRadius: 12,
});

interface OrdersTableProps {
  orders: Order[];
  onMarkAsDelivered: (orderId: string) => void;
  onViewDetails: (orderId: string) => void;
}

export function OrdersTable({ orders, onMarkAsDelivered, onViewDetails }: OrdersTableProps) {
  const columnDefs: ColDef<Order>[] = useMemo(() => [
    {
      headerName: 'Order ID',
      field: 'id',
      flex: 1.5,
      minWidth: 180,
      cellRenderer: (params: any) => (
        <div className="font-mono text-sm font-semibold text-blue-600">
          #{params.value.slice(0, 8).toUpperCase()}
        </div>
      ),
    },
    {
      headerName: 'Customer',
      field: 'customerName',
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params: any) => (
        <div>
          <div className="font-semibold text-gray-900 text-sm">
            {params.data.customerName}
          </div>
          <div className="text-xs text-gray-500">
            {params.data.customerPhone}
          </div>
        </div>
      ),
    },
    {
      headerName: 'Address',
      field: 'deliveryAddress',
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-700 line-clamp-2">
          {params.value}
        </div>
      ),
    },
    {
      headerName: 'Items',
      field: 'items',
      flex: 1,
      minWidth: 80,
      cellRenderer: (params: any) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          {params.data.items.length} items
        </span>
      ),
    },
    {
      headerName: 'Total',
      field: 'totalPrice',
      flex: 1,
      minWidth: 110,
      cellRenderer: (params: any) => (
        <div className="font-semibold text-gray-900">
          {params.value.toFixed(3)} DT
        </div>
      ),
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      flex: 1.2,
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="text-sm text-gray-600">
          {new Date(params.value).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>
      ),
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1.2,
      minWidth: 130,
      cellRenderer: (params: any) => {
        const isPending = params.value === 'pending';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
            isPending
              ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
              : 'bg-green-100 text-green-700 border-green-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isPending ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
            {isPending ? 'Pending' : 'Delivered'}
          </span>
        );
      },
    },
    {
      headerName: 'Actions',
      field: 'id',
      flex: 1.8,
      minWidth: 200,
      cellRenderer: (params: any) => {
        const handleDeliver = (e: any) => {
          e.stopPropagation();
          onMarkAsDelivered(params.data.id);
        };

        const handleViewDetails = (e: any) => {
          e.stopPropagation();
          onViewDetails(params.data.id);
        };

        return (
          <div className="flex items-center gap-2 h-full">
            <Button
              onClick={handleViewDetails}
              size="sm"
              className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs"
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              Details
            </Button>
            {params.data.status === 'pending' && (
              <Button
                onClick={handleDeliver}
                size="sm"
                className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white font-medium text-xs"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Deliver
              </Button>
            )}
          </div>
        );
      },
      cellStyle: { display: 'flex', alignItems: 'center', gap: '8px' } as any,
      sortable: false,
      filter: false,
    },
  ] as ColDef<Order>[], [onMarkAsDelivered, onViewDetails]);

  const defaultColDef: ColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div style={{ height: 600, width: '100%' }}>
        <AgGridReact
          theme={myTheme}
          rowData={orders}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          rowHeight={72}
          animateRows={true}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
}
